import { useState } from "react";

// The model server runs on Kaggle and gets a new address each time it starts,
// so the address is typed in on the page (or given as ?api=... in the link)
// and remembered in this browser.
function loadApiUrl() {
  try {
    return new URLSearchParams(window.location.search).get("api") ||
      localStorage.getItem("humanorbot_api") || "";
  } catch {
    return "";
  }
}

const MODELS = {
  finetuned: "Fine-tuned (Qwen2.5-1.5B + LoRA)",
  base: "Base (Qwen2.5-1.5B, no training)",
};

export default function App() {
  const [apiUrl, setApiUrl] = useState(loadApiUrl);
  const [model, setModel] = useState("finetuned");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function changeApiUrl(value) {
    setApiUrl(value);
    try {
      localStorage.setItem("humanorbot_api", value);
    } catch {
      // storage not available: the address just isn't remembered
    }
  }

  async function checkText() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const base = apiUrl.trim().replace(/\/+$/, "");   // remove a trailing slash
      const response = await fetch(`${base}/predict`, {
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
        "Couldn't reach the model server. Check the address, and that the Kaggle server " +
          "is still running (it stops after 20 minutes without use). (" + err.message + ")"
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

      <label htmlFor="api">Model server address</label>
      <input
        id="api"
        type="url"
        placeholder="https://....trycloudflare.com"
        value={apiUrl}
        onChange={(e) => changeApiUrl(e.target.value)}
      />
      <p className="hint">Start the server on Kaggle and paste the address it prints.</p>

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

      <button onClick={checkText} disabled={loading || text.trim() === "" || apiUrl.trim() === ""}>
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
