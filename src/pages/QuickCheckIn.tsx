import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

type Screen = "start" | "no-end" | "what" | "feel" | "save" | "done";

const transition = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
  transition: { duration: 0.28, ease: "easeInOut" },
};

const QuickCheckIn = () => {
  const [screen, setScreen] = useState<Screen>("start");
  const [consumed, setConsumed] = useState<string>("");
  const [feeling, setFeeling] = useState<string>("");
  const [substance, setSubstance] = useState("");

  const go = (next: Screen, delay = 350) => {
    setTimeout(() => setScreen(next), delay);
  };

  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">
          {screen === "start" && (
            <motion.div key="start" {...transition} className="flex flex-col items-center text-center gap-8">
              <span className="text-4xl">📊</span>
              <div>
                <h1 className="text-2xl font-semibold text-foreground mb-2">Quick Check-In</h1>
                <p className="text-muted-foreground text-sm">Just a simple awareness moment.</p>
              </div>
              <p className="text-lg font-medium text-foreground">Did you consume today?</p>
              <div className="flex flex-col gap-3 w-full">
                {["Yes", "No"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setConsumed(opt);
                      go(opt === "No" ? "no-end" : "what");
                    }}
                    className={`pill-button w-full ${
                      consumed === opt ? "pill-outline-selected" : "pill-outline"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {screen === "no-end" && (
            <motion.div key="no-end" {...transition} className="flex flex-col items-center text-center gap-6">
              <h2 className="text-2xl font-semibold text-foreground">Stayed aligned today.</h2>
              <p className="text-muted-foreground text-sm">That matters.</p>
              <button
                onClick={() => setScreen("done")}
                className="pill-button pill-primary mt-4"
              >
                Finish
              </button>
            </motion.div>
          )}

          {screen === "what" && (
            <motion.div key="what" {...transition} className="flex flex-col items-center text-center gap-8">
              <p className="text-lg font-medium text-foreground">What did you consume?</p>
              <input
                type="text"
                value={substance}
                onChange={(e) => setSubstance(e.target.value)}
                placeholder="Type here..."
                className="input-peach"
                autoFocus
              />
              <button
                onClick={() => {
                  if (substance.trim()) go("feel", 0);
                }}
                disabled={!substance.trim()}
                className="pill-button pill-primary disabled:opacity-40"
              >
                Next
              </button>
            </motion.div>
          )}

          {screen === "feel" && (
            <motion.div key="feel" {...transition} className="flex flex-col items-center text-center gap-8">
              <p className="text-lg font-medium text-foreground">
                How do you feel about it right now?
              </p>
              <div className="flex flex-col gap-3 w-full">
                {["Okay", "Neutral", "Not great"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setFeeling(opt);
                      go("save");
                    }}
                    className={`pill-button w-full ${
                      feeling === opt
                        ? "pill-accent-selected"
                        : "pill-outline"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {screen === "save" && (
            <motion.div key="save" {...transition} className="flex flex-col items-center text-center gap-6">
              <button
                onClick={() => setScreen("done")}
                className="pill-button pill-primary"
              >
                Save Check-In
              </button>
            </motion.div>
          )}

          {screen === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-8 h-8 text-primary-foreground" />
              </div>
              <p className="text-lg font-medium text-foreground">Saved</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuickCheckIn;
