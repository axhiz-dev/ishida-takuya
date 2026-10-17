# 支援の進め方・4コマ

- 用途：相談から利用開始までの4段階に、同じ順序で対応させる漫画。
- 生成日：2026-10-18（日本時間）
- 生成方法：組み込みImageGen。CLI/APIの代替生成は未使用。
- スタイル参照：`public/images/business/work-comic.png`。既存のキャラクター、線、色味を継承。
- 画像：`support-process.webp`。1254×1254、2×2の4コマ。生成原本と同じ解像度でWebPに変換（品質90）。スクリーンショットや低解像度の切り抜きから再生成していない。
- 表示：各段階で元画像の対応する四分区画をCSSで表示。左上＝相談、右上＝提案、左下＝見本確認、右下＝運用改善。
- 人物写真：参考スクリーンショットの人物写真は使用していない。本人写真の設定先は従来どおり `profile.photo`。

## 生成プロンプト

Create ONE production website comic illustration asset, a clean 2-by-2 grid of FOUR equal square comic frames, 2048x2048 overall. Reference image is STYLE AND CHARACTER REFERENCE ONLY. Match its cute white rounded ghost-like office characters, dark forest green hand-drawn outlines, muted sage and beige office palette, soft textured 2D drawing, professional gentle Japanese website feeling. Keep exactly four frames with boundaries exactly at 50% horizontal and vertical so each quadrant can be displayed independently in a website alongside HTML text. No outer headings, NO LETTERING, NO WORDS, NO SPEECH BUBBLES, no logos, no numbers. Each quadrant is a full scene with safe interior padding, thin sage rounded panel border. TOP LEFT: free initial consultation, one friendly white ghost support person attentively listening to the white ghost business worker across a small desk with a laptop and a few papers, warm relaxed expressions. TOP RIGHT: proposal and fee agreement, the same two characters reviewing one simple proposal sheet together, pointing to its check marks and simple small blocks, calm agreement, no money symbols. BOTTOM LEFT: making a sample and checking it together, both characters at laptop with the small round AI companion from the reference, they inspect a simple spreadsheet mock with check marks, no text. BOTTOM RIGHT: ongoing use and improvement, the business worker comfortably using laptop with a neatly organized desk and small plant, support person alongside points at a small adjustment on the screen and the AI companion waves, satisfied relaxed mood. Consistent character identities, proportions, background density and framing across all four scenes. The asset will be used at 200-260px square per scene, so keep forms and gestures clear, no tiny details. Original full-resolution asset, not screenshot or page mockup.
