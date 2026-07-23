export function BlinkingCursor({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`cursor-blink text-accent ${className}`}>
      _
    </span>
  );
}
