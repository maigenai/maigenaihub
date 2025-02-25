from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import jwt
import json
from fastapi.security import OAuth2PasswordBearer
from database import SessionLocal, FreelancerModel, CompanyModel
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/profiles", tags=["profiles"])

# Definizioni di modelli
class PortfolioItem(BaseModel):
    title: str
    description: str
    url: str
    technologies: List[str]

class Freelancer(BaseModel):
    email: str
    experience: str = ""
    skills: List[str] = []
    portfolio: List[PortfolioItem] = []
    user_type: str = "Freelancer"
    hourly_rate: Optional[float] = None
    availability: Optional[str] = None

    # Metodi per convertire da/a dizionario
    @classmethod
    def from_db(cls, db_model):
        """Converte il modello del database in un modello Pydantic"""
        portfolio_list = []
        if db_model.portfolio:
            # Se è una stringa JSON, convertiamo in lista di dizionari
            if isinstance(db_model.portfolio, str):
                try:
                    portfolio_data = json.loads(db_model.portfolio)
                    if isinstance(portfolio_data, list):
                        for item in portfolio_data:
                            portfolio_list.append(PortfolioItem(**item))
                except Exception as e:
                    logger.error(f"Errore nella decodifica del portfolio: {str(e)}")
            # Se è già una lista di dizionari
            elif isinstance(db_model.portfolio, list):
                for item in db_model.portfolio:
                    if isinstance(item, dict):
                        portfolio_list.append(PortfolioItem(**item))
                    else:
                        # Se l'item è già un PortfolioItem o altro oggetto
                        portfolio_list.append(item)
                        
        return cls(
            email=db_model.email,
            experience=db_model.experience or "",
            skills=db_model.skills or [],
            portfolio=portfolio_list,
            user_type=db_model.user_type,
            hourly_rate=db_model.hourly_rate,
            availability=db_model.availability
        )

    def to_db_dict(self) -> Dict[str, Any]:
        """Converte il modello Pydantic in un dizionario adatto al database"""
        # Converti PortfolioItem in dizionari per la serializzazione JSON
        portfolio_list = []
        for item in self.portfolio:
            if isinstance(item, PortfolioItem):
                portfolio_list.append(item.dict())
            elif isinstance(item, dict):
                portfolio_list.append(item)
                
        return {
            "email": self.email,
            "experience": self.experience,
            "skills": self.skills,
            "portfolio": portfolio_list,  # Lista di dizionari, non oggetti PortfolioItem
            "user_type": self.user_type,
            "hourly_rate": self.hourly_rate,
            "availability": self.availability
        }

class UserProfile(BaseModel):
    email: str
    user_type: str
    # Campi specifici per freelancer
    experience: Optional[str] = None
    skills: Optional[List[str]] = None
    portfolio: Optional[List[PortfolioItem]] = None
    hourly_rate: Optional[float] = None
    availability: Optional[str] = None
    # Campi specifici per aziende
    name: Optional[str] = None
    description: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    location: Optional[str] = None

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.get("/me", response_model=UserProfile)
async def get_me(token: str = Depends(oauth2_scheme)):
    """
    Recupera il profilo dell'utente corrente basato sul token JWT
    """
    try:
        logger.debug("Tentativo di recupero profilo utente")
        
        # Decodifica il token per ottenere il tipo di utente e l'email
        payload = jwt.decode(token, os.getenv("JWT_SECRET", "your-secret-key"), algorithms=["HS256"])
        email = payload.get("sub")
        user_type = payload.get("user_type")
        
        if not email or not user_type:
            logger.error("Token mancante di sub o user_type")
            raise HTTPException(status_code=401, detail="Token invalido o scaduto")
        
        logger.debug(f"Utente autenticato: {email}, tipo: {user_type}")
        
        # Recupera i dati basati sul tipo di utente
        db = SessionLocal()
        try:
            if user_type == "Freelancer":
                user = db.query(FreelancerModel).filter(FreelancerModel.email == email).first()
                if not user:
                    logger.warning(f"Freelancer non trovato: {email}")
                    raise HTTPException(status_code=404, detail="Utente non trovato")
                
                # Costruisci un profilo completo per il freelancer
                freelancer = Freelancer.from_db(user)
                profile = UserProfile(
                    email=freelancer.email,
                    user_type=freelancer.user_type,
                    experience=freelancer.experience,
                    skills=freelancer.skills,
                    portfolio=freelancer.portfolio,
                    hourly_rate=freelancer.hourly_rate,
                    availability=freelancer.availability
                )
                
            elif user_type == "Company":
                company = db.query(CompanyModel).filter(CompanyModel.email == email).first()
                if not company:
                    logger.warning(f"Azienda non trovata: {email}")
                    raise HTTPException(status_code=404, detail="Azienda non trovata")
                
                # Costruisci un profilo completo per l'azienda
                profile = UserProfile(
                    email=company.email,
                    user_type=company.user_type,
                    name=company.name or "",
                    description=company.description or "",
                    industry=company.industry or "",
                    size=company.size or "",
                    location=company.location or ""
                )
                
            else:
                logger.error(f"Tipo utente non valido: {user_type}")
                raise HTTPException(status_code=400, detail="Tipo utente non valido")
            
            logger.debug(f"Profilo recuperato con successo")
            return profile
            
        finally:
            db.close()
            
    except jwt.PyJWTError as e:
        logger.error(f"Errore JWT: {str(e)}")
        raise HTTPException(status_code=401, detail="Token invalido o scaduto")
    except Exception as e:
        logger.error(f"Errore nel recupero del profilo: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Errore interno: {str(e)}")

@router.get("/", response_model=List[Freelancer])
async def get_freelancers(token: str = Depends(oauth2_scheme)):
    """
    Recupera tutti i profili dei freelancer
    """
    try:
        db = SessionLocal()
        freelancers = db.query(FreelancerModel).all()
        
        result = []
        for f in freelancers:
            result.append(Freelancer.from_db(f))
        
        return result
    except Exception as e:
        logger.error(f"Errore nel recupero dei freelancer: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@router.post("/", response_model=Freelancer)
async def create_profile(profile: Freelancer, token: str = Depends(oauth2_scheme)):
    """
    Crea o aggiorna un profilo freelancer
    """
    try:
        logger.debug(f"Tentativo di creazione/aggiornamento profilo: {profile.email}")
        payload = jwt.decode(token, os.getenv("JWT_SECRET", "your-secret-key"), algorithms=["HS256"])
        if payload["user_type"] != "Freelancer":
            raise HTTPException(status_code=403, detail="Solo i freelancer possono creare profili")
        
        # Converti il profilo in un formato adatto al database
        profile_dict = profile.to_db_dict()
        logger.debug(f"Dati profilo convertiti per DB: {profile_dict}")
        
        db = SessionLocal()
        try:
            existing_profile = db.query(FreelancerModel).filter(FreelancerModel.email == profile.email).first()
            
            if existing_profile:
                # Aggiorna profilo esistente
                logger.debug(f"Aggiornamento profilo esistente: {profile.email}")
                existing_profile.experience = profile_dict["experience"]
                existing_profile.skills = profile_dict["skills"]
                existing_profile.portfolio = profile_dict["portfolio"]  # Ora è una lista di dizionari
                existing_profile.hourly_rate = profile_dict["hourly_rate"]
                existing_profile.availability = profile_dict["availability"]
            else:
                # Crea nuovo profilo
                logger.debug(f"Creazione nuovo profilo: {profile.email}")
                new_profile = FreelancerModel(
                    email=profile_dict["email"],
                    experience=profile_dict["experience"],
                    skills=profile_dict["skills"],
                    portfolio=profile_dict["portfolio"],  # Ora è una lista di dizionari
                    user_type="Freelancer",
                    hourly_rate=profile_dict["hourly_rate"],
                    availability=profile_dict["availability"]
                )
                db.add(new_profile)
            
            db.commit()
            logger.info(f"Profilo salvato con successo: {profile.email}")
            return profile
        except Exception as e:
            db.rollback()
            logger.error(f"Errore durante il salvataggio nel DB: {str(e)}")
            raise
        finally:
            db.close()
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalido")
    except Exception as e:
        logger.error(f"Errore nella creazione del profilo: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))