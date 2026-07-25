/**
 * /engineer のダーク / ライト切り替え。
 *
 * 挙動：
 *   · 初回はダーク。このページはダークの見え方そのものが作品なので、
 *     OS のライト設定に合わせて既定を変えると設計意図が隠れてしまう
 *   · 一度でも切り替えたら、その選択を localStorage に記憶して以後は必ず従う
 *   · リロード時にチラつかせない
 *
 * チラつき対策が肝。React が動くのを待って属性を付けると、
 * 一瞬だけ既定テーマが描かれてから切り替わる（いわゆる FOUC）。
 * それを避けるため、<head> の中で **同期的に** 属性を確定させる。
 */

export const THEME_STORAGE_KEY = "ishida-takuya:engineer-theme";

export type EngineerTheme = "dark" | "light";

export const engineerThemeAttr = (theme: EngineerTheme) => `engineer-${theme}` as const;

/**
 * <head> にそのまま置く同期スクリプト。
 *
 * · document.write も外部リクエストも使わないので描画をブロックしない
 * · localStorage が使えない環境（プライベートモード等）でも例外で止まらない
 * · あわせて no-js クラスを外す。JS が死んでいる場合は
 *   CSS 側が入場アニメーションを無効化して内容を必ず見せる
 */
export const THEME_INIT_SCRIPT = `(function(){try{
var d=document.documentElement;
d.classList.remove('no-js');
var s=localStorage.getItem('${THEME_STORAGE_KEY}');
var t=(s==='light'||s==='dark')?s:'dark';
d.dataset.theme='engineer-'+t;
}catch(e){}})();`;

/** /engineer 以外のページ用（テーマ固定・no-js の解除だけ） */
export const NO_JS_INIT_SCRIPT = `(function(){try{document.documentElement.classList.remove('no-js')}catch(e){}})();`;
