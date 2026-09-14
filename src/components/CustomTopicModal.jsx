import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CATEGORIES, DIFFICULTIES } from "../data/topics.js";

const emptyForm = { title: "", prompt: "", category: "society", difficulty: "intermediate", keywords: "" };

export default function CustomTopicModal({ open, onClose, customTopics, onAdd, onDelete }) {
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState(null);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const title = form.title.trim();
    const prompt = form.prompt.trim();
    const keywords = form.keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    if (!title || !prompt) {
      setFormError("A title and a prompt are both required.");
      return;
    }

    onAdd({
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      category: form.category,
      difficulty: form.difficulty,
      title,
      prompt,
      keywords: keywords.length ? keywords : ["speak freely", "own words"],
      isCustom: true,
    });
    setForm(emptyForm);
    setFormError(null);
  };

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
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/10 bg-stage-800 px-6 py-6 scrollbar-thin sm:rounded-3xl"
          >
            <h3 className="font-display text-xl">Your own topics</h3>
            <p className="mt-2 text-sm text-chalkdim">
              Add topics and hint words yourself — these are saved on this device and mix right in
              with the built-in ones, no internet required.
            </p>

            <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
              <input
                value={form.title}
                onChange={update("title")}
                placeholder="Topic title, e.g. My First Job"
                className="w-full rounded-xl border border-white/15 bg-stage-900 px-4 py-2.5 text-sm text-chalk placeholder:text-chalkdim/50 focus:border-amber/50"
              />
              <textarea
                value={form.prompt}
                onChange={update("prompt")}
                placeholder="One-line prompt telling the speaker what to talk about"
                rows={2}
                className="w-full resize-none rounded-xl border border-white/15 bg-stage-900 px-4 py-2.5 text-sm text-chalk placeholder:text-chalkdim/50 focus:border-amber/50"
              />
              <div className="flex gap-3">
                <select
                  value={form.category}
                  onChange={update("category")}
                  className="w-1/2 rounded-xl border border-white/15 bg-stage-900 px-3 py-2.5 text-sm text-chalk focus:border-amber/50"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <select
                  value={form.difficulty}
                  onChange={update("difficulty")}
                  className="w-1/2 rounded-xl border border-white/15 bg-stage-900 px-3 py-2.5 text-sm text-chalk focus:border-amber/50"
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <input
                value={form.keywords}
                onChange={update("keywords")}
                placeholder="Hint keywords, comma separated"
                className="w-full rounded-xl border border-white/15 bg-stage-900 px-4 py-2.5 text-sm text-chalk placeholder:text-chalkdim/50 focus:border-amber/50"
              />
              {formError && <p className="text-xs text-coral">{formError}</p>}
              <button
                type="submit"
                className="mt-1 self-start rounded-full bg-amber px-5 py-2 text-sm font-medium text-stage-950"
              >
                + Add topic
              </button>
            </form>

            {customTopics.length > 0 && (
              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="mb-3 text-xs uppercase tracking-wide text-chalkdim/80">
                  your topics ({customTopics.length})
                </p>
                <ul className="flex flex-col gap-2">
                  {customTopics.map((t) => (
                    <li
                      key={t.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-stage-900/60 px-4 py-2.5"
                    >
                      <span className="truncate text-sm text-chalk">{t.title}</span>
                      <button
                        onClick={() => onDelete(t.id)}
                        aria-label={`Delete ${t.title}`}
                        className="shrink-0 text-xs text-chalkdim hover:text-coral"
                      >
                        remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={onClose}
              className="mt-6 w-full rounded-full border border-white/15 py-2.5 text-sm text-chalkdim hover:text-chalk sm:hidden"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
