import { NextRequest, NextResponse } from "next/server"

type AnswerRequest = {
  sessionId: string
  questionIndex: number
  answer: string
}

type EvaluationResponse = {
  ok: boolean
  evaluation: {
    rating: string
    feedback: string
    strengths: string[]
    improvements: string[]
  }
  answeredCount: number
  totalQuestions: number
  isComplete: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as AnswerRequest
    const { sessionId, questionIndex, answer } = body

    if (!sessionId || questionIndex === undefined || !answer) {
      return NextResponse.json(
        { error: "sessionId, questionIndex, and answer are required" },
        { status: 400 }
      )
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8787"

    const response = await fetch(`${backendUrl}/api/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId,
        questionIndex,
        answer,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as { error?: string }
      return NextResponse.json(
        { 
          error: errorData.error || "Failed to submit answer",
        },
        { status: response.status }
      )
    }

    const data = await response.json() as EvaluationResponse

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error submitting answer:", error)
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}


