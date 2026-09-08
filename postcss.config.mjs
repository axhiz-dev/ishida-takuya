/**
 * Tailwind v4 は /engineer だけで使う。
 *
 * このプラグインが変換するのは `@import "tailwindcss"` を含む
 * スタイルシート（src/styles/engineer.css）だけで、
 * ほかの CSS Modules（/ と /business）はそのまま素通りする。
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
