# AI-Assisted Text Classification API

A REST API service that classifies input text into predefined categories using AI.

## Features

- Single POST endpoint for text classification
- Categories: Complaint, Query, Feedback, Other
- Returns category with confidence score
- Error handling and validation
- Modular architecture

## Tech Stack

- Node.js with Express.js
- Groq AI API for classification
- dotenv for environment variables


## Installation

1. Clone the repository
```bash
git clone
cd (to the directory)
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` and add your Groq API key:
```
PORT=3000
GROQ_API_KEY=your_groq_api_key_here
```

4. Start the server
```bash
npm start
```

## API Documentation

### Classify Text

**Endpoint:** `POST /api/classify`

**Request Body:**
```json
{
  "text": "I am not satisfied with the product quality"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "text": "I am not satisfied with the product quality",
    "category": "Complaint",
    "confidence": 0.92,
    "timestamp": "2026-01-05T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Text is required and must be a non-empty string"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Classification service temporarily unavailable"
}


## How AI is Used

The service uses Groq's AI API for intelligent text classification:

1. **Prompt Engineering**: The AI receives a carefully crafted prompt that instructs it to analyze the input text and classify it into one of four categories
2. **Context Understanding**: The model analyzes the semantic meaning, sentiment, and intent of the text
3. **Confidence Scoring**: The system maps the AI's response confidence to a numerical score (0-1)
4. **Response Parsing**: The structured response is parsed and validated before returning to the client

The AI model identifies:
- **Complaints**: Negative feedback, dissatisfaction, issues
- **Queries**: Questions, requests for information, clarifications
- **Feedback**: Suggestions, opinions, general comments
- **Other**: Unclassifiable or ambiguous text

## Example Usage

### Using cURL
```bash
curl -X POST http://localhost:3000/api/classify \
  -H "Content-Type: application/json" \
  -d '{"text": "How do I reset my password?"}'
```
```
or use postman to test the api
```



