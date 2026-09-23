"use client";

function PrinterIcon({ size }: { size: number }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

/**
 * ブラウザの印刷ダイアログ（PDF に保存）を開くボタン。
 * "header" はナビの右端に置く小さい版、"footer" はページ末尾に置く大きい版。
 */
export function PrintButton({ variant }: { variant: "header" | "footer" }) {
  if (variant === "header") {
    return (
      <button
        type="button"
        onClick={() => window.print()}
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-accent px-3 py-1 text-xs font-semibold whitespace-nowrap text-accent transition-colors hover:bg-accent hover:text-white"
      >
        <PrinterIcon size={12} />
        PDF出力
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <PrinterIcon size={14} />
      この職務経歴書をPDFで保存
    </button>
  );
}
