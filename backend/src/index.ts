import { Hono } from 'hono'
import { buildCompanyProfile } from './llm/company_research'
import { generateQuestions } from './llm/generate_questions'

type Bindings = {
  AI: Ai
  SESSIONS: KVNamespace
  DEFAULT_MODEL: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => c.text('Workers AI is alive 🚀'))



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
