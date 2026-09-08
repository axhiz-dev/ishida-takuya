/**
 * JS が動いていることを示すフラグ。
 *
 * / と /business は入場アニメーション（base.css の `.enter`）を持つ。
 * JS が死んでいる環境では属性が付かないままになるので、CSS 側が
 * `.no-js` を見て入場を無効化し、中身を必ず見せる。
 *
 * <head> の中で **同期的に** 外すのが肝。React が動くのを待つと
 * 一瞬だけ非表示の状態が描かれる。
 *
 * /engineer はここを使わない。あちらは Tailwind + motion で、
 * 入場は motion 側が持っている。
 */
export const NO_JS_INIT_SCRIPT = `(function(){try{document.documentElement.classList.remove('no-js')}catch(e){}})();`;
