from typing import List, Dict
from openai import AsyncOpenAI
from datetime import datetime
import json

class AIAdvisor:
    def __init__(self, openai_api_key: str):
        self.client = AsyncOpenAI(api_key=openai_api_key)

    async def generate_profile_suggestions(self, profile_data: Dict, analysis_result: Dict) -> Dict:
        """
        Genera suggerimenti personalizzati per il profilo freelancer
        """
        try:
            prompt = f"""
            Analizza questo profilo freelancer e i risultati dell'analisi per generare suggerimenti
            altamente personalizzati e actionable per il mercato GenAI europeo:

            PROFILO FREELANCER:
            {json.dumps(profile_data, indent=2)}

            ANALISI PRECEDENTE:
            {json.dumps(analysis_result, indent=2)}

            Genera suggerimenti specifici e dettagliati per le seguenti aree:
            1. Miglioramenti immediati al profilo (3 suggerimenti)
            2. Sviluppo skills tecniche (3 suggerimenti)
            3. Posizionamento nel mercato europeo (3 suggerimenti)
            4. Pricing strategy per il mercato EU (2 suggerimenti)
            5. Portfolio enhancement (3 suggerimenti)
            
            Per ogni suggerimento, fornisci:
            - Azione specifica da intraprendere
            - Motivazione dettagliata
            - Esempio concreto o caso studio
            - Timeline suggerita per l'implementazione
            """

            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "Sei un esperto advisor per freelancer GenAI nel mercato europeo."},
                    {"role": "user", "content": prompt}
                ]
            )

            suggestions = self._parse_structured_response(response.choices[0].message.content)
            return suggestions

        except Exception as e:
            print(f"Error generating suggestions: {str(e)}")
            return self._get_fallback_suggestions()

    async def generate_market_insights(self, profile_data: Dict) -> Dict:
        """
        Genera insights sul mercato specifici per il profilo
        """
        try:
            prompt = f"""
            Analizza questo profilo freelancer e genera insights approfonditi sul mercato GenAI
            europeo specifici per le sue competenze:

            PROFILO:
            {json.dumps(profile_data, indent=2)}

            Fornisci insights dettagliati su:
            1. Trend di mercato rilevanti nel 2024
            2. Opportunità emergenti in Europa
            3. Nicchie di mercato potenziali
            4. Analisi della competizione
            5. Rate card ottimale per mercato EU
            
            Per ogni insight, includi:
            - Descrizione dettagliata del trend/opportunità
            - Dati specifici e statistiche (se disponibili)
            - Esempi concreti di aziende o progetti
            - Suggerimenti pratici per sfruttare l'opportunità
            """

            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "Sei un esperto analista del mercato GenAI europeo."},
                    {"role": "user", "content": prompt}
                ]
            )

            insights = self._parse_structured_response(response.choices[0].message.content)
            return insights

        except Exception as e:
            print(f"Error generating market insights: {str(e)}")
            return self._get_fallback_market_insights()

    async def generate_learning_path(self, profile_data: Dict, analysis_result: Dict) -> Dict:
        """
        Genera un percorso di apprendimento personalizzato
        """
        try:
            prompt = f"""
            Crea un percorso di apprendimento dettagliato e personalizzato per questo freelancer
            basato sul suo profilo e l'analisi delle competenze:

            PROFILO:
            {json.dumps(profile_data, indent=2)}

            ANALISI:
            {json.dumps(analysis_result, indent=2)}

            Genera un piano di apprendimento completo che includa:
            1. Obiettivi a breve termine (1-3 mesi)
            2. Obiettivi a medio termine (3-6 mesi)
            3. Obiettivi a lungo termine (6-12 mesi)
            4. Risorse specifiche per ogni obiettivo
            5. Progetti pratici consigliati
            6. Certificazioni rilevanti
            7. KPI per misurare i progressi

            Per ogni elemento del piano, specificare:
            - Descrizione dettagliata
            - Timeline specifica
            - Risorse necessarie
            - Risultati attesi
            - Modo di misurare il successo
            """

            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "Sei un esperto coach per sviluppatori GenAI."},
                    {"role": "user", "content": prompt}
                ]
            )

            learning_path = self._parse_structured_response(response.choices[0].message.content)
            return learning_path

        except Exception as e:
            print(f"Error generating learning path: {str(e)}")
            return self._get_fallback_learning_path()

    def _parse_structured_response(self, response: str) -> Dict:
        """
        Parse strutturato della risposta di GPT-4
        """
        try:
            sections = response.split('\n\n')
            parsed_response = {}
            
            current_section = None
            current_items = []
            
            for section in sections:
                if ':' in section and not section.startswith('-'):
                    if current_section and current_items:
                        parsed_response[current_section] = current_items
                        current_items = []
                    
                    title, content = section.split(':', 1)
                    current_section = title.strip()
                    
                    # Controlla se c'è contenuto dopo i due punti
                    if content.strip():
                        current_items.append(content.strip())
                        
                elif section.strip().startswith('-'):
                    current_items.append(section.strip()[2:])  # Rimuovi il trattino
                elif current_section:
                    current_items.append(section.strip())
            
            # Aggiungi l'ultima sezione
            if current_section and current_items:
                parsed_response[current_section] = current_items

            return parsed_response

        except Exception as e:
            print(f"Error parsing GPT-4 response: {str(e)}")
            return {}

    def _get_fallback_suggestions(self) -> Dict:
        """
        Suggerimenti di fallback in caso di errore
        """
        return {
            "profile_improvements": [
                {
                    "action": "Aggiungi metriche quantificabili ai progetti",
                    "reason": "Dimostra impatto concreto",
                    "example": "Aumentato efficienza del 40% usando RAG",
                    "timeline": "1 settimana"
                },
                {
                    "action": "Crea case studies dettagliati",
                    "reason": "Mostra processo e risultati",
                    "example": "Implementazione chatbot per e-commerce",
                    "timeline": "2 settimane"
                }
            ],
            "skill_development": [
                {
                    "action": "Approfondisci RAG systems",
                    "reason": "Alta domanda nel mercato EU",
                    "example": "Corso Langchain + progetto pratico",
                    "timeline": "1 mese"
                }
            ],
            "market_positioning": [
                {
                    "action": "Specializzati in un settore verticale",
                    "reason": "Differenziazione nel mercato",
                    "example": "Focus su FinTech o Healthcare",
                    "timeline": "3 mesi"
                }
            ]
        }

    def _get_fallback_market_insights(self) -> Dict:
        """
        Market insights di fallback in caso di errore
        """
        return {
            "market_trends": [
                {
                    "trend": "Crescente domanda RAG",
                    "description": "Aumento progetti enterprise",
                    "examples": ["Banking", "Insurance"],
                    "action_items": ["Sviluppa expertise RAG"]
                }
            ],
            "opportunities": [
                {
                    "area": "PMI europee",
                    "description": "Adozione GenAI in crescita",
                    "potential": "Alto",
                    "entry_strategy": "Offri consulenza iniziale"
                }
            ]
        }

    def _get_fallback_learning_path(self) -> Dict:
        """
        Learning path di fallback in caso di errore
        """
        current_date = datetime.now()
        return {
            "short_term": {
                "timeline": "1-3 mesi",
                "objectives": [
                    {
                        "title": "RAG Mastery",
                        "resources": ["Corso Langchain", "Tutorial Pinecone"],
                        "project": "Build RAG system",
                        "kpi": ["Completamento corso", "Sistema funzionante"]
                    }
                ]
            },
            "medium_term": {
                "timeline": "3-6 mesi",
                "objectives": [
                    {
                        "title": "LLM Fine-tuning",
                        "resources": ["OpenAI docs", "HuggingFace course"],
                        "project": "Custom model",
                        "kpi": ["Model performance metrics"]
                    }
                ]
            }
        }