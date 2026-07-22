/** 技術スタックなどを表す控えめなタグ */
export default function Tag({ children }: { children: string }) {
  return (
    <span className="inline-block rounded-sm border border-line bg-white px-2 py-0.5 text-[11px] text-ink-soft print:border-gray-300 print:px-1.5 print:py-0 print:text-[9px]">
      {children}
    </span>
  );
}
