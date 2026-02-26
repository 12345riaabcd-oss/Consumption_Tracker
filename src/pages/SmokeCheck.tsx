import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

type Screen =
  | "start"
  | "how-many"
  | "urge-time"
  | "feel"
  | "reflection"
  | "yes-done"
  | "no-reinforce"
  | "no-close"
  | "final-done";

const slide = {
  initial: { opacity: 0, x: 80 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -80 },
  transition: { duration: 0.3, ease: "easeInOut" },
};

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35, ease: "easeOut" },
};

const SmokeCheck = () => {
  const [screen, setScreen] = useState<Screen>("start");
  const [smoked, setSmoked] = useState("");
  const [count, setCount] = useState("");
  const [urge, setUrge] = useState("");
  const [feeling, setFeeling] = useState("");
  const [step, setStep] = useState("");

  const go = (next: Screen, delay = 350) => {
    setTimeout(() => setScreen(next), delay);
  };

  const countOptions = ["1", "2–3", "4–5", "More than 5"];
  const urgeOptions = ["Morning", "Afternoon", "Evening", "Late night"];
  const feelOptions = ["Okay", "Neutral", "Not great"];

  return (
    <div className="sc-gradient min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">

          {/* SCREEN 1 – Start */}
          {screen === "start" && (
            <motion.div key="start" {...slide} className="flex flex-col items-center text-center gap-8">
              <span className="text-4xl">🚬</span>
              <div>
                <h1 className="sc-heading text-[1.75rem] mb-2">Smoke Check</h1>
                <p className="sc-body text-sc-midnight/50 text-sm">Just a moment of honesty.</p>
              </div>
              <p className="sc-body text-lg text-sc-midnight">Did you smoke a cigarette today?</p>
              <div className="flex flex-col gap-3 w-full">
                {["Yes", "No"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSmoked(opt);
                      go(opt === "No" ? "no-reinforce" : "how-many");
                    }}
                    className={`sc-pill w-full ${
                      smoked === opt ? "sc-pill-midnight" : "sc-pill-outline"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* YES – How many */}
          {screen === "how-many" && (
            <motion.div key="how-many" {...slide} className="flex flex-col items-center text-center gap-8">
              <p className="sc-body text-lg text-sc-midnight">How many cigarettes did you smoke?</p>
              <div className="flex flex-col gap-3 w-full">
                {countOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setCount(opt);
                      go("urge-time");
                    }}
                    className={`sc-pill w-full ${
                      count === opt ? "sc-pill-coral" : "sc-pill-outline"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* YES – Urge time */}
          {screen === "urge-time" && (
            <motion.div key="urge-time" {...slide} className="flex flex-col items-center text-center gap-8">
              <p className="sc-body text-lg text-sc-midnight">When did the urge feel strongest?</p>
              <div className="flex flex-col gap-3 w-full">
                {urgeOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setUrge(opt);
                      go("feel");
                    }}
                    className={`sc-pill w-full ${
                      urge === opt ? "sc-pill-sage" : "sc-pill-outline"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* YES – Feel */}
          {screen === "feel" && (
            <motion.div key="feel" {...slide} className="flex flex-col items-center text-center gap-8">
              <p className="sc-body text-lg text-sc-midnight">How do you feel about it now?</p>
              <div className="flex flex-col gap-3 w-full">
                {feelOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setFeeling(opt);
                      go("reflection");
                    }}
                    className={`sc-pill w-full ${
                      feeling === opt ? "sc-pill-coral" : "sc-pill-outline"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* YES – Reflection */}
          {screen === "reflection" && (
            <motion.div key="reflection" {...slide} className="flex flex-col items-center text-center gap-6">
              <p className="sc-body text-lg text-sc-midnight">
                What would you like to do differently next time?
              </p>
              <input
                type="text"
                value={step}
                onChange={(e) => setStep(e.target.value)}
                placeholder="e.g. Wait 10 min before lighting up"
                className="sc-input"
                autoFocus
              />
              <button
                onClick={() => setScreen("yes-done")}
                className="sc-pill sc-pill-midnight sc-shadow mt-2"
              >
                Save Today
              </button>
            </motion.div>
          )}

          {/* YES – Done */}
          {screen === "yes-done" && (
            <motion.div key="yes-done" {...fade} className="flex flex-col items-center text-center gap-5">
              <p className="sc-heading text-xl text-sc-midnight">
                Awareness is how change begins.
              </p>
              <p className="sc-body text-sm text-sc-midnight/60 max-w-[280px] leading-relaxed">
                Tomorrow is another opportunity — and you're capable of it.
              </p>
              <button
                onClick={() => setScreen("final-done")}
                className="sc-pill sc-pill-midnight sc-shadow mt-6"
              >
                Done
              </button>
            </motion.div>
          )}

          {/* NO – Reinforcement */}
          {screen === "no-reinforce" && (
            <motion.div key="no-reinforce" {...fade} className="flex flex-col items-center text-center gap-5">
              <h2 className="sc-heading text-2xl text-sc-midnight">
                You stayed smoke-free today.
              </h2>
              <p className="sc-body text-sm text-sc-midnight/60">
                That choice matters more than you think.
              </p>
              <button
                onClick={() => go("no-close", 0)}
                className="sc-pill sc-pill-midnight sc-shadow mt-6"
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* NO – Close */}
          {screen === "no-close" && (
            <motion.div key="no-close" {...fade} className="flex flex-col items-center text-center gap-5">
              <p className="sc-heading text-xl text-sc-midnight">
                You're strengthening your control.
              </p>
              <p className="sc-body text-sm text-sc-midnight/60 max-w-[280px] leading-relaxed">
                Keep showing up for yourself — it's working.
              </p>
              <button
                onClick={() => setScreen("final-done")}
                className="sc-pill sc-pill-midnight sc-shadow mt-6"
              >
                Finish Check-In
              </button>
            </motion.div>
          )}

          {/* FINAL DONE – Checkmark */}
          {screen === "final-done" && (
            <motion.div
              key="final-done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-sc-sage flex items-center justify-center shadow-lg">
                <Check className="w-8 h-8 text-white" />
              </div>
              <p className="sc-heading text-lg text-sc-midnight">Saved</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default SmokeCheck;
