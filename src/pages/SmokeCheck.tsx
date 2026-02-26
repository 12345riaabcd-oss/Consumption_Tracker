import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

type Screen =
  | "start"
  | "how-many"
  | "pack-cost"
  | "financial"
  | "feel"
  | "reflection"
  | "done"
  | "no-reinforce"
  | "no-savings"
  | "no-close"
  | "final-done";

const PACK_COST_KEY = "smoke-check-pack-cost";
const CIGS_PER_PACK = 20;

const slide = {
  initial: { opacity: 0, x: 80 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -80 },
  transition: { duration: 0.3, ease: "easeInOut" },
};

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25, ease: "easeInOut" },
};

const SmokeCheck = () => {
  const [screen, setScreen] = useState<Screen>("start");
  const [smoked, setSmoked] = useState<string>("");
  const [count, setCount] = useState<string>("");
  const [packCost, setPackCost] = useState<string>("");
  const [feeling, setFeeling] = useState<string>("");
  const [step, setStep] = useState<string>("");
  const [storedPackCost, setStoredPackCost] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(PACK_COST_KEY);
    if (saved) setStoredPackCost(parseFloat(saved));
  }, []);

  const go = (next: Screen, delay = 350) => {
    setTimeout(() => setScreen(next), delay);
  };

  const cigCount = (): number => {
    const map: Record<string, number> = {
      "1": 1,
      "2–3": 2.5,
      "4–5": 4.5,
      "More than 5": 7,
    };
    return map[count] || 1;
  };

  const costPerCig = (): number => {
    const cost = storedPackCost || parseFloat(packCost) || 0;
    return cost / CIGS_PER_PACK;
  };

  const todayCost = (): number => Math.round(cigCount() * costPerCig());
  const monthlyCost = (): number => Math.round(todayCost() * 30);
  const dailySavings = (): number => Math.round(costPerCig() * (CIGS_PER_PACK / 2));
  const monthlySavings = (): number => Math.round(dailySavings() * 30);

  const handlePackCostSave = () => {
    const val = parseFloat(packCost);
    if (val > 0) {
      localStorage.setItem(PACK_COST_KEY, val.toString());
      setStoredPackCost(val);
      go("financial", 0);
    }
  };

  const countOptions = ["1", "2–3", "4–5", "More than 5"];
  const feelOptions = ["Okay", "Neutral", "Not great"];

  return (
    <div className="smoke-gradient min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">
          {/* SCREEN 1 – Start */}
          {screen === "start" && (
            <motion.div key="start" {...slide} className="flex flex-col items-center text-center gap-8">
              <span className="text-4xl">🚬</span>
              <div>
                <h1 className="text-2xl font-semibold text-smoke-slate mb-2">Smoke Check</h1>
                <p className="text-smoke-slate/60 text-sm">A moment of honest awareness.</p>
              </div>
              <p className="text-lg font-medium text-smoke-slate">Did you smoke a cigarette today?</p>
              <div className="flex flex-col gap-3 w-full">
                {["Yes", "No"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSmoked(opt);
                      go(opt === "No" ? "no-reinforce" : "how-many");
                    }}
                    className={`smoke-pill w-full ${
                      smoked === opt ? "smoke-pill-slate-selected" : "smoke-pill-outline"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* YES PATH – Screen 2: How many */}
          {screen === "how-many" && (
            <motion.div key="how-many" {...slide} className="flex flex-col items-center text-center gap-8">
              <p className="text-lg font-medium text-smoke-slate">How many cigarettes did you smoke?</p>
              <div className="flex flex-col gap-3 w-full">
                {countOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setCount(opt);
                      go(storedPackCost ? "financial" : "pack-cost");
                    }}
                    className={`smoke-pill w-full ${
                      count === opt ? "smoke-pill-amber-selected" : "smoke-pill-outline"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* YES PATH – Screen 3: Pack cost (first time only) */}
          {screen === "pack-cost" && (
            <motion.div key="pack-cost" {...slide} className="flex flex-col items-center text-center gap-6">
              <p className="text-lg font-medium text-smoke-slate">What does one pack cost you?</p>
              <input
                type="number"
                inputMode="numeric"
                value={packCost}
                onChange={(e) => setPackCost(e.target.value)}
                placeholder="₹ amount"
                className="smoke-input"
                autoFocus
              />
              <p className="text-smoke-slate/50 text-xs">This helps calculate your spending.</p>
              <button
                onClick={handlePackCostSave}
                disabled={!packCost || parseFloat(packCost) <= 0}
                className="smoke-pill smoke-pill-slate-selected disabled:opacity-40 mt-2"
              >
                Next
              </button>
            </motion.div>
          )}

          {/* YES PATH – Screen 4: Financial awareness */}
          {screen === "financial" && (
            <motion.div key="financial" {...fade} className="flex flex-col items-center text-center gap-5">
              <p className="text-lg font-medium text-smoke-slate">
                You smoked {cigCount() % 1 === 0 ? cigCount() : `~${Math.round(cigCount())}`} cigarette{cigCount() !== 1 ? "s" : ""} today.
              </p>
              <p className="text-2xl font-semibold text-smoke-amber">
                That's approximately ₹{todayCost()} today.
              </p>
              <p className="text-sm text-smoke-slate/60">
                If this continued daily, that's about <span className="font-medium">₹{monthlyCost()}</span> this month.
              </p>
              <p className="text-xs text-smoke-slate/40 italic mt-2">
                Small numbers add up over time.
              </p>
              <button onClick={() => go("feel", 0)} className="smoke-pill smoke-pill-slate-selected mt-4">
                Continue
              </button>
            </motion.div>
          )}

          {/* YES PATH – Screen 5: How do you feel */}
          {screen === "feel" && (
            <motion.div key="feel" {...slide} className="flex flex-col items-center text-center gap-8">
              <p className="text-lg font-medium text-smoke-slate">How do you feel about it now?</p>
              <div className="flex flex-col gap-3 w-full">
                {feelOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setFeeling(opt);
                      go("reflection");
                    }}
                    className={`smoke-pill w-full ${
                      feeling === opt ? "smoke-pill-amber-selected" : "smoke-pill-outline"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* YES PATH – Screen 6: Reflection */}
          {screen === "reflection" && (
            <motion.div key="reflection" {...slide} className="flex flex-col items-center text-center gap-6">
              <p className="text-lg font-medium text-smoke-slate">One small step you can try tomorrow:</p>
              <input
                type="text"
                value={step}
                onChange={(e) => setStep(e.target.value)}
                placeholder="e.g. Wait 10 min before the first one"
                className="smoke-input"
                autoFocus
              />
              <button
                onClick={() => setScreen("done")}
                className="smoke-pill smoke-pill-teal mt-2"
              >
                Save Today
              </button>
            </motion.div>
          )}

          {/* NO PATH – Screen 2A: Reinforcement */}
          {screen === "no-reinforce" && (
            <motion.div key="no-reinforce" {...fade} className="flex flex-col items-center text-center gap-5">
              <h2 className="text-2xl font-semibold text-smoke-slate">You stayed smoke-free today.</h2>
              <p className="text-smoke-slate/60 text-sm">That's real progress.</p>
              <button onClick={() => go("no-savings", 0)} className="smoke-pill smoke-pill-slate-selected mt-4">
                Continue
              </button>
            </motion.div>
          )}

          {/* NO PATH – Screen 3A: Money saved */}
          {screen === "no-savings" && (
            <motion.div key="no-savings" {...fade} className="flex flex-col items-center text-center gap-5">
              {storedPackCost ? (
                <>
                  <p className="text-lg font-medium text-smoke-slate">Today, you saved</p>
                  <p className="text-3xl font-semibold text-smoke-amber">₹{dailySavings()}</p>
                  <p className="text-sm text-smoke-slate/60">
                    If you keep this up, that's about <span className="font-medium">₹{monthlySavings()}</span> this month.
                  </p>
                  <p className="text-xs text-smoke-slate/40 italic">That money stays with you.</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium text-smoke-slate">Every smoke-free day saves money and health.</p>
                  <p className="text-xs text-smoke-slate/40 italic">Complete a "Yes" check-in once to set your pack cost for savings tracking.</p>
                </>
              )}
              <button onClick={() => go("no-close", 0)} className="smoke-pill smoke-pill-teal mt-4">
                Finish Check-In
              </button>
            </motion.div>
          )}

          {/* NO PATH – Final soft close */}
          {screen === "no-close" && (
            <motion.div key="no-close" {...fade} className="flex flex-col items-center text-center gap-5">
              <p className="text-lg font-medium text-smoke-slate">Small daily choices build big change.</p>
              <button onClick={() => setScreen("final-done")} className="smoke-pill smoke-pill-teal mt-4">
                Done
              </button>
            </motion.div>
          )}

          {/* DONE – Checkmark */}
          {(screen === "done" || screen === "final-done") && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-smoke-teal flex items-center justify-center">
                <Check className="w-8 h-8 text-white" />
              </div>
              <p className="text-lg font-medium text-smoke-slate">Saved</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SmokeCheck;
