# API Endpoints

Complete reference for all backend API endpoints.

## POST /api/prep

Creates a new interview preparation session with AI-generated questions.

**Request:**
```json
{
  "company": "Google",
  "role": "Software Engineer"
}
```

**Response:**
```json
{
  "ok": true,
  "sessionId": "abc123xyz",
  "company": "Google",
  "role": "Software Engineer",
  "questionCount": 5
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing required fields (company or role)
- `500` - Server error (AI generation failed, KV storage failed)

**Process:**
1. Fetches company data from Wikipedia, about page, careers page
2. Uses Workers AI to extract structured company profile
3. Generates 5 personalized questions (3 behavioral + 2 technical)
4. Stores session in KV with 7-day TTL
5. Returns sessionId for use in subsequent requests

---

## GET /api/session/:sessionId

Retrieves complete session data including questions and answers.

**Request:**
```
GET /api/session/abc123xyz
```

**Response:**
```json
{
  "ok": true,
  "session": {
    "sessionId": "abc123xyz",
    "company": "Google",
    "role": "Software Engineer",
    "status": "active",
    "questions": [
      {
        "question": "Describe a time when you had to scale a system under high load.",
        "type": "technical",
        "category": "system design",
        "company_alignment": "Google handles billions of queries daily and values engineers who understand scalability.",
        "evaluation_criteria": {
          "excellent": "Provides specific metrics, describes architectural decisions, explains trade-offs, mentions monitoring",
          "good": "Clear example with technical details and measurable outcome",
          "poor": "Vague description, no metrics, no technical depth"
        }
      },
      {
        "question": "Tell me about a time you demonstrated Google's value of 'Focus on the user'.",
        "type": "behavioral",
        "category": "culture-fit",
        "company_alignment": "Google's first principle is to focus on the user and all else will follow.",
        "evaluation_criteria": {
          "excellent": "Specific example showing user research, data-driven decisions, measurable user impact",
          "good": "Clear example with user benefit explained",
          "poor": "Generic answer without specific user focus"
        }
      }
    ],
    "answers": [
      {
        "questionIndex": 0,
        "answer": "At my previous company, we experienced a 10x traffic spike...",
        "evaluation": {
          "rating": "excellent",
          "feedback": "Strong answer with specific metrics and architectural decisions.",
          "strengths": [
            "Provided concrete numbers (10x traffic spike)",
            "Explained specific technical solution (caching layer, load balancing)",
            "Mentioned monitoring and alerting"
          ],
          "improvements": [
            "Could elaborate on team collaboration aspects",
            "Missing discussion of cost implications"
          ]
        },
        "timestamp": "2025-01-15T10:30:00Z"
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Session not found
- `500` - Server error

---

## POST /api/answer

Submits an answer for AI evaluation and stores it in the session.

**Request:**
```json
{
  "sessionId": "abc123xyz",
  "questionIndex": 0,
  "answer": "At my previous company, we experienced a 10x traffic spike during a product launch. I designed and implemented a caching layer using Redis that reduced database load by 80%. We also set up auto-scaling groups and added comprehensive monitoring with alerts. The system handled peak load without downtime and response times stayed under 200ms."
}
```

**Response:**
```json
{
  "ok": true,
  "evaluation": {
    "rating": "excellent",
    "feedback": "Strong technical answer with specific metrics and architectural decisions. You demonstrated clear problem-solving and provided measurable outcomes.",
    "strengths": [
      "Provided concrete numbers (10x spike, 80% reduction, 200ms response time)",
      "Described specific technical solutions (Redis caching, auto-scaling)",
      "Mentioned monitoring and operational excellence"
    ],
    "improvements": [
      "Could mention how you worked with the team on this solution",
      "Missing discussion of trade-offs between different caching strategies"
    ]
  },
  "answeredCount": 1,
  "totalQuestions": 5,
  "isComplete": false
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing required fields or invalid questionIndex
- `404` - Session not found
- `500` - Server error (AI evaluation failed)

**Evaluation Ratings:**
- `excellent` - Demonstrates deep understanding, specific examples, measurable impact
- `good` - Clear answer with relevant examples and decent structure
- `poor` - Generic, lacks examples, misses key points

**Process:**
1. Validates session exists and questionIndex is valid
2. Sends answer to Workers AI with question context and evaluation criteria
3. AI returns structured evaluation with rating, feedback, strengths, improvements
4. Updates session in KV with new answer
5. Marks session as complete if all questions answered

---

## POST /api/summarise

Generates overall session feedback after all questions are answered.

**Request:**
```json
{
  "sessionId": "abc123xyz"
}
```

**Response:**
```json
{
  "ok": true,
  "summary": {
    "overallRating": "strong",
    "summary": "You demonstrated strong technical skills and good understanding of Google's values. Your answers were specific and data-driven. Focus on elaborating more on team collaboration and communication aspects.",
    "keyStrengths": [
      "Consistently provided specific metrics and data points",
      "Strong technical depth in system design answers",
      "Good alignment with company values"
    ],
    "areasForImprovement": [
      "More emphasis on team collaboration and leadership",
      "Deeper discussion of trade-offs in technical decisions"
    ],
    "nextSteps": [
      "Practice STAR method for behavioral questions",
      "Review Google's leadership principles",
      "Prepare questions to ask the interviewer"
    ]
  },
  "session": {
    "company": "Google",
    "role": "Software Engineer",
    "questionsAnswered": 5,
    "totalQuestions": 5
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing sessionId or no answers to summarize
- `404` - Session not found
- `500` - Server error (AI summarization failed)

**Overall Ratings:**
- `strong` - Excellent performance across most questions
- `good` - Solid performance with some room for improvement
- `needs improvement` - Significant gaps in answers or alignment

---

## POST /api/research

Standalone endpoint to research a company without creating a session.

**Request:**
```json
{
  "company": "Stripe"
}
```

**Response:**
```json
{
  "ok": true,
  "profile": {
    "name": "Stripe",
    "summary": "Stripe is a financial infrastructure platform for businesses. It provides payment processing software and APIs for e-commerce websites and mobile applications.",
    "values": [
      "Users first",
      "Move with urgency",
      "Think rigorously",
      "Trust and amplify"
    ],
    "culture": "Stripe values high-performing teams, clear communication, and building lasting products. Remote-first with emphasis on written communication.",
    "mission": "Increase the GDP of the internet",
    "headquarters": "San Francisco, USA",
    "founded": "2010",
    "notable_projects": [
      "Stripe Connect",
      "Stripe Atlas",
      "Stripe Terminal",
      "Payment Links"
    ],
    "key_technologies": [
      "Ruby",
      "Scala",
      "Go",
      "React",
      "Kubernetes"
    ],
    "recent_achievements": [
      "Reached $1 trillion in payment volume (2023)",
      "Launched Stripe Tax globally",
      "Expanded to 47 countries"
    ]
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing company name
- `500` - Server error (research failed)

**Data Sources:**
- Wikipedia: `https://r.jina.ai/http://en.wikipedia.org/wiki/{company}`
- About page: `https://r.jina.ai/https://{company}.com/about`
- Careers: `https://r.jina.ai/https://{company}.com/careers`

---

## POST /api/questions

Standalone endpoint to generate questions without creating a session.

**Request:**
```json
{
  "company": "Stripe",
  "role": "Backend Engineer"
}
```

**Response:**
```json
{
  "ok": true,
  "profile": {
    "name": "Stripe",
    "values": ["Users first", "Move with urgency"],
    "mission": "Increase the GDP of the internet"
  },
  "questions": [
    {
      "question": "Describe a time when you had to move with urgency to ship a critical feature.",
      "type": "behavioral",
      "category": "velocity",
      "company_alignment": "Stripe values moving with urgency while maintaining quality.",
      "evaluation_criteria": {
        "excellent": "Specific timeframe, explains decision-making process, discusses quality vs speed trade-offs",
        "good": "Clear example with timeline and outcome",
        "poor": "Vague or lacks urgency element"
      }
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing company or role
- `500` - Server error

---

## Error Responses

All endpoints return consistent error format:

```json
{
  "error": "Human-readable error message",
  "details": "Technical error details (in development)"
}
```

Common errors:
- `company and role required` - Missing required fields in /api/prep
- `Session not found` - Invalid sessionId
- `Invalid question index` - questionIndex out of range
- `Failed to create session` - AI generation or KV storage failed

---

## Rate Limits

No explicit rate limits currently enforced. Cloudflare Workers default limits apply:
- 100,000 requests per day (free tier)
- 10ms CPU time per request (free tier)

---

## Data Storage

All sessions stored in Cloudflare KV with:
- TTL: 7 days (604800 seconds)
- Key format: `session:{sessionId}`
- Automatic expiration after 7 days

---

## Authentication

No authentication required for current version. All endpoints are publicly accessible.

Future considerations:
- JWT tokens for session ownership
- Rate limiting per user
- API keys for production use
