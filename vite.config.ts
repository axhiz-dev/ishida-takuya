import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages (https://<owner>.github.io/ishida-takuya/) 配下で動かすための base 設定
export default defineConfig({
  base: "/ishida-takuya/",
  plugins: [react(), tailwindcss()],
});
