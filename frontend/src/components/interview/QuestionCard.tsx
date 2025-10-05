"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Question } from "@/types/interview"
import { Badge } from "@/components/ui/badge"
import { Lightbulb } from "lucide-react"

type QuestionCardProps = {
  question: Question
  questionNumber: number
  totalQuestions: number
}

export function QuestionCard({ question, questionNumber, totalQuestions }: QuestionCardProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            Question {questionNumber} of {totalQuestions}
          </Badge>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            {question.type}
          </Badge>
        </div>
        <CardTitle className="text-2xl leading-tight">{question.question}</CardTitle>
        {question.company_alignment && (
          <CardDescription className="flex items-start gap-2 mt-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
            <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-sm">{question.company_alignment}</span>
          </CardDescription>
        )}
      </CardHeader>
      {question.category && (
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Category:</span> {question.category}
          </div>
        </CardContent>
      )}
    </Card>
  )
}


