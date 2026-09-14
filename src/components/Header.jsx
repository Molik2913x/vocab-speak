import { motion } from "framer-motion";

export default function Header({ aiMode, onToggleAI, onOpenSettings, onOpenCustomTopics, streak }) {
  return (
    <header className="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-6">
      <div className="flex items-center gap-2.5">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-coral text-stage-950 font-display font-semibold text-lg sm:h-10 sm:w-10">
          S
        </div>
        <div className="leading-tight">
          <p className="font-display text-lg sm:text-xl">Speak Stage</p>
          <p className="hidden text-xs text-chalkdim sm:block">spontaneous speaking practice</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {streak > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden items-center gap-1.5 rounded-full border border-amber/30 bg-amber/10 px-3 py-1.5 text-xs text-amber sm:flex"
          >
            🔥 {streak} day streak
          </motion.div>
        )}

        <button
          onClick={onToggleAI}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
            aiMode
              ? "border-coral bg-coral/15 text-coral"
              : "border-white/15 text-chalkdim hover:border-white/30 hover:text-chalk"
          }`}
        >
          {aiMode ? "AI mode: on" : "AI mode: off"}
        </button>

        <button
          onClick={onOpenCustomTopics}
          aria-label="Add your own topics"
          className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-chalkdim transition-colors hover:border-white/30 hover:text-chalk"
        >
          +
        </button>

        <button
          onClick={onOpenSettings}
          aria-label="AI settings"
          className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-chalkdim transition-colors hover:border-white/30 hover:text-chalk"
        >
          ⚙
        </button>
      </div>
    </header>
  );
}
