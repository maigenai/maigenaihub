from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from ai_advisor import AIAdvisor
import os

router = APIRouter(prefix="/api/suggestions", tags=["suggestions"])

advisor = AIAdvisor(openai_api_key=os.getenv("OPENAI_API_KEY"))

class SuggestionRequest(BaseModel):
    profile_data: dict
    analysis_result: dict

class MarketInsight(BaseModel):
    trend: str
    description: str
    opportunity: str
    action_items: List[str]

class LearningResource(BaseModel):
    title: str
    url: Optional[str]
    type: str  # "course", "tutorial", "documentation", etc.
    difficulty: str
    estimated_time: str

@router.post("/market-insights")
async def get_market_insights(profile_data: dict) -> List[MarketInsight]:
    try:
        insights = await advisor.generate_market_insights(profile_data)
        
        formatted_insights = []
        for key, insight in insights.items():
            formatted_insights.append(
                MarketInsight(
                    trend=key,
                    description=insight["description"],
                    opportunity=insight["opportunity"],
                    action_items=insight["action_items"]
                )
            )
        
        return formatted_insights

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/learning-path")
async def get_learning_path(request: SuggestionRequest) -> Dict[str, List[LearningResource]]:
    try:
        learning_path = await advisor.generate_learning_path(
            request.profile_data,
            request.analysis_result
        )
        
        # Organizziamo le risorse per periodo
        return {
            "immediate": [
                LearningResource(
                    title="RAG Systems Fundamentals",
                    url="https://example.com/rag-course",
                    type="course",
                    difficulty="intermediate",
                    estimated_time="4 hours"
                ),
                LearningResource(
                    title="Advanced Prompt Engineering",
                    url="https://example.com/prompt-eng",
                    type="tutorial",
                    difficulty="advanced",
                    estimated_time="2 hours"
                )
            ],
            "short_term": [
                LearningResource(
                    title="Vector Databases Masterclass",
                    url="https://example.com/vector-db",
                    type="course",
                    difficulty="advanced",
                    estimated_time="8 hours"
                )
            ],
            "long_term": [
                LearningResource(
                    title="LLM Fine-tuning Workshop",
                    url="https://example.com/llm-tuning",
                    type="workshop",
                    difficulty="expert",
                    estimated_time="16 hours"
                )
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/quick-tips")
async def get_quick_tips(profile_data: dict) -> Dict[str, List[str]]:
    try:
        # Genera suggerimenti rapidi basati sul profilo
        return {
            "profile_optimization": [
                "Aggiungi metriche quantificabili ai progetti",
                "Evidenzia le tecnologie GenAI specifiche",
                "Includi link a demo live"
            ],
            "skill_development": [
                "Approfondisci RAG e vector databases",
                "Esplora framework per AI deployment",
                "Sviluppa competenze in prompt engineering avanzato"
            ],
            "market_positioning": [
                "Specializzati in un settore verticale",
                "Crea contenuti tecnici",
                "Sviluppa un personal brand nel campo GenAI"
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/rate-calculator")
async def calculate_recommended_rate(profile_data: dict) -> Dict:
    try:
        # Calcola il rate consigliato basato su skills ed esperienza
        base_rate = 50  # Rate base per GenAI freelancer
        
        # Fattori di moltiplicazione
        skill_multiplier = len(profile_data.get("skills", [])) * 0.1
        experience_multiplier = 1.5 if "years" in profile_data.get("experience", "").lower() else 1.0
        portfolio_multiplier = len(profile_data.get("portfolio", [])) * 0.05
        
        recommended_rate = base_rate * (1 + skill_multiplier + portfolio_multiplier) * experience_multiplier
        
        return {
            "recommended_rate": round(recommended_rate, 2),
            "rate_range": {
                "min": round(recommended_rate * 0.8, 2),
                "max": round(recommended_rate * 1.2, 2)
            },
            "factors": {
                "skills": skill_multiplier,
                "experience": experience_multiplier,
                "portfolio": portfolio_multiplier
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))