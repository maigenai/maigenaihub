from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from maigenai_matching import MaigenAIMatchingSystem
from ai_advisor import AIAdvisor
import os
from dotenv import load_dotenv
from routers import profiles, companies, projects, matching, suggestions, auth

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://maigenai.com"],  # Assicurati che includa il frontend locale
    allow_credentials=True,
    allow_methods=["*"],  # Permetti tutti i metodi
    allow_headers=["*"],  # Permetti tutti gli header
)

matching_system = MaigenAIMatchingSystem(openai_api_key=os.getenv("OPENAI_API_KEY"))
advisor = AIAdvisor(openai_api_key=os.getenv("OPENAI_API_KEY"))

# Includi tutti i router
app.include_router(auth.router)
app.include_router(profiles.router)
app.include_router(companies.router)
app.include_router(projects.router)
app.include_router(matching.router)
app.include_router(suggestions.router)

@app.get("/")
async def root():
    return {"message": "MaigenAI Hub API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)