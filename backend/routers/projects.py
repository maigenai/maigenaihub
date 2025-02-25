from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import os
import jwt
from fastapi.security import OAuth2PasswordBearer
from database import SessionLocal, ProjectModel, CompanyModel
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/projects", tags=["projects"])

class Project(BaseModel):
    title: str
    description: str
    budget: float
    timeline: str
    required_skills: List[str] = []
    company_email: Optional[str] = None
    freelancer_email: Optional[str] = None

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.get("/", response_model=List[Project])
async def get_projects(token: str = Depends(oauth2_scheme)):
    db = SessionLocal()
    try:
        projects = db.query(ProjectModel).all()
        result = []
        
        for project in projects:
            # Verifica se gli attributi esistono nel modello prima di tentare di accedervi
            project_dict = {
                "title": project.title,
                "description": project.description,
                "budget": project.budget,
                "timeline": project.timeline,
                "required_skills": project.required_skills
            }
            
            # Aggiungi company_email e freelancer_email solo se esistono nel modello
            if hasattr(project, 'company_email'):
                project_dict["company_email"] = project.company_email
            else:
                project_dict["company_email"] = None
                
            if hasattr(project, 'freelancer_email'):
                project_dict["freelancer_email"] = project.freelancer_email
            else:
                project_dict["freelancer_email"] = None
                
            result.append(Project(**project_dict))
            
        logger.debug(f"Retrieved projects: {len(result)}")
        return result
    except Exception as e:
        logger.error(f"Error fetching projects: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        db.close()

@router.post("/", response_model=Project)
async def create_project(project: Project, token: str = Depends(oauth2_scheme)):
    db = SessionLocal()
    try:
        logger.debug(f"Creating project with data: {project.dict()}")
        payload = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        if payload["user_type"] != "Company":
            raise HTTPException(status_code=403, detail="Only companies can create projects")

        # Verifica se company_email esiste (opzionale se None)
        if project.company_email:
            company = db.query(CompanyModel).filter(CompanyModel.email == project.company_email).first()
            if not company:
                raise HTTPException(status_code=404, detail="Company not found")

        # Crea un dizionario con solo i campi che sono sicuramente nel modello
        project_data = {
            "title": project.title,
            "description": project.description,
            "budget": project.budget,
            "timeline": project.timeline,
            "required_skills": project.required_skills
        }
        
        # Verifica i campi aggiuntivi con getattr su un'istanza vuota per vedere se esistono nel modello
        temp_project = ProjectModel()
        
        if hasattr(temp_project, 'company_email') and project.company_email is not None:
            project_data["company_email"] = project.company_email
            
        if hasattr(temp_project, 'freelancer_email') and project.freelancer_email is not None:
            project_data["freelancer_email"] = project.freelancer_email
        
        db_project = ProjectModel(**project_data)
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        logger.info(f"Project created successfully: {db_project.title}")
        return project
    except jwt.InvalidTokenError:
        logger.error("Invalid JWT token")
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        logger.error(f"Error creating project: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()