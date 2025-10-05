"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useInterviewForm } from "@/hooks/useInterviewForm"
import { Briefcase, Building2, GraduationCap, Target } from "lucide-react"

export function InterviewForm() {
  const { form, onSubmit } = useInterviewForm()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Field */}
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Company
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Google, Microsoft, Amazon..." 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Which company are you preparing for?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role Field */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Role
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Software Engineer, Product Manager..." 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                What position are you interviewing for?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Interview Type */}
        <FormField
          control={form.control}
          name="interviewType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interview Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select interview type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="technical">Technical/Coding</SelectItem>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                  <SelectItem value="system-design">System Design</SelectItem>
                  <SelectItem value="mixed">Mixed (All Types)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                What type of interview are you preparing for?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Experience Level */}
        <FormField
          control={form.control}
          name="experienceLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Experience Level
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                  <SelectItem value="senior">Senior (5-10 years)</SelectItem>
                  <SelectItem value="staff">Staff+ (10+ years)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                This helps tailor questions to your level.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Focus Areas */}
        <FormField
          control={form.control}
          name="focusAreas"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Focus Areas <span className="text-muted-foreground text-xs">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., React, distributed systems, leadership, data structures..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Any specific topics or areas you want to focus on?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" size="lg">
          Start Interview Prep
        </Button>
      </form>
    </Form>
  )
}

