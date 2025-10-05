"use client"

import { useParams, useRouter } from "next/navigation"
import { useInterview } from "@/hooks/useInterview"
import { QuestionCard } from "@/components/interview/QuestionCard"
import { AnswerInput } from "@/components/interview/AnswerInput"
import { EvaluationCard } from "@/components/interview/EvaluationCard"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, ArrowRight, CheckCircle } from "lucide-react"

export default function InterviewPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string

  const {
    session,
    currentQuestion,
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
    totalQuestions,
    answeredCount,
  } = useInterview(sessionId)

  const handleSubmit = async () => {
    try {
      await submitAnswer(currentAnswer)
    } catch (err) {
      // Error is handled in the hook
    }
  }

  const handleNext = () => {
    if (isComplete) {
      // Navigate to results/summary page
      router.push(`/interview/${sessionId}/results`)
    } else {
      nextQuestion()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-orange-50/30 to-orange-100/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Loading interview...</p>
            <p className="text-sm text-muted-foreground mt-2">
              Preparing your questions
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !session || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-orange-50/30 to-orange-100/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container max-w-2xl px-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || "Failed to load interview. Please try again."}
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Button onClick={() => router.push("/start")}>
              Back to Start
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-orange-100/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">{session.company}</h1>
              <p className="text-muted-foreground">{session.role} Interview</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {answeredCount}/{totalQuestions}
              </p>
              <p className="text-sm text-muted-foreground">Questions</p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Question */}
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
          />

          {/* Answer Input or Evaluation */}
          {!currentEvaluation ? (
            <AnswerInput
              value={currentAnswer}
              onChange={setCurrentAnswer}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isDisabled={isCurrentQuestionAnswered}
            />
          ) : (
            <>
              {/* Show submitted answer */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Your Answer:
                  </p>
                  <p className="text-base whitespace-pre-wrap">{currentAnswer}</p>
                </CardContent>
              </Card>

              {/* Evaluation */}
              <EvaluationCard evaluation={currentEvaluation} />

              {/* Navigation */}
              <div className="flex justify-end">
                <Button onClick={handleNext} size="lg" className="min-w-[160px]">
                  {isComplete ? (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      View Results
                    </>
                  ) : (
                    <>
                      Next Question
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}


