import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header.jsx";
import CategoryPicker from "./components/CategoryPicker.jsx";
import TopicCard from "./components/TopicCard.jsx";
import SessionScreen from "./components/SessionScreen.jsx";
import StatsPanel from "./components/StatsPanel.jsx";
import AISettingsModal from "./components/AISettingsModal.jsx";
import CustomTopicModal from "./components/CustomTopicModal.jsx";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { getRandomTopic, TOPICS, DIFFICULTIES } from "./data/topics.js";
import { generateAITopic } from "./lib/aiTopics.js";
import { analyzeSpeech } from "./lib/analyzeSpeech.js";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

// Slot-machine timing: fast constant spin while we have no result yet,
// then a short decelerating run that lands exactly on the final topic.
const FAST_TICK_MS = 70;
const LAND_TICKS = 8;

export default function App() {
  const [stage, setStage] = useState("select"); // select | session | results
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [topic, setTopic] = useState(() => getRandomTopic(TOPICS, {}));
  const [sessionResult, setSessionResult] = useState(null);

  const [aiMode, setAiMode] = useLocalStorage("speakstage.aiMode", false);
  const [apiKey, setApiKey] = useLocalStorage("speakstage.apiKey", "");
  const [customTopics, setCustomTopics] = useLocalStorage("speakstage.customTopics", []);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [lastPracticeDate, setLastPracticeDate] = useLocalStorage("speakstage.lastDate", null);
  const [streak, setStreak] = useLocalStorage("speakstage.streak", 0);

  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [spinDisplay, setSpinDisplay] = useState(topic);
  const [justLanded, setJustLanded] = useState(false);

  const spinTimeoutRef = useRef(null);
  const spinRunIdRef = useRef(0);

  useEffect(() => () => clearTimeout(spinTimeoutRef.current), []);

  const combinedPool = useMemo(() => [...TOPICS, ...customTopics], [customTopics]);
  const targetSeconds = (DIFFICULTIES.find((d) => d.id === topic?.difficulty)?.minutes ?? 3) * 60;

  const pickTopic = async (opts = {}) => {
    const nextCategory = opts.category ?? category;
    const nextDifficulty = opts.difficulty ?? difficulty;
    const pool = combinedPool;
    const runId = ++spinRunIdRef.current;

    setAiError(null);
    setSpinning(true);
    setJustLanded(false);

    // Phase 1: fast continuous spin while we resolve the final topic.
    let stillFast = true;
    const fastTick = () => {
      if (!stillFast || spinRunIdRef.current !== runId) return;
      setSpinDisplay(pool[Math.floor(Math.random() * pool.length)]);
      spinTimeoutRef.current = setTimeout(fastTick, FAST_TICK_MS);
    };
    fastTick();

    let finalTopic;
    if (aiMode && apiKey) {
      setLoadingAI(true);
      try {
        finalTopic = await generateAITopic({ apiKey, category: nextCategory, difficulty: nextDifficulty });
      } catch (err) {
        setAiError(err.message);
        finalTopic = getRandomTopic(pool, { category: nextCategory, difficulty: nextDifficulty, excludeId: topic?.id });
      } finally {
        setLoadingAI(false);
      }
    } else {
      finalTopic = getRandomTopic(pool, { category: nextCategory, difficulty: nextDifficulty, excludeId: topic?.id });
    }

    if (spinRunIdRef.current !== runId) return; // a newer spin superseded this one

    stillFast = false;
    clearTimeout(spinTimeoutRef.current);

    // Phase 2: decelerating landing sequence ending exactly on finalTopic.
    await new Promise((resolve) => {
      let tick = 0;
      const step = () => {
        if (spinRunIdRef.current !== runId) return resolve();
        if (tick < LAND_TICKS - 1) {
          setSpinDisplay(pool[Math.floor(Math.random() * pool.length)]);
          tick += 1;
          const progress = tick / LAND_TICKS;
          const delay = 60 + progress * progress * 240;
          spinTimeoutRef.current = setTimeout(step, delay);
        } else {
          setSpinDisplay(finalTopic);
          spinTimeoutRef.current = setTimeout(resolve, 340);
        }
      };
      step();
    });

    if (spinRunIdRef.current !== runId) return;

    setTopic(finalTopic);
    setSpinning(false);
    setJustLanded(true);
    setTimeout(() => setJustLanded(false), 700);
  };

  const handleCategory = (id) => {
    setCategory(id);
    pickTopic({ category: id });
  };

  const handleDifficulty = (id) => {
    setDifficulty(id);
    pickTopic({ difficulty: id });
  };

  const addCustomTopic = (t) => setCustomTopics((prev) => [...prev, t]);
  const deleteCustomTopic = (id) => setCustomTopics((prev) => prev.filter((t) => t.id !== id));

  const finishSession = (result) => {
    const stats = analyzeSpeech(result.transcript, {
      durationSeconds: result.durationSeconds,
      keywords: topic.keywords,
    });
    setSessionResult({ result, stats });

    const today = todayKey();
    if (lastPracticeDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      setStreak(lastPracticeDate === yesterday ? streak + 1 : 1);
      setLastPracticeDate(today);
    }

    setStage("results");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        aiMode={aiMode}
        onToggleAI={() => {
          if (!aiMode && !apiKey) setSettingsOpen(true);
          setAiMode(!aiMode);
        }}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenCustomTopics={() => setCustomModalOpen(true)}
        streak={streak}
      />

      <AnimatePresence mode="wait">
        {stage === "select" && (
          <motion.main
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-8 px-5 py-6 sm:px-8"
          >
            <div className="text-center">
              <h1 className="font-display text-3xl leading-tight sm:text-4xl">
                Pick a topic. Speak your mind.
              </h1>
              <p className="mx-auto mt-2 max-w-md text-sm text-chalkdim sm:text-base">
                No scripts, no prep — just talk, and reach for a hint word if you stall.
              </p>
            </div>

            <CategoryPicker
              category={category}
              difficulty={difficulty}
              onCategory={handleCategory}
              onDifficulty={handleDifficulty}
            />

            {aiError && (
              <p className="text-center text-xs text-coral">{aiError} — landed on a local topic instead.</p>
            )}

            <TopicCard
              topic={topic}
              spinning={spinning}
              spinDisplay={spinDisplay}
              justLanded={justLanded}
              onShuffle={() => pickTopic()}
              onStart={() => setStage("session")}
            />

            <p className="text-center text-xs text-chalkdim/50">
              Don't see enough variety?{" "}
              <button onClick={() => setCustomModalOpen(true)} className="underline decoration-dotted hover:text-chalkdim">
                add your own topics
              </button>{" "}
              — they work offline too.
            </p>
          </motion.main>
        )}

        {stage === "session" && (
          <SessionScreen
            key="session"
            topic={topic}
            targetSeconds={targetSeconds}
            onFinish={finishSession}
            onExit={() => setStage("select")}
          />
        )}

        {stage === "results" && sessionResult && (
          <StatsPanel
            key="results"
            topic={topic}
            result={sessionResult.result}
            stats={sessionResult.stats}
            onRetry={() => setStage("session")}
            onNewTopic={() => {
              pickTopic();
              setStage("select");
            }}
          />
        )}
      </AnimatePresence>

      <AISettingsModal
        open={settingsOpen}
        apiKey={apiKey}
        onClose={() => setSettingsOpen(false)}
        onSave={(key) => {
          setApiKey(key);
          if (!key) setAiMode(false);
          setSettingsOpen(false);
        }}
      />

      <CustomTopicModal
        open={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        customTopics={customTopics}
        onAdd={addCustomTopic}
        onDelete={deleteCustomTopic}
      />

      <footer className="px-5 py-4 text-center text-xs text-chalkdim/50 sm:px-8">
        Built for daily fluency practice — your voice never leaves your browser unless AI mode is on.
      </footer>
    </div>
  );
}
