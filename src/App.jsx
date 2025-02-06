import { useState } from "react";
import Timer from "./components/Timer";
import Settings from "./components/Settings";

export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [shouldReset, setShouldReset] = useState(false);

  const handleSave = (newDuration) => {
    // Update localStorage
    const currentState = JSON.parse(localStorage.getItem("timerState") || "{}");
    const newState = {
      ...currentState,
      duration: newDuration,
      timeLeft: newDuration * 60,
      isRunning: false, // Stop the timer after reset
    };
    localStorage.setItem("timerState", JSON.stringify(newState));

    // Force timer reset
    setTimerKey((prev) => prev + 1);
    setShowSettings(false);
  };

  return (
    <div className="app">
      <nav>
        <button onClick={() => setShowSettings(!showSettings)}>
          {showSettings ? "Back to Timer" : "Settings"}
        </button>
      </nav>

      <div style={{ display: showSettings ? "none" : "block" }}>
        <Timer key={timerKey} />
      </div>

      {showSettings && <Settings onSave={handleSave} />}
    </div>
  );
}
