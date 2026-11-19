# humanorbot-web

A simple React page for **humanorbot**: paste a text, choose the base or the fine-tuned model, and see how likely the text is to be AI-generated.

- **Model:** Qwen2.5-1.5B-Instruct, as the base model (zero-shot) and fine-tuned with LoRA.
- **API:** a Hugging Face Space (`POST /predict`). Its address is set in `src/App.jsx` (`API_URL`).
- **Hosting:** GitHub Pages, built automatically by `.github/workflows/deploy.yml` on every push to `main`.

## Run locally

```
npm install
npm run dev
```

The model runs on a free CPU, so a prediction takes a few seconds. After a long idle period the first request can take a minute or two while the Space wakes up.

Team: Abdullah Ahmad, Eshaal Yasir
