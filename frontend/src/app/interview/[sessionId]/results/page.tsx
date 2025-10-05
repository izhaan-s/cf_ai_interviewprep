"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Session } from "@/types/interview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  Award,
  Home,
  Download
} from "lucide-react"

export default function ResultsPage() {
  const params = useParams<{ sessionId: string }>()
  const router = useRouter()
  const sessionId = params.sessionId

  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSession() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/session/${sessionId}`)
        
        if (!response.ok) {
          throw new Error("Failed to load session")
        }

        const data = await response.json() as { ok: boolean; session: Session }
        setSession(data.session)
      } catch (err) {
        console.error("Error fetching session:", err)
        setError(err instanceof Error ? err.message : "Failed to load results")
      } finally {
        setIsLoading(false)
      }
    }

    if (sessionId) {
      fetchSession()
    }
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-orange-50/30 to-orange-100/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Loading results...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-orange-50/30 to-orange-100/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container max-w-2xl px-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || "Failed to load results. Please try again."}
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

  const calculateStats = () => {
    const ratings = session.answers.map((a) => a.evaluation.rating)
    const excellent = ratings.filter((r) => r === "excellent").length
    const good = ratings.filter((r) => r === "good").length
    const poor = ratings.filter((r) => r === "poor").length
    
    return { excellent, good, poor, total: ratings.length }
  }

  const stats = calculateStats()
  const scorePercentage = ((stats.excellent * 100 + stats.good * 60) / (stats.total * 100)) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-orange-100/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
            <Award className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Interview Complete!</h1>
          <p className="text-xl text-muted-foreground">
            {session.company} - {session.role}
          </p>
        </div>

        {/* Score Card */}
        <Card className="mb-6 border-primary/20">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Overall Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-primary mb-2">
                {Math.round(scorePercentage)}%
              </div>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
            <Progress value={scorePercentage} className="h-3 mb-6" />
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-100 dark:bg-green-950 rounded-lg">
                <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.excellent}</div>
                <div className="text-sm text-muted-foreground">Excellent</div>
              </div>
              <div className="text-center p-4 bg-blue-100 dark:bg-blue-950 rounded-lg">
                <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.good}</div>
                <div className="text-sm text-muted-foreground">Good</div>
              </div>
              <div className="text-center p-4 bg-orange-100 dark:bg-orange-950 rounded-lg">
                <AlertCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.poor}</div>
                <div className="text-sm text-muted-foreground">Needs Work</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {session.answers.map((answer, index) => {
              const question = session.questions[answer.questionIndex]
              const ratingColors = {
                excellent: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400",
                good: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400",
                poor: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400",
              }
              
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium mb-1">Q{answer.questionIndex + 1}: {question.question}</p>
                      <Badge variant="secondary" className="text-xs">{question.type}</Badge>
                    </div>
                    <Badge className={ratingColors[answer.evaluation.rating as keyof typeof ratingColors]}>
                      {answer.evaluation.rating}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {answer.evaluation.feedback}
                  </p>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push("/start")} variant="outline" size="lg">
            <Home className="mr-2 h-5 w-5" />
            New Interview
          </Button>
          <Button size="lg" disabled>
            <Download className="mr-2 h-5 w-5" />
            Download Report
          </Button>
        </div>
      </div>
    </div>
  )
}


