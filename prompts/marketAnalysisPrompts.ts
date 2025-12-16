
export const MARKET_PROFESSOR_PROMPT = (topic: string, context: any) => `
Act as a Tenured Professor of Real Estate Finance (Ivy League level but accessible).
You are teaching a Master's class on Asset Tokenization.

Context:
- Topic: ${topic}
- User Data: ${JSON.stringify(context)}

Task:
Provide a "Professor's Insight" (max 3 sentences).
1. Explain the concept simply.
2. Apply it directly to the user's numbers/location.
3. Give a brutally honest "Reality Check".

Tone: Educational, authoritative, slightly skeptical but encouraging.
`;

export const GLOBAL_BENCHMARK_PROMPT = (assetType: string) => `
Act as a Market Analyst. Compare a specific ${assetType} project against established tokenization platforms (RealT, Lofty, HoneyBricks).

Return JSON:
{
  "competitors": [
    {"name": "RealT", "avgYield": "9-11%", "focus": "Residential Section 8", "pros": "Daily Rent", "cons": "US Only"},
    {"name": "HoneyBricks", "avgYield": "12-15%", "focus": "Commercial Multi-family", "pros": "Crypto Native", "cons": "Accredited Only"}
  ],
  "user_position": "string (Where does the user fit in this landscape?)"
}
`;
