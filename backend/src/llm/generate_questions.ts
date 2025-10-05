export async function generateQuestions(c: any, profile: any, role: string) {
  const model = c.env.DEFAULT_MODEL || "@cf/meta/llama-3.1-8b-instruct"
  const resp = await c.env.AI.run(model, {
    max_tokens: 1024,
    messages: [
      {
        role: "system",
        content: `You are an expert interview coach who creates tailored interview questions based on company research.

Your questions should:
- Test alignment with company values and culture
- Be realistic and commonly asked in real interviews
- Include both behavioral (STAR method) and technical questions
- Come with evaluation criteria so answers can be scored later

Output ONLY valid JSON. No markdown, no explanations.`
      },
      {
        role: "user",
        content: `Generate 5 interview questions for a ${role} role at ${profile.name}.

Company context:
- Values: ${profile.values.join(', ')}
- Culture: ${profile.culture}
- Mission: ${profile.mission}
- Key Technologies: ${profile.key_technologies.join(', ')}

Create a JSON array with this structure:
[
  {
    "question": "the interview question",
    "type": "behavioral" or "technical",
    "category": "e.g. leadership, problem-solving, system design, coding",
    "company_alignment": "brief explanation of why this question matters to this company",
    "evaluation_criteria": {
      "excellent": "what makes a great answer",
      "good": "what makes an acceptable answer",
      "poor": "red flags to watch for"
    }
  }
]

Mix: 3 behavioral questions (testing values/culture fit) + 2 technical questions (testing role-specific skills).

Be specific to ${profile.name}. Reference their values, tech stack, or notable projects when relevant.

Output only the JSON array.`
      }
    ]
  })

  let text = typeof resp === "string" ? resp : (resp as any).response ?? JSON.stringify(resp)

  // extract JSON from markdown blocks
  const jsonMatch = text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/)
  if (jsonMatch) {
    text = jsonMatch[1]
  }

  // find array bounds
  const firstBracket = text.indexOf('[')
  const lastBracket = text.lastIndexOf(']')
  if (firstBracket !== -1 && lastBracket !== -1) {
    text = text.slice(firstBracket, lastBracket + 1)
  }

  try {
    const questions = JSON.parse(text)
    return questions
  } catch (err) {
    console.error('Failed to parse questions JSON:', err)
    // fallback: return default questions
    return [
      {
        question: `Tell me about a time you demonstrated one of ${profile.name}'s core values.`,
        type: "behavioral",
        category: "culture-fit",
        company_alignment: `Tests alignment with company values`,
        evaluation_criteria: {
          excellent: "Specific example with measurable impact, clearly ties to company value",
          good: "Clear example with some detail and outcome",
          poor: "Generic answer, no specific example or outcome"
        }
      }
    ]
  }
}
