import { AnimatePresence, motion } from "framer-motion";

const REVEAL_BATCH = 3;

export default function KeywordHelper({ keywords, revealedCount, onReveal }) {
  const visible = keywords.slice(0, revealedCount);
  const hasMore = revealedCount < keywords.length;

  return (
    <div className="w-full max-w-md">
      {visible.length === 0 ? (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onReveal}
          className="mx-auto flex items-center gap-2 rounded-full border border-amber/40 bg-amber/10 px-5 py-2.5 text-sm text-amber transition-colors hover:bg-amber/15"
        >
          <span className="text-base">💡</span> Stuck? Get a few words
        </motion.button>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-wrap justify-center gap-2">
            <AnimatePresence>
              {visible.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, scale: 0.5, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 18,
                    delay: (i % REVEAL_BATCH) * 0.06,
                  }}
                  className="rounded-full border border-white/15 bg-stage-700/80 px-3.5 py-1.5 text-sm text-chalk"
                >
                  {word}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          {hasMore && (
            <button
              onClick={onReveal}
              className="text-xs text-chalkdim underline decoration-dotted underline-offset-4 transition-colors hover:text-amber"
            >
              show a few more
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export { REVEAL_BATCH };
