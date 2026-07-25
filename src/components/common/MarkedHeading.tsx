import type { MarkedText } from "@/content/types";

/**
 * 見出しの中の 1 語だけ背後に色帯を敷く。
 *
 * 帯は x-height の背後に置く（baseline に置くと太い下線に見える）。
 * 位置の指定は base.css の .mark にある。
 *
 * mark が text に含まれない場合は、帯なしでそのまま出す。
 * content 側に何を書いても表示が壊れない、というのがこの関数の契約。
 */
export function MarkedHeading({ value, className }: { value: MarkedText; className?: string }) {
  const index = value.mark ? value.text.indexOf(value.mark) : -1;

  if (index < 0) {
    return <span className={className}>{value.text}</span>;
  }

  return (
    <span className={className}>
      {value.text.slice(0, index)}
      <span className="mark">{value.mark}</span>
      {value.text.slice(index + value.mark.length)}
    </span>
  );
}
