export type Caption = {
  text: string;
  startMs: number;
  endMs: number;
};

const tokenize = (script: string): string[] =>
  script
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

export function captionsFromScript(
  script: string,
  durationMs: number,
  wordsPerChunk = 5,
): Caption[] {
  const words = tokenize(script);
  if (words.length === 0) {
    return [{text: '', startMs: 0, endMs: durationMs}];
  }

  const chunks: string[] = [];
  for (let index = 0; index < words.length; index += wordsPerChunk) {
    chunks.push(words.slice(index, index + wordsPerChunk).join(' '));
  }

  const totalChars = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  let cursor = 0;
  return chunks.map((text, index) => {
    const share = text.length / totalChars;
    const span = Math.max(700, Math.round(durationMs * share));
    const startMs = cursor;
    const endMs =
      index === chunks.length - 1 ? durationMs : Math.min(durationMs, cursor + span);
    cursor = endMs;
    return {text, startMs, endMs};
  });
}
