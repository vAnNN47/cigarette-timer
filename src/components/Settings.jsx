import { useState, useEffect } from "react";

export default function Settings({ onSave }) {
  const [duration, setDuration] = useState(() => {
    const saved = localStorage.getItem("timerState");
    return saved ? JSON.parse(saved).duration : 25;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDuration = Math.max(1, Math.min(120, duration));
    onSave(newDuration);
  };

  return (
    <div className="settings">
      <h2>Settings</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Timer Duration (minutes):
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="1"
            max="120"
          />
        </label>
        <button type="submit">Save & Reset Timer</button>
      </form>
    </div>
  );
}
