import { Hono } from 'hono'
import { buildCompanyProfile } from './llm/company_research'
import { generateQuestions } from './llm/generate_questions'
import { createSession, getSession, addAnswer } from './session'

type Bindings = {
  AI: Ai
  SESSIONS: KVNamespace
  DEFAULT_MODEL: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => c.text('Workers AI is alive 🚀'))

// Create new prep session
app.post('/api/prep', async (c) => {
	const { company, role } = await c.req.json<{ 
		company: string
		role: string 
	}>()
	
	if (!company || !role) {
		return c.json({ error: 'company and role required' }, 400)
	}

	try {
		const session = await createSession(c, company, role)
		
		return c.json({ 
			ok: true,
			sessionId: session.sessionId,
			company: session.company,
			role: session.role,
			questionCount: session.questions.length
		})
	} catch (err: any) {
		console.error('Failed to create session:', err)
		return c.json({ 
			error: 'Failed to create session',
			details: err?.message || String(err),
			stack: err?.stack
		}, 500)
	}
})

// Get session by ID
app.get('/api/session/:sessionId', async (c) => {
	const sessionId = c.req.param('sessionId')
	
	const session = await getSession(c, sessionId)
	
	if (!session) {
		return c.json({ error: 'Session not found' }, 404)
	}

	return c.json({ 
		ok: true,
		session 
	})
})

// Submit answer and get evaluation
app.post('/api/answer', async (c) => {
	const { sessionId, questionIndex, answer } = await c.req.json<{
		sessionId: string
		questionIndex: number
		answer: string
	}>()

	if (!sessionId || questionIndex === undefined || !answer) {
		return c.json({ error: 'sessionId, questionIndex, and answer required' }, 400)
	}

	const session = await getSession(c, sessionId)
	
	if (!session) {
		return c.json({ error: 'Session not found' }, 404)
	}

	if (questionIndex < 0 || questionIndex >= session.questions.length) {
		return c.json({ error: 'Invalid question index' }, 400)
	}

	const question = session.questions[questionIndex]

	// evaluate the answer using AI
	try {
		const model = (c.env.DEFAULT_MODEL || "@cf/meta/llama-3.1-8b-instruct") as keyof AiModels
		const resp = await c.env.AI.run(model, {
			max_tokens: 512,
			messages: [
				{
					role: "system",
					content: `You are an expert interview coach evaluating candidate answers.

Rate the answer as: excellent, good, or poor.
Provide specific, actionable feedback.

Output ONLY valid JSON with no markdown:
{
  "rating": "excellent" | "good" | "poor",
  "feedback": "specific feedback on the answer",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"]
}`
				},
				{
					role: "user",
					content: `Question: ${question.question}
Type: ${question.type}
Company Context: ${question.company_alignment}

Expected in excellent answer: ${question.evaluation_criteria.excellent}
Expected in good answer: ${question.evaluation_criteria.good}
Red flags: ${question.evaluation_criteria.poor}

Candidate's answer:
${answer}

Evaluate this answer and output only the JSON object.`
				}
			]
		})

		let text = typeof resp === "string" ? resp : (resp as any).response ?? JSON.stringify(resp)

		// extract JSON
		const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
		if (jsonMatch) text = jsonMatch[1]

		const firstBrace = text.indexOf('{')
		const lastBrace = text.lastIndexOf('}')
		if (firstBrace !== -1 && lastBrace !== -1) {
			text = text.slice(firstBrace, lastBrace + 1)
		}

		const evaluation = JSON.parse(text)

		// add answer to session
		const updatedSession = await addAnswer(c, sessionId, questionIndex, answer, evaluation)

		return c.json({
			ok: true,
			evaluation,
			answeredCount: updatedSession?.answers.length,
			totalQuestions: session.questions.length,
			isComplete: updatedSession?.status === 'completed'
		})

	} catch (err: any) {
		console.error('Failed to evaluate answer:', err)
		
		// fallback evaluation
		const evaluation = {
			rating: "good",
			feedback: "Answer recorded. Full evaluation unavailable.",
			strengths: ["Answer submitted"],
			improvements: ["Detailed evaluation temporarily unavailable"]
		}

		await addAnswer(c, sessionId, questionIndex, answer, evaluation)

		return c.json({
			ok: true,
			evaluation,
			warning: err?.message || String(err)
		})
	}
})

app.post('/api/summarise', async (c) => {
	const { sessionId } = await c.req.json<{ sessionId: string }>()

	if (!sessionId) {
		return c.json({ error: 'sessionId required' }, 400)
	}

	const session = await getSession(c, sessionId)

	if (!session) {
		return c.json({ error: 'Session not found' }, 404)
	}

	if (session.answers.length === 0) {
		return c.json({ error: 'No answers to summarize' }, 400)
	}

	try {
		// build summary prompt with all Q&A
		const qaText = session.answers.map((a, idx) => {
			const q = session.questions[a.questionIndex]
			return `
Question ${idx + 1} (${q.type}): ${q.question}
Answer: ${a.answer}
Rating: ${a.evaluation?.rating || 'N/A'}
Feedback: ${a.evaluation?.feedback || 'N/A'}
---`
		}).join('\n')

		const model = (c.env.DEFAULT_MODEL || "@cf/meta/llama-3.1-8b-instruct") as keyof AiModels
		const resp = await c.env.AI.run(model, {
			max_tokens: 768,
			messages: [
				{
					role: "system",
					content: `You are an expert interview coach providing overall session feedback.

Output ONLY valid JSON with no markdown:
{
  "overallRating": "strong" | "good" | "needs improvement",
  "summary": "2-3 sentence overall assessment",
  "keyStrengths": ["strength1", "strength2"],
  "areasForImprovement": ["area1", "area2"],
  "nextSteps": ["actionable recommendation1", "actionable recommendation2"]
}`
				},
				{
					role: "user",
					content: `Interview Session Summary for ${session.role} at ${session.company}

${qaText}

Total Questions: ${session.questions.length}
Questions Answered: ${session.answers.length}

Provide overall feedback and output only the JSON object.`
				}
			]
		})

		let text = typeof resp === "string" ? resp : (resp as any).response ?? JSON.stringify(resp)

		const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
		if (jsonMatch) text = jsonMatch[1]

		const firstBrace = text.indexOf('{')
		const lastBrace = text.lastIndexOf('}')
		if (firstBrace !== -1 && lastBrace !== -1) {
			text = text.slice(firstBrace, lastBrace + 1)
		}

		const summary = JSON.parse(text)

		return c.json({
			ok: true,
			summary,
			session: {
				company: session.company,
				role: session.role,
				questionsAnswered: session.answers.length,
				totalQuestions: session.questions.length
			}
		})

	} catch (err: any) {
		console.error('Failed to generate summary:', err)
		return c.json({
			ok: false,
			error: 'Failed to generate summary',
			details: err?.message || String(err)
		}, 500)
	}
})

app.post('/api/research', async (c) => {
	const { company } = await c.req.json<{ company: string }>()
	if (!company) return c.json({ error: 'company required' }, 400)
  
	const profile = await buildCompanyProfile(c, company)
  
	// TODO: cache it in KV later
	// await c.env.SESSIONS.put(
	//   `company:${company.toLowerCase()}`,
	//   JSON.stringify(profile),
	//   { expirationTtl: 86400 }
	// )
  
	return c.json({ ok: true, profile })
})

app.post('/api/questions', async (c) => {
	const { company, role } = await c.req.json<{ 
		company: string
		role: string
	}>()
	
	if (!company || !role) {
		return c.json({ error: 'company and role required' }, 400)
	}

	// get or build company profile
	const profile = await buildCompanyProfile(c, company)
	
	// generate tailored questions
	const questions = await generateQuestions(c, profile, role)

	return c.json({ 
		ok: true, 
		profile,
		questions 
	})
})

export default app
