import { motion } from "framer-motion";
import { formatDuration } from "../lib/analyzeSpeech.js";

export default function TimerRing({ elapsedSeconds, targetSeconds, listening }) {
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(elapsedSeconds / targetSeconds, 1);
  const pastTarget = elapsedSeconds >= targetSeconds;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative grid place-items-center">
      <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(245,241,232,0.08)" strokeWidth="10" />
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={pastTarget ? "#F2C14E" : "#FF5D73"}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ ease: "linear", duration: 0.3 }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.div
          animate={listening ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ repeat: listening ? Infinity : 0, duration: 1.6 }}
          className={`mb-1 h-2.5 w-2.5 rounded-full ${listening ? "bg-coral" : "bg-chalkdim/40"}`}
        />
        <span className="font-display text-3xl tabular-nums">{formatDuration(elapsedSeconds)}</span>
        <span className="text-xs text-chalkdim">
          {pastTarget ? "goal reached" : `of ${formatDuration(targetSeconds)} goal`}
        </span>
      </div>
    </div>
  );
}
