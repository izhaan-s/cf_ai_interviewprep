export const truncateSmart = (text: string, maxChars: number) => {
    if (text.length <= maxChars) return text
    const truncated = text.slice(0, maxChars)
    const lastPeriod = truncated.lastIndexOf('.')
    return lastPeriod > maxChars * 0.7 ? truncated.slice(0, lastPeriod + 1) : truncated
  }