"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2, Send } from "lucide-react"

type AnswerInputProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isSubmitting: boolean
  isDisabled: boolean
}

export function AnswerInput({ 
  value, 
  onChange, 
  onSubmit, 
  isSubmitting,
  isDisabled 
}: AnswerInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      if (!isDisabled && !isSubmitting && value.trim()) {
        onSubmit()
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Answer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer here... (Cmd/Ctrl + Enter to submit)"
          rows={8}
          disabled={isDisabled}
          className="resize-none"
        />
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {value.length} characters
          </p>
          <Button
            onClick={onSubmit}
            disabled={isDisabled || isSubmitting || !value.trim()}
            size="lg"
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Evaluating...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Answer
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


