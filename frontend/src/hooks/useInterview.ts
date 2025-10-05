import { useState, useEffect } from "react"
import { Session, Evaluation } from "@/types/interview"

export function useInterview(sessionId: string) {
  const [session, setSession] = useState<Session | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [currentEvaluation, setCurrentEvaluation] = useState<Evaluation | null>(null)

  // Fetch session data
  useEffect(() => {
    async function fetchSession() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/session/${sessionId}`)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({})) as { error?: string }
          throw new Error(errorData.error || "Failed to load session")
        }

        const data = await response.json() as { ok: boolean; session: Session }
        setSession(data.session)
        
        // Set current question to first unanswered question
        const unansweredIndex = data.session.answers.length
        setCurrentQuestionIndex(Math.min(unansweredIndex, data.session.questions.length - 1))
      } catch (err) {
        console.error("Error fetching session:", err)
        setError(err instanceof Error ? err.message : "Failed to load interview")
      } finally {
        setIsLoading(false)
      }
    }

    if (sessionId) {
      fetchSession()
    }
  }, [sessionId])

  // Submit answer
  const submitAnswer = async (answer: string) => {
    if (!session) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: session.sessionId,
          questionIndex: currentQuestionIndex,
          answer,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as { error?: string }
        throw new Error(errorData.error || "Failed to submit answer")
      }

      const data = await response.json() as {
        ok: boolean
        evaluation: Evaluation
        answeredCount: number
        totalQuestions: number
        isComplete: boolean
      }

      setCurrentEvaluation(data.evaluation)

      // Update session with new answer
      const newAnswer = {
        questionIndex: currentQuestionIndex,
        answer,
        evaluation: data.evaluation,
        timestamp: new Date().toISOString(),
      }

      setSession((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          answers: [...prev.answers, newAnswer],
          status: data.isComplete ? "completed" : "active",
        }
      })

      return data
    } catch (err) {
      console.error("Error submitting answer:", err)
      setError(err instanceof Error ? err.message : "Failed to submit answer")
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  // Move to next question
  const nextQuestion = () => {
    if (!session) return
    
    setCurrentAnswer("")
    setCurrentEvaluation(null)
    
    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  // Check if current question is answered
  const isCurrentQuestionAnswered = session?.answers.some(
    (a) => a.questionIndex === currentQuestionIndex
  ) || false

  // Calculate progress
  const progress = session
    ? (session.answers.length / session.questions.length) * 100
    : 0

  const isComplete = session?.status === "completed" || 
    (session && session.answers.length >= session.questions.length)

  return {
    session,
    currentQuestion: session?.questions[currentQuestionIndex],
    currentQuestionIndex,
    currentAnswer,
    setCurrentAnswer,
    currentEvaluation,
    isLoading,
    isSubmitting,
    error,
    submitAnswer,
    nextQuestion,
    isCurrentQuestionAnswered,
    progress,
    isComplete,
    totalQuestions: session?.questions.length || 0,
    answeredCount: session?.answers.length || 0,
  }
}


