export type Question = {
  question: string
  type: string
  category: string
  company_alignment: string
  evaluation_criteria: {
    excellent: string
    good: string
    poor: string
  }
}

export type Answer = {
  questionIndex: number
  answer: string
  evaluation: Evaluation
  timestamp: string
}

export type Evaluation = {
  rating: "excellent" | "good" | "poor"
  feedback: string
  strengths: string[]
  improvements: string[]
}

export type Session = {
  sessionId: string
  company: string
  role: string
  status: "active" | "completed"
  questions: Question[]
  answers: Answer[]
}


