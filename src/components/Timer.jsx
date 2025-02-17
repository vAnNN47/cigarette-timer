import { useState, useEffect, useRef } from "react";

export default function Timer() {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem("timerState");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.isRunning) {
        const elapsed = Math.floor((Date.now() - parsed.lastUpdated) / 1000);
        return {
          ...parsed,
          timeLeft: Math.max(0, parsed.timeLeft - elapsed),
          isRunning: parsed.timeLeft - elapsed > 0,
          lastUpdated: Date.now(),
        };
      }
      return parsed;
    }
    return {
      timeLeft: 25 * 60,
      isRunning: false,
      duration: 25,
      lastUpdated: Date.now(),
    };
  });

  const intervalRef = useRef(null);

  useEffect(() => {
    const stateToSave = {
      ...state,
      lastUpdated: Date.now(),
    };
    localStorage.setItem("timerState", JSON.stringify(stateToSave));
  }, [state]);

  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.timeLeft <= 0) {
            clearInterval(intervalRef.current);
            return {
              ...prev,
              isRunning: false,
              timeLeft: prev.duration * 60, // Reset to original duration
            };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [state.isRunning]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && state.isRunning) {
        const elapsed = Math.floor((Date.now() - state.lastUpdated) / 1000);
        setState((prev) => ({
          ...prev,
          timeLeft: Math.max(0, prev.timeLeft - elapsed),
          isRunning: prev.timeLeft - elapsed > 0,
          lastUpdated: Date.now(),
        }));
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [state.isRunning, state.lastUpdated]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress =
    ((state.duration * 60 - state.timeLeft) / (state.duration * 60)) * 100;

  return (
    <div className="timer">
      <div className="circle-container">
        <svg width="300" height="300">
          <circle className="background" cx="150" cy="150" r="140" />
          <circle
            className="progress"
            cx="150"
            cy="150"
            r="140"
            style={{
              strokeDasharray: `${(progress / 100) * 879} 879`,
            }}
          />
        </svg>
        <div className={`time ${state.timeLeft === 0 ? "complete" : ""}`}>
          {formatTime(
            state.timeLeft === 0 ? state.duration * 60 : state.timeLeft
          )}
        </div>
      </div>
      <div className="controls">
        <button
          onClick={() =>
            setState((prev) => ({
              ...prev,
              isRunning: !prev.isRunning,
              lastUpdated: Date.now(),
            }))
          }
        >
          {state.isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={() =>
            setState({
              timeLeft: state.duration * 60,
              isRunning: false,
              duration: state.duration,
              lastUpdated: Date.now(),
            })
          }
        >
          Reset
        </button>
      </div>
    </div>
  );
}
