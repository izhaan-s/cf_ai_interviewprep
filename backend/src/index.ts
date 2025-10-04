import { Hono } from 'hono'

type Bindings = {
  AI: Ai
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => c.text('Workers AI is alive 🚀'))

app.post('/api/llm', async (c) => {
  const { prompt } = await c.req.json<{ prompt: string }>()
  if (!prompt) return c.json({ error: 'Prompt is required' }, 400)

  const model = '@cf/meta/llama-3-8b-instruct' as keyof AiModels
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

export default app
