import os
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not set in .env file")

genai.configure(api_key=api_key)

# Testing which models are available on this key
for m in genai.list_models():
    if "generateContent" in m.supported_generation_methods:
        print("Available model:", m.name)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserProfileData(BaseModel):
    name: str
    dream_role: str
    experience_years: int
    projects_count: int
    current_skills: list
    weeks_available: int
    hours_per_day: int
    resume_text: str = ""

@app.post("/predict-level")
async def generate_path(data: UserProfileData):
    models_to_try = ['models/gemini-2.0-flash','models/gemini-2.0-flash-lite', 'models/gemini-2.5-flash']
    last_error = ""

    for model_name in models_to_try:
        try:
            model = genai.GenerativeModel(model_name)
            prompt = f"""
You are a career coach. Return ONLY a valid JSON object, no markdown, no explanation.

Generate a career roadmap for {data.name} who wants to become a {data.dream_role}.
Current skills: {", ".join(data.current_skills)}.
Available weeks: {data.weeks_available}. Hours per day: {data.hours_per_day}.

Return this exact structure:
{{
  "summary": "2-3 sentence summary",
  "targetRole": "{data.dream_role}",
  "skillGaps": ["skill1", "skill2", "skill3"],
  "roadmap": [
    {{
      "week": 1,
      "topic": "Topic name",
      "objective": "What you will learn",
      "resources": [
        {{
          "title": "Resource name",
          "url": "https://example.com",
          "type": "video",
          "description": "Short description"
        }}
      ]
    }}
  ]
}}
"""
            print(f"Trying model: {model_name}")
            response = model.generate_content(prompt)
            res_text = response.text.strip()
            print(f"Raw response: {res_text[:200]}")

            # Cleaning markdown if present
            if res_text.startswith("```"):
                res_text = res_text.split("\n", 1)[-1]
                if "```" in res_text:
                    res_text = res_text.rsplit("```", 1)[0]
            res_text = res_text.strip()

            parsed = json.loads(res_text)
            print("Success!")
            return parsed

        except Exception as e:
            print(f"Error with {model_name}: {str(e)}")
            last_error = str(e)
            continue

    raise HTTPException(status_code=500, detail=f"All models failed. Last error: {last_error}")
            
    raise HTTPException(status_code=500, detail=f"All models failed. Last error: {last_error}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)