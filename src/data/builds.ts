export const tags = [
  "React",
  "AWS",
  "NestJS",
  "Docker",
  "AI",
  "Mobile",
  "Cloud",
  "Infrastructure",
] as const;

export type Tag = (typeof tags)[number];

export type Build = {
  id: string;
  name: string;
  year: string;
  tagline: string;
  featured?: boolean;
  inProgress?: boolean;
  tags: Tag[];
  stack: string[];
  readme: {
    challenge: string;
    background: string;
    outcome: string;
  };
  architecture: {
    diagram: string;
    stack: string[];
    philosophy: string;
  };
  implementation: {
    scope: string;
    craft: string;
    hardest: string;
  };
  lessons: string[];
  gallery: { file: string; label: string }[];
};

// サンプルデータ。実際の Build 情報に差し替えてください。
export const builds: Build[] = [
  {
    id: "mato-message",
    name: "MatoMessage",
    year: "2024 –",
    tagline: "散らばるメッセージを、ひとつの受信箱に。LLM で要約・分類する統合メッセージング。",
    featured: true,
    inProgress: true,
    tags: ["AI", "React", "AWS"],
    stack: ["Next.js", "TypeScript", "NestJS", "PostgreSQL", "AWS", "LLM / OpenAI"],
    readme: {
      challenge:
        "Slack・メール・チャットツール。連絡手段が増えるほど、大事な連絡は埋もれていく。「全部を見にいく」以外の方法がなかった。",
      background:
        "複数チームを横断して働く中で、自分自身が毎朝5つのツールを巡回していた。これは自分の課題であり、多くの人の課題でもあるはずだと思い、個人プロダクトとして開発を始めた。",
      outcome:
        "複数チャネルのメッセージを1つの受信箱に集約し、LLM が重要度分類と要約を行う。巡回時間は1日30分から5分へ。現在も開発継続中(Progress 95%)。",
    },
    architecture: {
      diagram: `┌─ Slack ─┐ ┌─ Mail ─┐ ┌─ Chat ─┐
└────┬────┘ └───┬────┘ └───┬────┘
     └────── webhooks ──────┘
               │
        Ingest Workers
         (SQS queue)
               │
         LLM Pipeline
     classify / summarize
               │
      PostgreSQL (RLS)
               │
     Next.js — unified inbox`,
      stack: ["Next.js (App Router)", "NestJS", "SQS + Lambda", "PostgreSQL", "OpenAI API"],
      philosophy:
        "「AI は UX の一部」を設計原則に。LLM の処理は非同期パイプラインに隔離し、失敗してもメッセージ自体は必ず届く。AI が落ちても壊れないプロダクトにする。",
    },
    implementation: {
      scope: "個人開発。企画・設計・実装・インフラ・運用まですべて。",
      craft:
        "要約のプロンプトをユーザーごとに学習させる仕組み。既読の傾向から「この人にとっての重要」を推定する。",
      hardest:
        "LLM のレイテンシとコストの制御。全メッセージに LLM をかけるのではなく、ルールベースの事前フィルタで対象を1/10に絞った。",
    },
    lessons: [
      "LLM は同期処理に置かない。UX が壊れる。",
      "「自分が毎日使うもの」を作ると、意思決定が速い。",
    ],
    gallery: [
      { file: "inbox.png", label: "統合受信箱" },
      { file: "summary.png", label: "LLM 要約ビュー" },
      { file: "pipeline.png", label: "処理パイプライン" },
    ],
  },
  {
    id: "streaming-platform",
    name: "Streaming Platform",
    year: "2022 – 2023",
    tagline: "同時視聴 10 万人規模の動画配信基盤。設計から運用まで。",
    featured: true,
    tags: ["AWS", "Cloud", "Infrastructure", "React"],
    stack: ["React", "TypeScript", "Node.js", "AWS", "Terraform", "Docker"],
    readme: {
      challenge:
        "ライブ配信イベントで同時視聴者が急増すると配信が止まる。既存基盤はスパイクに耐えられず、機会損失が発生していた。",
      background:
        "事業拡大に伴い、配信品質がそのまま売上に直結するフェーズに。リードエンジニアとして配信基盤の再設計を任された。",
      outcome:
        "HLS + CloudFront ベースの配信基盤に刷新。同時視聴 10 万人のイベントを無停止で完走。インフラコストは従来比 40% 削減。",
    },
    architecture: {
      diagram: `Uploader ──▶ S3 ──▶ MediaConvert
                       │
                  HLS segments
                       │
                  CloudFront
                       │
        ┌──────────────┴─────────────┐
   React Player                 API (ECS)
   (viewers)                (auth / analytics)`,
      stack: ["S3 + MediaConvert", "CloudFront", "ECS Fargate", "Terraform", "React Player"],
      philosophy:
        "スパイクは予測せず、吸収する。オリジンに負荷を残さない構成にし、スケールの判断をインフラに委ねる。IaC で環境差分をゼロに。",
    },
    implementation: {
      scope: "リードエンジニア。アーキテクチャ設計、IaC、プレイヤー実装レビュー、負荷試験。",
      craft:
        "本番同等の負荷試験環境を Terraform で 10 分で立ち上げられるようにし、リリース前に毎回スパイク試験を実施。",
      hardest:
        "配信遅延とコストのトレードオフ。セグメント長のチューニングを重ね、遅延 8 秒・コスト 40% 減の着地点を見つけた。",
    },
    lessons: [
      "負荷試験は「できる状態」を作った時点で 8 割勝ち。",
      "インフラの設計思想はコードより長生きする。",
    ],
    gallery: [
      { file: "player.png", label: "配信プレイヤー" },
      { file: "dashboard.png", label: "同時視聴ダッシュボード" },
      { file: "infra.png", label: "インフラ構成図" },
    ],
  },
  {
    id: "realtime-chat",
    name: "Realtime Chat",
    year: "2021",
    tagline: "WebSocket ベースのリアルタイムチャット。既読・入力中表示まで。",
    tags: ["React", "NestJS", "Docker"],
    stack: ["React", "TypeScript", "NestJS", "PostgreSQL", "Docker"],
    readme: {
      challenge: "社内ツールに散らばる会話を、1つのリアルタイムチャットへ。",
      background: "初めて WebSocket を本番で扱ったプロジェクト。",
      outcome: "社内 200 名が日常利用。メール往復が体感半分に。",
    },
    architecture: {
      diagram: `React ⇄ WebSocket Gateway (NestJS)
              │
        Redis pub/sub
              │
         PostgreSQL`,
      stack: ["NestJS Gateway", "Redis", "PostgreSQL"],
      philosophy: "接続状態を信用しない。切断・再接続を前提にしたイベント設計。",
    },
    implementation: {
      scope: "バックエンド全般とフロントの状態管理。",
      craft: "メッセージの楽観的 UI 更新と、失敗時のロールバック。",
      hardest: "既読管理のデータモデル。イベントソーシング的に解決。",
    },
    lessons: ["リアルタイムは「失敗した時の見え方」の設計が本体。"],
    gallery: [{ file: "chat.png", label: "チャット画面" }],
  },
  {
    id: "ec-replatform",
    name: "EC Replatform",
    year: "2022",
    tagline: "モノリス EC サイトの AWS 移行。ゼロダウンタイムで。",
    tags: ["AWS", "Cloud", "Infrastructure"],
    stack: ["Node.js", "AWS", "Terraform", "Docker", "PostgreSQL"],
    readme: {
      challenge: "オンプレのモノリス EC。デプロイは月1回、深夜メンテ付き。",
      background: "事業成長にリリース速度が追いつかなくなっていた。",
      outcome: "ECS ベースへ移行し、デプロイは1日数回・無停止に。",
    },
    architecture: {
      diagram: `ALB ─▶ ECS (blue/green)
        │
   RDS PostgreSQL
        │
   ElastiCache`,
      stack: ["ECS Fargate", "RDS", "CodeDeploy", "Terraform"],
      philosophy: "ビッグバン移行はしない。ストラングラーパターンで段階移行。",
    },
    implementation: {
      scope: "移行計画の策定とインフラ実装。",
      craft: "DB 移行は CDC でレプリケーションし、切替は DNS のみに。",
      hardest: "レガシーコードの暗黙依存の洗い出し。",
    },
    lessons: ["移行の本体は技術ではなく、切り戻し計画。"],
    gallery: [{ file: "migration.png", label: "移行フェーズ図" }],
  },
  {
    id: "habit-tracker",
    name: "Habit Tracker",
    year: "2020",
    tagline: "続けることを助ける、React Native の習慣化アプリ。",
    tags: ["Mobile", "React"],
    stack: ["React Native", "TypeScript", "GraphQL"],
    readme: {
      challenge: "三日坊主の自分のための、記録が 3 秒で終わるアプリ。",
      background: "初めてのモバイル開発。ストア公開まで一人で。",
      outcome: "ストア公開、DAU 500。自分は 2 年続いた。",
    },
    architecture: {
      diagram: `React Native ─▶ GraphQL API
                    │
                SQLite (offline-first)`,
      stack: ["React Native", "GraphQL", "SQLite"],
      philosophy: "オフラインファースト。記録は絶対に失わない。",
    },
    implementation: {
      scope: "個人開発。デザインから申請まで。",
      craft: "ホーム画面ウィジェットからの 1 タップ記録。",
      hardest: "iOS / Android 両対応の通知まわり。",
    },
    lessons: ["モバイルは「開くまでの摩擦」がすべて。"],
    gallery: [{ file: "app.png", label: "アプリ画面" }],
  },
  {
    id: "cicd-pipeline",
    name: "CI/CD Pipeline",
    year: "2022",
    tagline: "テスト 40 分 → 8 分。開発チームのためのパイプライン刷新。",
    tags: ["Docker", "Infrastructure"],
    stack: ["Docker", "AWS", "Node.js"],
    readme: {
      challenge: "CI に 40 分。レビューよりも待ち時間が長い開発体験。",
      background: "チーム全員の 1 日を数十分ずつ奪っていた。",
      outcome: "並列化とキャッシュ設計で 8 分に短縮。デプロイ頻度 3 倍。",
    },
    architecture: {
      diagram: `push ─▶ lint / typecheck / test (parallel)
         │
     build (layer cache)
         │
     deploy (blue/green)`,
      stack: ["GitHub Actions", "Docker BuildKit", "ECR"],
      philosophy: "CI は開発体験の一部。速度は機能。",
    },
    implementation: {
      scope: "パイプライン設計と Docker イメージの最適化。",
      craft: "テスト分割の自動バランシング。",
      hardest: "flaky テストの撲滅。速度より先にこれだった。",
    },
    lessons: ["遅い CI は、静かにチームの文化を壊す。"],
    gallery: [{ file: "pipeline.png", label: "パイプライン構成" }],
  },
  {
    id: "ai-review-bot",
    name: "AI Review Bot",
    year: "2024",
    tagline: "PR の一次レビューを LLM に。人間はより本質的な議論へ。",
    tags: ["AI", "Docker"],
    stack: ["TypeScript", "Node.js", "LLM / OpenAI", "Docker"],
    readme: {
      challenge: "レビュー待ちが開発のボトルネック。単純な指摘に人間の時間が溶ける。",
      background: "LLM をチームの開発フローに組み込む最初の実験として。",
      outcome: "命名・型・スタイルの指摘を自動化。人間のレビューは設計の議論に集中。",
    },
    architecture: {
      diagram: `PR webhook ─▶ diff extractor
              │
        LLM (structured output)
              │
        review comments API`,
      stack: ["GitHub Webhooks", "OpenAI API", "Docker"],
      philosophy: "AI の指摘は「提案」の口調に。裁くのは人間。",
    },
    implementation: {
      scope: "個人発案でプロトタイプ → チーム導入まで。",
      craft: "指摘の確信度スコアで閾値を切り、ノイズを抑制。",
      hardest: "「うるさくない」チューニング。精度より体験。",
    },
    lessons: ["AI ツールの成否は精度ではなく、信頼の設計で決まる。"],
    gallery: [{ file: "review.png", label: "レビューコメント例" }],
  },
  {
    id: "design-system",
    name: "Design System",
    year: "2023",
    tagline: "3 プロダクト横断のコンポーネントライブラリと設計原則。",
    tags: ["React"],
    stack: ["React", "TypeScript", "Next.js"],
    readme: {
      challenge: "プロダクトごとに微妙に違うボタン。UI の負債が増殖していた。",
      background: "デザイナーと二人三脚で、コードとデザインの共通言語を作る。",
      outcome: "40 コンポーネントを 3 プロダクトへ展開。UI 実装速度 2 倍。",
    },
    architecture: {
      diagram: `tokens (JSON)
   │
components (React)
   │
Storybook ─▶ 3 products`,
      stack: ["Design Tokens", "Storybook", "Changesets"],
      philosophy: "コンポーネントは削れるところまで削る。拡張はコンポジションで。",
    },
    implementation: {
      scope: "設計・実装・ドキュメント・普及活動。",
      craft: "破壊的変更を semver + codemod で安全に配布。",
      hardest: "「便利な独自実装」を捨ててもらう合意形成。",
    },
    lessons: ["デザインシステムは技術ではなく、コミュニケーションの仕組み。"],
    gallery: [{ file: "storybook.png", label: "Storybook" }],
  },
  {
    id: "iot-dashboard",
    name: "IoT Dashboard",
    year: "2021",
    tagline: "工場センサー 3,000 台のリアルタイム可視化。",
    tags: ["Cloud", "React", "AWS"],
    stack: ["React", "TypeScript", "AWS", "Node.js"],
    readme: {
      challenge: "現場の異常に気づくのが、いつも「翌朝」だった。",
      background: "製造業クライアントの DX 案件。初の IoT 領域。",
      outcome: "異常検知から通知まで 30 秒以内に。夜間の障害対応が半減。",
    },
    architecture: {
      diagram: `sensors ─▶ IoT Core ─▶ Kinesis
                     │
               Lambda (rules)
                     │
          TimeStream ─▶ React dashboard`,
      stack: ["AWS IoT Core", "Kinesis", "TimeStream"],
      philosophy: "時系列データは書き込み最適で設計し、読み出しは集約層で守る。",
    },
    implementation: {
      scope: "データパイプラインとダッシュボード実装。",
      craft: "グラフ描画の間引きアルゴリズムで 3,000 系列を 60fps 表示。",
      hardest: "現場ネットワークの不安定さ。バッファリング設計で吸収。",
    },
    lessons: ["データの鮮度は、それだけで価値になる。"],
    gallery: [{ file: "dashboard.png", label: "ダッシュボード" }],
  },
  {
    id: "build-log",
    name: "Build Log",
    year: "2026",
    tagline: "いま見ているこのサイト。職務経歴書ではなく、作品として。",
    tags: ["React"],
    stack: ["Next.js", "TypeScript", "React"],
    readme: {
      challenge: "職務経歴書は、読み終わっても人が見えない。",
      background: "「一人のエンジニアの人生を、一つのデスクトップアプリとして開けたら」という思いつきから。",
      outcome: "あなたが今、触っているものがその成果です。",
    },
    architecture: {
      diagram: `Next.js (App Router)
   │
Framer Motion + Lenis
   │
you, scrolling`,
      stack: ["Next.js", "TailwindCSS", "Framer Motion"],
      philosophy: "派手にしない。Fade と余白と、少しの遊びだけ。",
    },
    implementation: {
      scope: "すべて。コンセプトからイースターエッグまで。",
      craft: "Ctrl+K を押してみてください。あと、コンソールも。",
      hardest: "「入れない」判断。演出は足すより引く方が難しい。",
    },
    lessons: ["自分を伝えるものこそ、一番丁寧に作る。"],
    gallery: [{ file: "recursive.png", label: "このサイトのスクリーンショット(再帰)" }],
  },
];

export const orderedBuilds: Build[] = [
  ...builds.filter((b) => b.featured),
  ...builds.filter((b) => !b.featured),
];

export const featuredBuilds = builds.filter((b) => b.featured);

// Current Build セクション用
export const currentBuild = {
  buildId: "mato-message",
  name: "MatoMessage",
  chips: ["LLM", "Workflow", "Automation"],
  progress: 95,
};
