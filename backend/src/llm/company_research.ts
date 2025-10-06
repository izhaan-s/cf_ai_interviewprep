import { truncateSmart } from "../util"

export async function buildCompanyProfile(c: any, company: string) {
    const companySlug = company.toLowerCase().replace(/\s+/g, '')
    
    // uses jina ai reader to get clean markdown
    const sources = [
      `https://r.jina.ai/http://en.wikipedia.org/wiki/${encodeURIComponent(company)}`,
      `https://r.jina.ai/https://${companySlug}.com/about`,
      `https://r.jina.ai/https://${companySlug}.com/careers`,
    ]
    
    // fetch all sources in parallel
    const results = await Promise.allSettled(
      sources.map(url => 
        fetch(url).then(r => r.ok ? r.text() : "")
      )
    )
    
    // extract successful results
    const [wiki, about, careers] = results.map(r => 
      r.status === 'fulfilled' ? r.value : ""
    )
    
    // truncation to prefer complete sentences
    const truncatedWiki = truncateSmart(wiki, 3000)
    const truncatedAbout = truncateSmart(about, 3000)
    const truncatedCareers = truncateSmart(careers, 2000)

    const content = `
    Wikipedia:
    ${truncatedWiki}
    
    About page:
    ${truncatedAbout}
    
    Careers/Culture:
    ${truncatedCareers}
    `.trim()
    
    console.log('Fetched content length:', content.length)
    
  // structured summary duhh
  const model = c.env.DEFAULT_MODEL || "@cf/openai/gpt-oss-120b"
  const resp = await c.env.AI.run(model, {
    max_tokens: 1024,  // reduced for stability in dev mode
    messages: [
      {
        role: "system",
        content: `You are an expert interview prep researcher. Your job is to extract information that helps candidates prepare for job interviews.

Focus on:
- Core company values and cultural principles (what they care about in employees)
- Mission statements and company goals (to align answers with)
- Notable achievements and projects (to show you've done research)
- Technologies they use (for technical roles)
- Work culture indicators (remote-first, collaboration style, etc.)

Extract concrete, specific information. Avoid generic corporate speak.

Output ONLY valid JSON with no markdown, no code blocks, no explanations. Just the raw JSON object.`
      },
      { 
        role: "user", 
        content: `Analyze ${company} for interview preparation. Extract these fields:

{
  "name": "exact company name",
  "summary": "concise 2-3 sentence overview focusing on their main business and impact",
  "values": ["specific cultural values they emphasize - look for quotes or explicit statements"],
  "culture": "1-2 sentences on work environment, collaboration style, or hiring priorities",
  "mission": "their mission/vision statement if explicitly stated, or core purpose",
  "headquarters": "city, country",
  "founded": "year as string",
  "notable_projects": ["specific products, initiatives, or achievements with names"],
  "key_technologies": ["technical stack, platforms, or methodologies they use/build"],
  "recent_achievements": ["recent milestones, awards, funding rounds, or major launches"]
}

Be specific. If information is unavailable, use empty string "" or empty array [].

Source text:
${content}

Output only the JSON object.` 
      }
    ]
  })

  // Handle different AI response formats
  let text: string
  if (typeof resp === "string") {
    text = resp
  } else if (resp && typeof resp === "object") {
    // Try common response properties
    text = (resp as any).response || (resp as any).text || (resp as any).content || JSON.stringify(resp)
  } else {
    text = String(resp)
  }
  
  // try to extract JSON from markdown code blocks if present
  const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
  if (jsonMatch) {
    text = jsonMatch[1]
  }
  
  // remove any leading/trailing non-JSON text
  const firstBrace = text.indexOf('{')
  const lastBrace = text.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace !== -1) {
    text = text.slice(firstBrace, lastBrace + 1)
  }

  try {
    return JSON.parse(text)
  } catch (err) {
    console.error('Failed to parse company profile:', err)
    return {
      name: company,
      summary: "",
      values: [],
      culture: "",
      mission: "",
      headquarters: "",
      founded: "",
      notable_projects: [],
      key_technologies: [],
      recent_achievements: []
    }
  }
}
  