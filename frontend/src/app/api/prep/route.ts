import { NextRequest, NextResponse } from "next/server"

type PrepRequestBody = {
  company: string
  role: string
  interviewType?: string
  experienceLevel?: string
  focusAreas?: string
}

type BackendResponse = {
  ok: boolean
  sessionId: string
  company: string
  role: string
  questionCount: number
}

type BackendErrorResponse = {
  error?: string
  details?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as PrepRequestBody
    const { company, role, interviewType, experienceLevel, focusAreas } = body

    // Validate required fields
    if (!company || !role) {
      return NextResponse.json(
        { error: "Company and role are required" },
        { status: 400 }
      )
    }

    // Get backend URL from environment or use default
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "http://localhost:8787"

    // Call the backend /api/prep endpoint
    const response = await fetch(`${backendUrl}/api/prep`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company,
        role,
        // Additional fields for future backend enhancement
        interviewType,
        experienceLevel,
        focusAreas,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as BackendErrorResponse
      return NextResponse.json(
        { 
          error: errorData.error || "Failed to create prep session",
          details: errorData.details 
        },
        { status: response.status }
      )
    }

    const data = await response.json() as BackendResponse

    return NextResponse.json({
      ok: true,
      sessionId: data.sessionId,
      company: data.company,
      role: data.role,
      questionCount: data.questionCount,
    })
  } catch (error) {
    console.error("Error in /api/prep:", error)
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

