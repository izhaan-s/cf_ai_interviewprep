"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InterviewForm } from "@/components/start/InterviewForm"
import { Cloud, Zap, Shield, TrendingUp } from "lucide-react"

export default function StartPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-orange-50/30 to-orange-100/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
        <div className="max-w-2xl mx-auto space-y-8 w-full">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-3 bg-primary rounded-xl shadow-lg shadow-primary/25">
              <Cloud className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-foreground">
              AI Interview Prep
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto">
              Ace your next interview with AI-powered practice sessions
            </p>
          </div>

          {/* Form Card */}
          <Card className="shadow-2xl border border-border/50">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold">Get Started</CardTitle>
              <CardDescription className="text-base">
                Tell us about your interview and we'll create a personalized prep session
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <InterviewForm />
            </CardContent>
          </Card>


          {/* Cloudflare Branding Footer */}
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Powered by Cloudflare Workers AI
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}