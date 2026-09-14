import { motion } from "framer-motion";
import { CATEGORIES, DIFFICULTIES } from "../data/topics.js";

function PillGroup({ label, active, onChange, options, getId, getLabel }) {
  return (
    <div>
      <p className="mb-2.5 text-xs font-medium uppercase tracking-wide text-chalkdim/80">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const id = getId(opt);
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                isActive ? "text-stage-950" : "text-chalkdim hover:text-chalk"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId={`pill-${label}`}
                  className="absolute inset-0 rounded-full bg-amber"
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                />
              )}
              <span className="relative z-10">{getLabel(opt)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CategoryPicker({ category, difficulty, onCategory, onDifficulty }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:gap-8">
      <PillGroup
        label="Category"
        active={category}
        onChange={onCategory}
        options={[{ id: "all", label: "All" }, ...CATEGORIES]}
        getId={(o) => o.id}
        getLabel={(o) => o.label}
      />
      <PillGroup
        label="Difficulty"
        active={difficulty}
        onChange={onDifficulty}
        options={[{ id: "all", label: "Any" }, ...DIFFICULTIES]}
        getId={(o) => o.id}
        getLabel={(o) => o.label}
      />
    </div>
  );
}
