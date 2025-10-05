import { buildCompanyProfile } from './llm/company_research'
import { generateQuestions } from './llm/generate_questions'

export interface Session {
  sessionId: string
  company: string
  role: string
  profile: any
  questions: any[]
  answers: Array<{
    questionIndex: number
    answer: string
    evaluation?: any
    timestamp: string
  }>
  createdAt: string
  status: 'active' | 'completed'
}

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Generates a new session with a unique ID, company profile, and questions
export async function createSession(
  c: any,
  company: string,
  role: string
): Promise<Session> {
  const sessionId = generateSessionId()

  // fetch company profile and generate questions
  const profile = await buildCompanyProfile(c, company)
  const questions = await generateQuestions(c, profile, role)

  const session: Session = {
    sessionId,
    company,
    role,
    profile,
    questions,
    answers: [],
    createdAt: new Date().toISOString(),
    status: 'active'
  }

  // store in KV with 24 hour TTL
  await c.env.SESSIONS.put(
    sessionId,
    JSON.stringify(session),
    { expirationTtl: 86400 }
  )

  return session
}

// Gets a session by ID
export async function getSession(c: any, sessionId: string): Promise<Session | null> {
  const data = await c.env.SESSIONS.get(sessionId)
  
  if (!data) return null
  
  try {
    return JSON.parse(data)
  } catch (err) {
    console.error('Failed to parse session:', err)
    return null
  }
}

// Updates session data w new session just replace the old one
export async function updateSession(c: any, session: Session): Promise<void> {
  await c.env.SESSIONS.put(
    session.sessionId,
    JSON.stringify(session),
    { expirationTtl: 86400 }
  )
}

// Adds an answer to the session
export async function addAnswer(
  c: any,
  sessionId: string,
  questionIndex: number,
  answer: string,
  evaluation?: any
): Promise<Session | null> {
  const session = await getSession(c, sessionId)
  
  if (!session) return null

  session.answers.push({
    questionIndex,
    answer,
    evaluation,
    timestamp: new Date().toISOString()
  })

  // mark as completed if all questions answered
  if (session.answers.length >= session.questions.length) {
    session.status = 'completed'
  }

  await updateSession(c, session)
  return session
}
