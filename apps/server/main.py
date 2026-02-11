from fastapi import FastAPI, HTTPException, UploadFile
from pdf2image import convert_from_bytes 
import requests
import json

import base64
import io
from PIL import Image

def image_to_base64(img: Image.Image) -> str:
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")

app = FastAPI()

@app.post("/extract_keywords")
async def extract_keyword(file: UploadFile):

  prompt = "You are a keyword extractor. Extract 8–15 keywords from this document that would help a human quickly index or search it. Prefer specific nouns and noun phrases. Avoid generic words. Return ONLY valid JSON in the exact schema: { \"keywords\": [ { \"term\": string, \"score\": number } ] } where score is 0–1 confidence. No extra text."

  pdf_bytes = await file.read()

  image = convert_from_bytes (
      pdf_bytes, first_page=1, last_page=1,fmt='png'
  )

  images_b64 = [image_to_base64(img) for img in image]
  
  try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": "qwen3-vl:4b", 
                "prompt": prompt,
                "images": images_b64,
                "stream": False},
        )
        timeout=300
        print(response)
        response.raise_for_status()

        lines = response.text.strip().splitlines()
        outer = json.loads(lines[-1])
        inner = json.loads(outer["response"])

        return inner

  except requests.RequestException as e:
      raise HTTPException(status_code=500, detail=f"Error communicating with Ollama: {str(e)}")