# Payslip Keyword Extractor

The goal is for the Electron desktop app to be able to extract keywords from a PDF that you upload.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/eileenyang10/pegasi.git
cd pegasi
```

### 2. Set Up Backend

1. Install Dependencies
```bash
pip install -r requirements.txt
```

2. Run backend server
```bash
uvicorn main:app --reload
```
3. Run Ollama and download correct model
```bash
ollama serve
ollama pull qwen3-vl:4b
```

Test in the terminal (in the /apps directory) using this curl command 

```bash
curl -X POST http://localhost:8000/extract_keywords \
  -F "file=@payslip.pdf"
```

### 3. Set Up Frontend

1. Install Dependencies
Ensure you are in the /desktop directory
```bash
npm install 
```

2. Run the vite server
In the /frontend directory
```bash
npm run dev
```

3. Launch electron
In the /desktop directory and in another terminal
```bash
npm run start
```

### 4. Use the Electron App

1. Upload a pdf of a payslip using the choose a file button
2. Then click the upload the file button and wait for it to extract the keywords! 