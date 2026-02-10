from fastapi import FastAPI,  UploadFile, File


app = FastAPI()



@app.get("/data")
def read_data():
    return {"message": "Hello from FastAPI"}

'''

curl http://localhost:11434/api/generate -d '{
  "model": "qwen3-vl:4b",
  "prompt": "You are a keyword extractor. Extract 8–15 keywords from this document that would help a human quickly index or search it. Prefer specific nouns and noun phrases. Avoid generic words. Return ONLY valid JSON in the exact schema: { "keywords": [ { "term": string, "score": number } ] } where score is 0–1 confidence. No extra text."
}'

'''