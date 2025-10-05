import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"

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
    console.log("Form submitted:", data)
    // TODO: Send data to backend API
    // For now, just navigate to interview page
    // router.push('/interview')
  }

  return {
    form,
    onSubmit,
  }
}

