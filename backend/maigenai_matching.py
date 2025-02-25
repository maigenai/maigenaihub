from crewai import Agent, Task, Crew, Process
from textwrap import dedent
from typing import Dict, List
import json
import openai
from datetime import datetime

class MaigenAIMatchingSystem:
    def __init__(self, openai_api_key: str):
        self.openai_api_key = openai_api_key
        openai.api_key = openai_api_key
        
    def create_screening_agent(self) -> Agent:
        return Agent(
            role='Profile Analyzer',
            goal='Analyze freelancer profiles and project requirements thoroughly',
            backstory=dedent("""You are an expert at analyzing AI/ML freelancer profiles 
                            and understanding project requirements in detail."""),
            verbose=True,
            allow_delegation=False
        )

    def create_matching_agent(self) -> Agent:
        return Agent(
            role='Matching Specialist',
            goal='Create optimal matches between freelancers and projects',
            backstory=dedent("""You are an expert at matching AI/ML talents with 
                            projects based on multiple criteria and constraints."""),
            verbose=True,
            allow_delegation=True
        )

    async def analyze_profile(self, profile_data: Dict) -> Dict:
        """
        Analyze a freelancer profile using GPT-4
        """
        try:
            analysis_prompt = f"""
            Analyze this AI/ML freelancer profile in detail:
            
            Skills: {profile_data.get('skills', [])}
            Experience: {profile_data.get('experience', '')}
            Portfolio: {profile_data.get('portfolio', [])}
            
            Provide a structured analysis of:
            1. Technical expertise level (1-10) in each skill
            2. Project relevance score (1-10)
            3. Communication skills assessment
            4. Red flags or concerns
            5. Unique strengths
            """
            
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert AI freelancer profile analyzer."},
                    {"role": "user", "content": analysis_prompt}
                ]
            )
            
            # Parse the response into structured data
            analysis = self._parse_gpt4_response(response.choices[0].message.content)
            return analysis

        except Exception as e:
            print(f"Error in profile analysis: {str(e)}")
            return self._get_fallback_analysis()

    async def analyze_project_requirements(self, project_data: Dict) -> Dict:
        """
        Analyze project requirements using GPT-4
        """
        try:
            requirements_prompt = f"""
            Analyze these project requirements in detail:
            
            Description: {project_data.get('description', '')}
            Required Skills: {project_data.get('required_skills', [])}
            Timeline: {project_data.get('timeline', '')}
            Budget: {project_data.get('budget', '')}
            
            Provide a structured analysis of:
            1. Core skills needed
            2. Project complexity (1-10)
            3. Time estimation accuracy
            4. Budget adequacy
            5. Potential challenges
            """
            
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert project requirements analyzer."},
                    {"role": "user", "content": requirements_prompt}
                ]
            )
            
            analysis = self._parse_gpt4_response(response.choices[0].message.content)
            return analysis

        except Exception as e:
            print(f"Error in project analysis: {str(e)}")
            return self._get_fallback_project_analysis()

    async def execute_matching(self, freelancer_profile: Dict, project: Dict) -> Dict:
        """
        Execute the matching process using GPT-4
        """
        try:
            # Analyze both profile and project
            profile_analysis = await self.analyze_profile(freelancer_profile)
            project_analysis = await self.analyze_project_requirements(project)
            
            # Create matching prompt
            matching_prompt = f"""
            Analyze the compatibility between this freelancer and project:

            Freelancer Analysis:
            {json.dumps(profile_analysis, indent=2)}

            Project Analysis:
            {json.dumps(project_analysis, indent=2)}

            Provide:
            1. Overall match score (0-10)
            2. Compatibility breakdown
            3. Specific recommendations
            4. Risk factors
            5. Success probability
            """

            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert AI freelancer-project matcher."},
                    {"role": "user", "content": matching_prompt}
                ]
            )

            match_result = self._parse_gpt4_response(response.choices[0].message.content)
            
            return {
                "match_score": match_result.get("overall_score", 7.5),
                "analysis": match_result,
                "recommendations": match_result.get("recommendations", [
                    "Schedule technical interview",
                    "Review portfolio details",
                    "Discuss project timeline"
                ])
            }

        except Exception as e:
            print(f"Error in matching execution: {str(e)}")
            return self._get_fallback_match_result()

    def _parse_gpt4_response(self, response: str) -> Dict:
        """
        Parse GPT-4 response into structured data
        """
        try:
            # Basic parsing - in production you'd want more robust parsing
            sections = response.split('\n\n')
            parsed_response = {}
            
            current_section = None
            for section in sections:
                if ':' in section:
                    title, content = section.split(':', 1)
                    current_section = title.strip()
                    parsed_response[current_section] = []
                    items = content.strip().split('\n- ')
                    parsed_response[current_section].extend([item.strip() for item in items if item])

            return parsed_response

        except Exception as e:
            print(f"Error parsing GPT-4 response: {str(e)}")
            return {}

    def _get_fallback_analysis(self) -> Dict:
        """
        Provide fallback profile analysis in case of errors
        """
        return {
            "technical_scores": {
                "prompt_engineering": 8,
                "llm_development": 7,
                "ai_integration": 9
            },
            "project_relevance": 8.5,
            "communication_score": 9,
            "red_flags": [],
            "strengths": ["Strong GenAI background", "Proven track record"]
        }

    def _get_fallback_project_analysis(self) -> Dict:
        """
        Provide fallback project analysis in case of errors
        """
        return {
            "core_skills": ["prompt_engineering", "llm_development"],
            "complexity_score": 7,
            "time_estimation": "Accurate",
            "budget_adequacy": "Sufficient",
            "challenges": ["Complex integration requirements"]
        }

    def _get_fallback_match_result(self) -> Dict:
        """
        Provide fallback matching result in case of errors
        """
        return {
            "match_score": 7.5,
            "analysis": {
                "skill_match": "Good",
                "experience_match": "Adequate",
                "budget_match": "Within range"
            },
            "recommendations": [
                "Schedule technical interview",
                "Review portfolio details",
                "Discuss project timeline"
            ]
        }