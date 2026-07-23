export type JourneyNode = {
  label: string;
  note: string;
};

// 一本の線。クリックで note が開く。
export const journeyNodes: JourneyNode[] = [
  {
    label: "HTML",
    note: "すべてはここから。自分の書いた1枚のページがブラウザに表示された日の感動。",
  },
  {
    label: "React",
    note: "UI が「状態」になった。作れるものの幅が一気に広がった。",
  },
  {
    label: "Backend",
    note: "画面の裏側へ。データモデリングと API 設計の面白さを知る。",
  },
  {
    label: "Cloud",
    note: "作るだけでなく、動かし続けるための技術。AWS と運用の世界。",
  },
  {
    label: "Architecture",
    note: "1人で書くコードから、チームで育てる設計へ。判断の質が仕事になった。",
  },
  {
    label: "AI",
    note: "LLM を UX に組み込む。プロダクトづくりの前提が変わった。",
  },
  {
    label: "???",
    note: "次の commit はまだ書かれていない。",
  },
];
