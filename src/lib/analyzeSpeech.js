const FILLER_WORDS = [
  "um", "uh", "umm", "uhh", "like", "you know", "sort of", "kind of",
  "actually", "basically", "literally", "i mean", "so yeah", "right",
];

export function analyzeSpeech(transcript, { durationSeconds, keywords = [] }) {
  const clean = transcript.trim().toLowerCase();
  const words = clean.length ? clean.split(/\s+/) : [];
  const wordCount = words.length;
  const minutes = Math.max(durationSeconds / 60, 1 / 60);
  const wpm = Math.round(wordCount / minutes);

  const fillerCounts = {};
  let fillerTotal = 0;
  FILLER_WORDS.forEach((filler) => {
    const escaped = filler.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b${escaped}\\b`, "g");
    const matches = clean.match(re);
    if (matches?.length) {
      fillerCounts[filler] = matches.length;
      fillerTotal += matches.length;
    }
  });

  const keywordsUsed = keywords.filter((kw) => clean.includes(kw.toLowerCase()));

  let pace = "steady";
  if (wpm > 0) {
    if (wpm < 90) pace = "slow & deliberate";
    else if (wpm > 160) pace = "quite fast";
    else pace = "natural conversational pace";
  }

  return {
    wordCount,
    wpm,
    durationSeconds,
    fillerTotal,
    fillerCounts,
    fillerRatio: wordCount ? +(fillerTotal / wordCount * 100).toFixed(1) : 0,
    keywordsUsed,
    keywordsTotal: keywords.length,
    pace,
  };
}

export function formatDuration(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
