import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function AISettingsModal({ open, onClose, apiKey, onSave }) {
  const [draft, setDraft] = useState(apiKey || "");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-3xl border border-white/10 bg-stage-800 px-6 py-6 sm:rounded-3xl"
          >
            <h3 className="font-display text-xl">AI-generated topics</h3>
            <p className="mt-2 text-sm text-chalkdim">
              Optional bonus mode. Paste your own Anthropic API key to generate fresh topics and
              keywords on demand. It's stored only in this browser's local storage and sent only to
              api.anthropic.com — never anywhere else.
            </p>

            <input
              type="password"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="sk-ant-..."
              className="mt-4 w-full rounded-xl border border-white/15 bg-stage-900 px-4 py-2.5 text-sm text-chalk placeholder:text-chalkdim/50 focus:border-amber/50"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => {
                  onSave("");
                  setDraft("");
                }}
                className="rounded-full px-4 py-2 text-sm text-chalkdim hover:text-chalk"
              >
                Clear key
              </button>
              <button
                onClick={() => onSave(draft)}
                className="rounded-full bg-amber px-5 py-2 text-sm font-medium text-stage-950"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
