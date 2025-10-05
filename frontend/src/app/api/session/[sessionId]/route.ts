import { NextRequest, NextResponse } from "next/server"

type SessionResponse = {
  ok: boolean
  session: {
    sessionId: string
    company: string
    role: string
    status: string
    questions: Array<{
      question: string
      type: string
      category: string
      company_alignment: string
      evaluation_criteria: {
        excellent: string
        good: string
        poor: string
      }
    }>
    answers: Array<{
      questionIndex: number
      answer: string
      evaluation: {
        rating: string
        feedback: string
        strengths: string[]
        improvements: string[]
      }
      timestamp: string
    }>
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8787"

    const response = await fetch(`${backendUrl}/api/session/${sessionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as { error?: string }
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch session" },
        { status: response.status }
      )
    }

    const data = await response.json() as SessionResponse

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching session:", error)
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}


