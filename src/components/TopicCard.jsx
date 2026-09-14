import { AnimatePresence, motion } from "framer-motion";
import { CATEGORIES, DIFFICULTIES } from "../data/topics.js";

function metaFor(t) {
  const categoryLabel = CATEGORIES.find((c) => c.id === t?.category)?.label ?? "Mixed";
  const difficultyMeta = DIFFICULTIES.find((d) => d.id === t?.difficulty);
  return { categoryLabel, difficultyMeta };
}

export default function TopicCard({ topic, spinning, spinDisplay, justLanded, onShuffle, onStart }) {
  const displayTopic = spinning ? spinDisplay : topic;
  const { categoryLabel, difficultyMeta } = metaFor(displayTopic);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-b from-amber/10 via-transparent to-transparent blur-2xl sm:-inset-10"
      />

      {/* reel pointer notch, slot-machine style */}
      <div className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
        <div className={`h-3 w-3 rotate-45 ${spinning ? "bg-coral" : "bg-amber"} transition-colors`} />
      </div>

      <motion.div
        animate={
          justLanded
            ? {
                boxShadow: [
                  "0 0 0 0px rgba(242,193,78,0)",
                  "0 0 0 6px rgba(242,193,78,0.35)",
                  "0 0 0 0px rgba(242,193,78,0)",
                ],
              }
            : {}
        }
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="overflow-hidden rounded-3xl border border-white/10 bg-stage-800/60 shadow-glow backdrop-blur-sm"
      >
        <AnimatePresence mode="wait">
          {spinning ? (
            <motion.div
              key="spin-reel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[280px] flex-col items-center justify-center gap-4 px-6 py-14 text-center sm:min-h-[320px]"
            >
              <div className="relative h-24 w-full max-w-sm overflow-hidden sm:h-28">
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-stage-800 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-stage-800 to-transparent" />
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={spinDisplay?.id ?? "spin"}
                    initial={{ y: -46, opacity: 0, filter: "blur(3px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: 46, opacity: 0, filter: "blur(3px)" }}
                    transition={{ duration: 0.14, ease: "easeOut" }}
                    className="absolute inset-0 flex flex-col items-center justify-center"
                  >
                    <span className="text-[11px] uppercase tracking-wide text-chalkdim/70">
                      {categoryLabel}
                    </span>
                    <span className="mt-1 font-display text-xl sm:text-2xl">{displayTopic?.title}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.15 }}
                    className="h-1.5 w-1.5 rounded-full bg-coral"
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={topic?.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="flex min-h-[280px] flex-col justify-between px-6 py-8 sm:min-h-[320px] sm:px-10 sm:py-10"
            >
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-white/8 px-3 py-1 text-chalkdim">{categoryLabel}</span>
                  <span className="rounded-full bg-white/8 px-3 py-1 text-chalkdim">
                    {difficultyMeta?.label ?? "Intermediate"} · speak {difficultyMeta?.minutes ?? 3} min
                  </span>
                  {topic?.isAI && (
                    <span className="rounded-full bg-coral/15 px-3 py-1 text-coral">AI generated</span>
                  )}
                  {topic?.isCustom && (
                    <span className="rounded-full bg-amber/15 px-3 py-1 text-amber">your topic</span>
                  )}
                </div>
                <h2 className="font-display text-2xl leading-tight sm:text-4xl">{topic?.title}</h2>
                <p className="mt-3 max-w-md text-sm text-chalkdim sm:text-base">{topic?.prompt}</p>
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={onShuffle}
                  className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-chalkdim transition-colors hover:border-white/30 hover:text-chalk"
                >
                  🎰 Spin again
                </button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={onStart}
                  className="rounded-full bg-coral px-6 py-2.5 text-sm font-medium text-stage-950 shadow-[0_10px_30px_-10px_rgba(255,93,115,0.6)] transition-transform hover:scale-[1.02] sm:text-base"
                >
                  Start speaking →
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
