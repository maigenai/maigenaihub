from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from maigenai_matching import MaigenAIMatchingSystem
import os

router = APIRouter(prefix="/api/matching", tags=["matching"])

class ProjectRequirement(BaseModel):
    title: str
    description: str
    required_skills: List[str]
    budget_range: Optional[str]
    timeline: Optional[str]
    company_name: Optional[str]

class MatchingResult(BaseModel):
    match_score: float
    compatibility_details: dict
    recommendations: List[str]
    next_steps: List[str]

matching_system = MaigenAIMatchingSystem(openai_api_key=os.getenv("OPENAI_API_KEY"))

@router.post("/find-matches", response_model=MatchingResult)
async def find_matches(freelancer_id: str, project: ProjectRequirement):
    try:
        # Qui dovresti recuperare il profilo del freelancer dal database
        # Per ora usiamo un profilo di esempio
        freelancer_profile = {
            "id": freelancer_id,
            "skills": ["prompt engineering", "llm development", "python"],
            "experience": "3 years in GenAI development",
            "portfolio": [
                {
                    "title": "Custom ChatGPT Integration",
                    "description": "Developed enterprise chatbot",
                    "technologies": ["OpenAI API", "Python", "FastAPI"]
                }
            ]
        }

        # Esegui il matching usando CrewAI
        match_result = await matching_system.execute_matching(
            freelancer_profile=freelancer_profile,
            project=project.dict()
        )

        return MatchingResult(
            match_score=match_result["match_score"],
            compatibility_details=match_result["analysis"],
            recommendations=match_result["recommendations"],
            next_steps=[
                "Schedule technical interview",
                "Review portfolio details",
                "Discuss project timeline"
            ]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/batch-match")
async def batch_match(project: ProjectRequirement, min_score: float = 0.7):
    try:
        # Qui dovresti recuperare tutti i freelancer dal database
        # Per ora usiamo una lista di esempio
        freelancers = [
            {
                "id": "1",
                "skills": ["prompt engineering", "llm development"],
                "experience": "2 years in GenAI"
            },
            {
                "id": "2",
                "skills": ["python", "machine learning", "llm development"],
                "experience": "4 years in AI/ML"
            }
        ]

        matches = []
        for freelancer in freelancers:
            match_result = await matching_system.execute_matching(
                freelancer_profile=freelancer,
                project=project.dict()
            )
            
            if match_result["match_score"] >= min_score:
                matches.append({
                    "freelancer_id": freelancer["id"],
                    "match_score": match_result["match_score"],
                    "analysis": match_result["analysis"]
                })

        return {
            "total_matches": len(matches),
            "matches": sorted(matches, key=lambda x: x["match_score"], reverse=True)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/match-stats/{freelancer_id}")
async def get_match_stats(freelancer_id: str):
    try:
        # Qui dovresti recuperare le statistiche dal database
        # Per ora restituiamo dati di esempio
        return {
            "total_matches": 15,
            "successful_matches": 12,
            "average_score": 8.5,
            "top_matching_skills": [
                "prompt engineering",
                "llm development",
                "python"
            ],
            "recent_matches": [
                {
                    "project_id": "1",
                    "match_score": 9.2,
                    "date": datetime.now().isoformat()
                }
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))