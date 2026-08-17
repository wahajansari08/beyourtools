export interface TokenEstimate {
  characters: number;
  words: number;
  estimatedTokens: number;
  bytes: number;
}

/**
 * Rough token estimate using a character-based heuristic (~4 chars/token for
 * English-ish text, adjusted slightly for JSON's punctuation density).
 * This is an approximation for quick sizing, not an exact tokenizer count.
 */
export function estimateTokens(input: string): TokenEstimate {
  const characters = input.length;
  const words = input.trim() ? input.trim().split(/\s+/).length : 0;
  const bytes = new TextEncoder().encode(input).length;
  const punctuation = (input.match(/[{}[\]:,"]/g) || []).length;
  const estimatedTokens = Math.ceil((characters - punctuation * 0.5) / 3.7 + punctuation * 0.6);
  return { characters, words, estimatedTokens: Math.max(estimatedTokens, 0), bytes };
}
