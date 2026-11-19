import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// "base" must match the GitHub repo name, because GitHub Pages serves the
// site at https://<user>.github.io/humanorbot-web/
export default defineConfig({
  plugins: [react()],
  base: "/humanorbot-web/",
});
