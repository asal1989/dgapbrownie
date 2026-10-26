import { useEffect, useState } from "react";
import { api } from "../api.js";

const INTERVAL = 6000;

const currentSlot = () => {
  const h = new Date().getHours();
  return h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
};

export default function MantraBox() {
  const [all, setAll] = useState([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => { api("/mantras").then(setAll).catch(() => {}); }, []);

  // Prefer mantras for the current time of day, plus the ones for any time.
  const slot = currentSlot();
  const list = all.filter((m) => m.slot === slot || m.slot === "any");
  const shown = list.length ? list : all;

  const go = (i) => {
    setFading(true);
    setTimeout(() => { setIndex((i + shown.length) % shown.length); setFading(false); }, 350);
  };

  useEffect(() => {
    if (!playing || shown.length < 2) return;
    const t = setTimeout(() => go(index + 1), INTERVAL);
    return () => clearTimeout(t);
  });

  if (!shown.length) return null;
  const m = shown[index % shown.length];

  return (
    <section className="mantra-box" aria-live="polite">
      <div className="mantra-label">Today's Mantra</div>
      <div className={`mantra${fading ? " fade" : ""}`}>
        <div className="mantra-text">{m.text}</div>
        {m.meaning && <div className="mantra-meaning">{m.meaning}</div>}
      </div>
      {shown.length > 1 && (
        <div className="mantra-controls">
          <button onClick={() => go(index - 1)} aria-label="Previous mantra">←</button>
          <button onClick={() => setPlaying(!playing)}>{playing ? "Pause" : "Play"}</button>
          <button onClick={() => go(index + 1)} aria-label="Next mantra">→</button>
        </div>
      )}
    </section>
  );
}
