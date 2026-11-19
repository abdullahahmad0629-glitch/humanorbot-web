# humanorbot-web

A simple React page for **humanorbot**: paste a text, choose the base or the fine-tuned model, and see how likely the text is to be AI-generated.

Live page: https://abdullahahmad0629-glitch.github.io/humanorbot-web/

- **Model:** Qwen2.5-1.5B-Instruct, as the base model (zero-shot) and fine-tuned with LoRA.
- **Model server:** runs on a free Kaggle GPU and is reached through a free Cloudflare quick tunnel. It stops by itself after 20 minutes without requests, or after 90 minutes in total.
- **Hosting:** GitHub Pages, built automatically by `.github/workflows/deploy.yml` on every push to `main`.

## Using it

1. On Kaggle, run the `humanorbot-api` notebook with **Save Version → Save & Run All** (GPU T4, Internet on, the `humanorbot` notebook added as input).
2. Open the version's log; after 2–3 minutes it prints `API ADDRESS: https://....trycloudflare.com`.
3. Paste that address into **Model server address** on the page (it is remembered in your browser), or share a link like `https://abdullahahmad0629-glitch.github.io/humanorbot-web/?api=https://....trycloudflare.com`.

## Run the page locally

```
npm install
npm run dev
```

Team: Abdullah Ahmad, Eshaal Yasir
