from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import os
import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from database import SessionLocal, FreelancerModel, CompanyModel
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["authentication"])

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")  # Usa una variabile d'ambiente in produzione
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_MINUTES = 60 * 24  # 24 ore

class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    user_type: str

class Token(BaseModel):
    token: str
    user_type: str

def create_jwt_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRATION_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

@router.post("/register", response_model=Token)
async def register_user(user: UserRegister):
    db = SessionLocal()
    try:
        logger.debug(f"Registrazione utente: {user.email}, tipo: {user.user_type}")
        
        # Controlla se l'utente esiste già
        if user.user_type == "Freelancer":
            existing_user = db.query(FreelancerModel).filter(FreelancerModel.email == user.email).first()
        else:
            existing_user = db.query(CompanyModel).filter(CompanyModel.email == user.email).first()
            
        if existing_user:
            raise HTTPException(status_code=400, detail="Email già registrata")
        
        # Hash della password
        hashed_password = pwd_context.hash(user.password)
        
        # Crea il nuovo utente
        if user.user_type == "Freelancer":
            new_user = FreelancerModel(
                email=user.email,
                password=hashed_password,
                user_type="Freelancer"
            )
        else:
            new_user = CompanyModel(
                email=user.email,
                password=hashed_password,
                user_type="Company",
                name="",
                description="",
                industry="",
                size="",
                location=""
            )
            
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Crea il token JWT
        token = create_jwt_token({"sub": user.email, "user_type": user.user_type})
        logger.info(f"Utente registrato con successo: {user.email}")
        
        return {"token": token, "user_type": user.user_type}
    except Exception as e:
        logger.error(f"Errore durante la registrazione: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Errore durante la registrazione: {str(e)}")
    finally:
        db.close()

@router.post("/login", response_model=Token)
async def login_user(user: UserLogin):
    db = SessionLocal()
    try:
        logger.debug(f"Login tentato per: {user.email}")
        
        # Cerca l'utente come freelancer
        freelancer = db.query(FreelancerModel).filter(FreelancerModel.email == user.email).first()
        if freelancer and pwd_context.verify(user.password, freelancer.password):
            token = create_jwt_token({"sub": user.email, "user_type": "Freelancer"})
            logger.info(f"Login freelancer: {user.email}")
            return {"token": token, "user_type": "Freelancer"}
            
        # Cerca l'utente come azienda
        company = db.query(CompanyModel).filter(CompanyModel.email == user.email).first()
        if company and pwd_context.verify(user.password, company.password):
            token = create_jwt_token({"sub": user.email, "user_type": "Company"})
            logger.info(f"Login company: {user.email}")
            return {"token": token, "user_type": "Company"}
            
        # Se l'autenticazione fallisce
        raise HTTPException(status_code=401, detail="Credenziali non valide")
    except Exception as e:
        logger.error(f"Errore durante il login: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Errore durante il login: {str(e)}")
    finally:
        db.close()