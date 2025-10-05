import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useState } from "react"

export const interviewFormSchema = z.object({
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
  interviewType: z.string().min(1, {
    message: "Please select an interview type.",
  }),
  experienceLevel: z.string().min(1, {
    message: "Please select your experience level.",
  }),
  focusAreas: z.string().optional(),
})

export type InterviewFormValues = z.infer<typeof interviewFormSchema>

export function useInterviewForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const form = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
      company: "",
      role: "",
      interviewType: "",
      experienceLevel: "",
      focusAreas: "",
    },
  })

  const onSubmit = async (data: InterviewFormValues) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch("/api/prep", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as { error?: string }
        throw new Error(errorData.error || "Failed to start interview prep")
      }

      const result = await response.json() as { sessionId: string }
      console.log("Prep session created:", result)
      
      // Navigate to interview page with session ID
      router.push(`/interview/${result.sessionId}`)
    } catch (err) {
      console.error("Error submitting form:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    onSubmit,
    isLoading,
    error,
  }
}

