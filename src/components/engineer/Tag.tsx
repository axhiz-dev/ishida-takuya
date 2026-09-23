/** 技術スタックを表す控えめなタグ */
export function Tag({ children }: { children: string }) {
  return (
    <span className="inline-block rounded-sm border border-line bg-white px-2 py-0.5 text-[11px] text-ink-soft">
      {children}
    </span>
  );
}
