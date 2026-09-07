/**
 * Blob をファイルとして保存させる。
 *
 * 注意点が 2 つあり、どちらも踏むと「ファイル名が download になる」
 * 「中身が空になる」という形で出る。
 *
 *   · アンカーは document に入れてからクリックする。
 *     切り離したままだと download 属性が無視されることがある。
 *   · revokeObjectURL はすぐ呼ばない。ブラウザが読み終える前に
 *     破棄すると保存が落ちる。1 フレーム待ってから捨てる。
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.append(anchor);
  anchor.click();

  setTimeout(() => {
    anchor.remove();
    URL.revokeObjectURL(url);
  }, 0);
}
