from sqlalchemy import create_engine, Column, Integer, String, Float, JSON, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

SQLALCHEMY_DATABASE_URL = "sqlite:///./maigenai.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class FreelancerModel(Base):
    __tablename__ = "freelancers"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    user_type = Column(String, default="Freelancer")
    experience = Column(String, default="")
    skills = Column(JSON, default=[])
    portfolio = Column(JSON, default=[])  # Assicurati che sia JSON
    hourly_rate = Column(Float, nullable=True)
    availability = Column(String, nullable=True)
    
    # Relazione con i progetti
    projects = relationship("ProjectModel", back_populates="freelancer", foreign_keys="ProjectModel.freelancer_email")

class CompanyModel(Base):
    __tablename__ = "companies"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    user_type = Column(String, default="Company")
    name = Column(String)
    description = Column(String)
    industry = Column(String)
    size = Column(String)
    location = Column(String)
    
    # Relazione con i progetti
    projects = relationship("ProjectModel", back_populates="company", foreign_keys="ProjectModel.company_email")

class ProjectModel(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    budget = Column(Float)
    timeline = Column(String)
    required_skills = Column(JSON, default=[])
    
    # Aggiunta dei campi mancanti
    company_email = Column(String, ForeignKey("companies.email"), nullable=True)
    freelancer_email = Column(String, ForeignKey("freelancers.email"), nullable=True)
    
    # Relazioni
    company = relationship("CompanyModel", back_populates="projects", foreign_keys=[company_email])
    freelancer = relationship("FreelancerModel", back_populates="projects", foreign_keys=[freelancer_email])

Base.metadata.create_all(bind=engine)