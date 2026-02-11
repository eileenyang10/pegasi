# Payslip Keyword Extractor


## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd <repo-folder>
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

Test in the terminal (in the /apps directory) using this curl command 

```bash
curl -X POST http://localhost:8000/extract_keywords \
  -F "file=@payslip.pdf"
```