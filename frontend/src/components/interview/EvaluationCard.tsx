"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Evaluation } from "@/types/interview"
import { CheckCircle2, AlertCircle, XCircle, TrendingUp, Lightbulb } from "lucide-react"

type EvaluationCardProps = {
  evaluation: Evaluation
}

export function EvaluationCard({ evaluation }: EvaluationCardProps) {
  const getRatingConfig = (rating: string) => {
    switch (rating) {
      case "excellent":
        return {
          icon: CheckCircle2,
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-100 dark:bg-green-950",
          borderColor: "border-green-300 dark:border-green-800",
          label: "Excellent!",
        }
      case "good":
        return {
          icon: AlertCircle,
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-100 dark:bg-blue-950",
          borderColor: "border-blue-300 dark:border-blue-800",
          label: "Good",
        }
      default:
        return {
          icon: XCircle,
          color: "text-orange-600 dark:text-orange-400",
          bgColor: "bg-orange-100 dark:bg-orange-950",
          borderColor: "border-orange-300 dark:border-orange-800",
          label: "Needs Improvement",
        }
    }
  }

  const config = getRatingConfig(evaluation.rating)
  const Icon = config.icon

  return (
    <Card className={`${config.borderColor} border-2`}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${config.bgColor}`}>
            <Icon className={`h-6 w-6 ${config.color}`} />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">Evaluation</CardTitle>
            <Badge className={`mt-1 ${config.bgColor} ${config.color} border-0`}>
              {config.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Feedback:</p>
          <p className="text-base leading-relaxed">{evaluation.feedback}</p>
        </div>

        {evaluation.strengths && evaluation.strengths.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <p className="text-sm font-semibold">Strengths:</p>
            </div>
            <ul className="space-y-1 ml-6">
              {evaluation.strengths.map((strength, index) => (
                <li key={index} className="text-sm list-disc">{strength}</li>
              ))}
            </ul>
          </div>
        )}

        {evaluation.improvements && evaluation.improvements.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">Areas for Improvement:</p>
            </div>
            <ul className="space-y-1 ml-6">
              {evaluation.improvements.map((improvement, index) => (
                <li key={index} className="text-sm list-disc">{improvement}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


