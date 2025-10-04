import { Hono } from 'hono'
import { buildCompanyProfile } from './research'

type Bindings = {
  AI: Ai
  SESSIONS: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => c.text('Workers AI is alive 🚀'))

app.post('/api/llm', async (c) => {
  const { prompt } = await c.req.json<{ prompt: string }>()
  if (!prompt) return c.json({ error: 'Prompt is required' }, 400)

  const model = '@hf/nousresearch/hermes-2-pro-mistral-7b' as keyof AiModels
  const result = await c.env.AI.run(model, {
    messages: [
      { role: 'system', content: 'You are a concise helpful assistant.' },
      { role: 'user', content: prompt }
    ]
  })

  const output =
    typeof result === 'string'
      ? result
      : (result as any)?.response ?? JSON.stringify(result)

  return c.json({ model, output })
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

export default app
