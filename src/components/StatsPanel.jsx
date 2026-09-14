import { motion } from "framer-motion";
import { formatDuration } from "../lib/analyzeSpeech.js";

function StatBlock({ label, value, sub, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 24 }}
      className="rounded-2xl border border-white/10 bg-stage-800/60 px-5 py-4"
    >
      <p className="font-display text-2xl sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-chalkdim/80">{label}</p>
      {sub && <p className="mt-1 text-xs text-chalkdim">{sub}</p>}
    </motion.div>
  );
}

export default function StatsPanel({ topic, result, stats, onRetry, onNewTopic }) {
  const hasTranscript = result.transcript?.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8"
    >
      <div className="text-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 14 }}
          className="text-4xl"
        >
          🎉
        </motion.span>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl">Nice work!</h2>
        <p className="mt-1 text-sm text-chalkdim">
          You spoke about <span className="text-chalk">{topic.title}</span> for{" "}
          {formatDuration(result.durationSeconds)}.
        </p>
      </div>

      {hasTranscript ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatBlock label="Words spoken" value={stats.wordCount} delay={0.05} />
          <StatBlock label="Pace" value={`${stats.wpm} wpm`} sub={stats.pace} delay={0.1} />
          <StatBlock
            label="Filler words"
            value={stats.fillerTotal}
            sub={stats.fillerTotal ? `${stats.fillerRatio}% of speech` : "very clean!"}
            delay={0.15}
          />
          <StatBlock
            label="Keywords used"
            value={`${stats.keywordsUsed.length}/${stats.keywordsTotal}`}
            delay={0.2}
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-stage-800/60 px-5 py-6 text-center text-sm text-chalkdim">
          No transcript captured this time — that's fine, the timer still counted{" "}
          {formatDuration(result.durationSeconds)} of practice. Try enabling microphone access or use
          Chrome/Edge for live stats next time.
        </div>
      )}

      {hasTranscript && stats.fillerTotal > 0 && (
        <div className="rounded-2xl border border-white/10 bg-stage-800/40 px-5 py-4">
          <p className="mb-2 text-xs uppercase tracking-wide text-chalkdim/80">filler word breakdown</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.fillerCounts).map(([word, count]) => (
              <span key={word} className="rounded-full bg-white/8 px-3 py-1 text-xs text-chalkdim">
                "{word}" ×{count}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasTranscript && (
        <details className="rounded-2xl border border-white/10 bg-stage-800/40 px-5 py-4 text-sm">
          <summary className="cursor-pointer text-chalkdim">view full transcript</summary>
          <p className="mt-3 leading-relaxed text-chalkdim">{result.transcript}</p>
        </details>
      )}

      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={onRetry}
          className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-chalkdim transition-colors hover:border-white/30 hover:text-chalk"
        >
          ⟲ Try this topic again
        </button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onNewTopic}
          className="rounded-full bg-amber px-6 py-2.5 text-sm font-medium text-stage-950"
        >
          Next topic →
        </motion.button>
      </div>
    </motion.div>
  );
}
