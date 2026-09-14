import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import TimerRing from "./TimerRing.jsx";
import KeywordHelper, { REVEAL_BATCH } from "./KeywordHelper.jsx";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition.js";

export default function SessionScreen({ topic, targetSeconds, onFinish, onExit }) {
  const [elapsed, setElapsed] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const startedAtRef = useRef(null);

  const speech = useSpeechRecognition();

  useEffect(() => {
    if (running) {
      startedAtRef.current = Date.now() - elapsed * 1000;
      intervalRef.current = setInterval(() => {
        setElapsed((Date.now() - startedAtRef.current) / 1000);
      }, 200);
    }
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const beginSession = () => {
    setRunning(true);
    if (speech.supported) speech.start();
  };

  const endSession = () => {
    setRunning(false);
    clearInterval(intervalRef.current);
    if (speech.supported) speech.stop();
    onFinish({
      transcript: speech.fullTranscript,
      durationSeconds: elapsed,
      keywordsRevealed: revealedCount,
    });
  };

  const revealKeywords = () => setRevealedCount((c) => Math.min(c + REVEAL_BATCH, topic.keywords.length));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 flex-col items-center justify-between gap-8 px-5 py-8 sm:px-8"
    >
      <div className="w-full max-w-xl text-center">
        <p className="text-xs uppercase tracking-wide text-chalkdim/80">your topic</p>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl">{topic.title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-chalkdim">{topic.prompt}</p>
      </div>

      <TimerRing elapsedSeconds={elapsed} targetSeconds={targetSeconds} listening={running} />

      {!running ? (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={beginSession}
          className="rounded-full bg-coral px-8 py-3 font-medium text-stage-950 shadow-[0_10px_30px_-10px_rgba(255,93,115,0.6)]"
        >
          {speech.supported ? "🎙️ Start talking" : "▶ Start timer"}
        </motion.button>
      ) : (
        <div className="flex w-full flex-col items-center gap-6">
          {speech.supported && (
            <div className="min-h-[2.5rem] w-full max-w-md text-center text-sm text-chalkdim">
              <span className="text-chalk">{speech.finalTranscript}</span>
              <span className="text-chalkdim/60">{speech.interimTranscript}</span>
              {!speech.finalTranscript && !speech.interimTranscript && (
                <span className="italic text-chalkdim/50">listening…</span>
              )}
            </div>
          )}

          <KeywordHelper keywords={topic.keywords} revealedCount={revealedCount} onReveal={revealKeywords} />

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={endSession}
            className="rounded-full border border-white/20 px-8 py-3 font-medium text-chalk transition-colors hover:border-white/40"
          >
            ■ Finish & see stats
          </motion.button>
        </div>
      )}

      {!speech.supported && (
        <p className="max-w-sm text-center text-xs text-chalkdim/70">
          Your browser doesn't support live transcription — try Chrome or Edge for that feature.
          The timer and keyword prompts still work fine here.
        </p>
      )}

      <button onClick={onExit} className="text-xs text-chalkdim/60 underline underline-offset-4 hover:text-chalkdim">
        exit session
      </button>
    </motion.div>
  );
}
