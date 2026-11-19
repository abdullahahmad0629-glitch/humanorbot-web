import { useState } from "react";

// Address of our model API (the Hugging Face Space).
const API_URL = "https://YOUR-HF-USERNAME-humanorbot.hf.space";

const MODELS = {
  finetuned: "Fine-tuned (Qwen2.5-1.5B + LoRA)",
  base: "Base (Qwen2.5-1.5B, no training)",
};

export default function App() {
  const [model, setModel] = useState("finetuned");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkText() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, model }),
      });
      if (!response.ok) {
        throw new Error(`server answered ${response.status}`);
      }
      setResult(await response.json());
    } catch (err) {
      setError(
        "Couldn't reach the model. If it hasn't been used for a while it is waking up: " +
          "wait a minute and try again. (" + err.message + ")"
      );
    }
    setLoading(false);
  }

  const percent = result ? Math.round(result.ai_probability * 100) : 0;
  const isAI = result && result.label === "ai";

  return (
    <main className="page">
      <h1>humanorbot</h1>
      <p className="intro">
        Paste a piece of text to see how likely it is to be AI-generated.
      </p>

      <label htmlFor="model">Model</label>
      <select id="model" value={model} onChange={(e) => setModel(e.target.value)}>
        {Object.entries(MODELS).map(([value, name]) => (
          <option key={value} value={value}>
            {name}
          </option>
        ))}
      </select>

      <label htmlFor="text">Text</label>
      <textarea
        id="text"
        rows={10}
        placeholder="Paste a paragraph or an essay here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={checkText} disabled={loading || text.trim() === ""}>
        {loading ? "Checking..." : "Check text"}
      </button>

      {error && <p className="error">{error}</p>}

      {result && (
        <section className={isAI ? "result ai" : "result human"}>
          <p className="label">{isAI ? "Likely AI-generated" : "Likely human-written"}</p>
          <p className="score">{percent}% chance of AI</p>
          <div className="bar">
            <div className="fill" style={{ width: `${percent}%` }} />
          </div>
          <p className="note">Model: {MODELS[result.model]}</p>
        </section>
      )}

      <footer>
        Course project by Abdullah Ahmad and Eshaal Yasir. Detection is never certain: use the
        score as a hint, not proof.
      </footer>
    </main>
  );
}
