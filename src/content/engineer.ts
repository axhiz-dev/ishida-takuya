import type { Period } from "./types";

/**
 * /engineer（職務経歴書）の中身。入口ページ（/）の年数とスキル表示もここから出す。
 *
 * 氏名・メール・リンク・最終更新日はサイト全体で 1 つ（./profile.ts）を使う。
 * ここに置くのは職務経歴書にしか出ない原稿だけ。
 *
 * 在籍期間は from / to（"YYYY-MM"）で持ち、画面に出る
 * 「2022.01 – 2025.03」は lib/derive.ts で組み立てる。
 * 年収・希望条件などの待遇情報はこのサイトには載せない。
 */

/* ────────────────────────────── ヘッダ ── */

export const engineerHero = {
  role: "プロダクトエンジニア",
} as const;

/**
 * 職務要約。段落ごとに配列の 1 要素。
 *
 * `{years}` は通算年数（engineerCareer の在籍期間から計算）に置き換わる。
 * 年数を手で書くと、日付が進んだときに入口ページの年数とずれるため。
 */
export const engineerSummary: string[] = [
  "エンジニア歴{years}年のプロダクトエンジニアです。受託開発・自社SaaS・副業を通じて、React / TypeScript / Go を中心に、フロントエンドからバックエンド、インフラまで領域を問わず実装してきました。",
  "現職の株式会社HRBrainでは人事データ活用SaaSを担当し、仕様が固まっていない要求を論点に分解し、フルスタックで実装し、本番リリースまで仕切る役割を担っています。主力機能「クロス集計」の案件オーナーや、4万人規模テナントの日次バッチ改善（約2時間 → 約1分）を経て、2026年7月からはユニットリーダー・技術リードとして、プロダクト統合の技術方針とAI前提の開発プロセス設計を担当しています。",
  "前職までは受託開発でPMとエンジニアを兼ね、要件定義・顧客折衝からインフラ構築まで一気通貫で担ってきました。新卒で入社したDELLでのインサイドセールス経験から、機能を考える起点は常に「売りにつながるか／解約を止めるか」に置いています。",
  "AIは、プロダクトと開発現場の両方に安全に組み込むことをテーマにしています。社内向けSlack MCPサーバーの自作・展開、Claude Code の社内推進に加え、個人開発サービス「LiveDriver」ではローンチからマーケティング・営業まで自ら行っています。",
];

/** 経歴書の外部リンク。profile.ts のリンクとは別に、経歴書に載せたいものだけ。 */
export const engineerLinks = [
  // TODO: GitHub アカウントの URL をご自身のものに変更してください
  { label: "GitHub", href: "https://github.com/axhiz-dev" },
  { label: "LiveDriver（個人開発）", href: "https://livedriver.app" },
];

/* ────────────────────────────── 現職での取り組み ── */

/** 取り組みの図で使うアイコン。本文・図の文言はこのファイルに集約する。 */
export type InitiativeStoryIcon =
  | "users" | "support" | "calendar" | "list" | "tree" | "settings"
  | "document" | "target" | "code" | "test" | "shield" | "install"
  | "lightbulb" | "chart" | "checks" | "workflow";

export type InitiativeStoryNode = {
  icon: InitiativeStoryIcon;
  title: string;
  note: string;
};

export type InitiativeStoryData = {
  intro: string;
  inputTitle: string;
  inputs: InitiativeStoryNode[];
  processTitle: string;
  steps: InitiativeStoryNode[];
  outcomeTitle: string;
  outcome: InitiativeStoryNode;
  contribution: string;
};

/** 現職の取り組み。画面は図、紙版は状況・行動・結果の文章で説明する。 */
export type NowInitiative = {
  /** カルーセルのタブに出る短い名前。 */
  tab: string;
  title: string;
  /** 「案件オーナー」など、この件での立場。 */
  role: string;
  period: Period;
  /** "ongoing" は進行中。画面では緑の印、紙版では「現在」の見出しが付く。 */
  status: "released" | "ongoing";
  situation: string;
  action: string;
  /** released なら結果、ongoing ならいまの状況。 */
  outcome: string;
  tech: string[];
  story: InitiativeStoryData;
};

export type EngineerNow = {
  company: string;
  period: Period;
  /** 大きく出す主張。行ごとに配列の 1 要素（和文は自動改行に任せると変な位置で折れる）。 */
  thesis: string[];
  description: string;
  role: string;
  team: string;
  initiatives: NowInitiative[];
};

export const engineerNow: EngineerNow = {
  company: "株式会社HRBrain",
  period: { from: "2025-04", to: "present" },
  thesis: ["顧客価値を最速で提供するために、", "必要なことをすべてやります。"],
  description:
    "人事データ活用SaaSで、顧客の業務や使い勝手を踏まえた仕様検討から、Go・Reactでの実装、リリース判断までを担当。セールス・CS・PdMに加え、共通基盤を担う他チームとも協議し、顧客価値・性能・運用コストのバランスを取っています。ユニットリーダー任命後は、AI駆動開発のスキル整備やE2Eテストの拡充を行い、より早く顧客価値を提供するための施策を実行しています。",
  role: "プロダクトエンジニア → 2026.07〜 ユニットリーダー",
  team: "グラフパーツ開発：エンジニア4名／QA2名／PdM・テックリード各1名",
  initiatives: [
    {
      tab: "グラフパーツ",
      title: "顧客の業務と開発の実現性から、移行仕様を決める",
      role: "仕様整理・合意形成・フルスタック開発",
      // 開始月は本人の記憶に基づく概算（2026年4月頃）。
      period: { from: "2026-04", to: "present" },
      status: "ongoing",
      situation: "既存ダッシュボード機能の移行に向け、顧客の利用実態とCS・セールスの視点から、提供する機能と使い方を整理。",
      action: "引き継ぐ機能、省ける機能、使いやすく再構成する機能を検討。開発組織全体の目標スケジュールを踏まえ、必要な仕様変更を関係者と調整した。",
      outcome: "顧客の業務継続と開発の実現性を踏まえ、提供範囲・仕様・進め方に合意。Go・Reactで実装を進めている。",
      tech: ["Go", "React"],
      story: {
        intro: "既存機能の移行に向け、利用実態・要望・期限を整理し、関係者と仕様をすり合わせる。",
        inputTitle: "判断の材料",
        inputs: [
          { icon: "users", title: "顧客の利用実態", note: "業務に必要な機能・使い方" },
          { icon: "support", title: "CS・セールスの視点", note: "顧客の要望・案内や提案のしやすさ" },
          { icon: "calendar", title: "開発スケジュール", note: "目標時期・実現できる範囲" },
        ],
        processTitle: "移行仕様をすり合わせる",
        steps: [
          { icon: "list", title: "必要な機能・使い方を整理", note: "利用実態・要望をもとに、必要な範囲を明確化" },
          { icon: "tree", title: "使いやすい構成を検討", note: "顧客の業務に合わせて、機能の構成を見直す" },
          { icon: "settings", title: "期限に合わせて仕様を調整", note: "関係者と変更点をすり合わせる" },
        ],
        outcomeTitle: "合意した移行方針",
        outcome: { icon: "document", title: "提供範囲・仕様・進め方に合意", note: "Go・Reactで実装中" },
        contribution: "仕様の再整理と、関係者との合意形成。",
      },
    },
    {
      tab: "ユニットリーダー",
      title: "論点と依存関係を整理し、統合プロジェクトを前に進める",
      role: "ユニットリーダー・技術リード",
      period: { from: "2026-07", to: "present" },
      status: "ongoing",
      situation: "別プロダクトの機能を主力プロダクトへ統合する案件で、再現する範囲が未確定。体制変更や他チームとの依存も踏まえ、実行できる方針と計画をまとめる必要があった。",
      action: "止まっていた論点を「結論・理由・段階案・決めるべき問い」に整理して提案。他チームへの依頼は受け入れ基準と性能目標を明確にし、体制に合わせて計画を見直した。",
      outcome: "技術方針の承認と段階的なリリース計画への合意を得て、実装に着手。関係チームと調整しながら進行している。",
      tech: ["React", "TypeScript", "Go", "BigQuery"],
      story: {
        intro: "未確定の仕様・体制変更・他チームへの依頼を整理し、意思決定と実装を前に進める。",
        inputTitle: "進行を難しくしていたこと",
        inputs: [
          { icon: "list", title: "統合範囲が未確定", note: "何を再現し、どこまで対応するか" },
          { icon: "users", title: "開発体制の変更", note: "体制に応じた計画の見直しが必要" },
          { icon: "workflow", title: "他チームとの依存", note: "依頼内容と受け入れ条件の共有" },
        ],
        processTitle: "決められる形に整理する",
        steps: [
          { icon: "document", title: "論点と段階案を提示", note: "結論・理由・決めるべき問いを明確に" },
          { icon: "target", title: "依頼の受け入れ基準を定義", note: "品質・性能の目標を他チームと共有" },
          { icon: "calendar", title: "体制に合わせて計画を調整", note: "段階的な進め方を関係者と合意" },
        ],
        outcomeTitle: "現在の到達点",
        outcome: { icon: "checks", title: "技術方針・計画に合意し、実装へ", note: "関係チームと調整しながら進行中" },
        contribution: "論点の構造化、技術方針の提案、チーム間の依頼・計画調整。",
      },
    },
    {
      tab: "AI駆動開発",
      title: "レビューの詰まりから逆算し、AI開発の品質を支える",
      role: "ユニットリーダー・開発プロセス整備",
      period: { from: "2026-07", to: "present" },
      status: "ongoing",
      situation: "AIで実装が速くなる一方、レビューが追い付かずボトルネックになっていた。品質を担保しながら開発全体を速める仕組みが必要だった。",
      action: "レビューを速める前提としてE2Eによる品質担保を優先。着手前に仕様を合意し、AIで実装する流れをSkill群として整備した。QAも利用できるE2Eの自律生成基盤を構築。",
      outcome: "Skill群とE2E生成基盤がリポジトリ内で稼働し、日々の開発で運用中。効果を確認しながら改善を続けている。",
      tech: ["Claude Code", "E2E"],
      story: {
        intro: "実装速度だけでなく、レビューと品質担保まで含めてAI前提の開発手順を整える。",
        inputTitle: "実装の先に生まれた課題",
        inputs: [
          { icon: "code", title: "AIで実装が加速", note: "コードを書く速さが向上" },
          { icon: "list", title: "レビューが追い付かない", note: "確認待ちが次のボトルネックに" },
          { icon: "shield", title: "品質を保つ必要", note: "レビューを速めるための前提" },
        ],
        processTitle: "品質から逆算して整備する",
        steps: [
          { icon: "test", title: "E2Eによる品質担保を優先", note: "着手する順序を、詰まりの原因から判断" },
          { icon: "workflow", title: "仕様合意・AI実装を手順化", note: "開発の流れをSkill群として整備" },
          { icon: "users", title: "QAも使えるテスト生成基盤", note: "E2Eを自律生成できる仕組みを構築" },
        ],
        outcomeTitle: "現在の運用",
        outcome: { icon: "settings", title: "日々の開発で運用中", note: "Skill群とE2E生成基盤が稼働" },
        contribution: "優先順位の判断から、Skill整備・E2E生成基盤の構築まで担当。",
      },
    },
    {
      tab: "Slack MCP",
      title: "権限・監査・導入方法まで整え、社内の知見をAIで使える形に",
      role: "起案・設計・実装・展開・運用",
      period: { from: "2026-01", to: "2026-07" },
      status: "released",
      situation: "Slackに蓄積した解決事例をAIから参照したいが、既製のコネクタでは読める範囲が広すぎて導入できなかった。",
      action: "社内向けMCPサーバーの自作を提案。権限設計と監査要件の合意から実装、非エンジニア向けインストーラーの用意まで一貫して担当した。",
      outcome: "社内での利用を開始し、その後の運用も継続して担当している。",
      tech: ["MCP", "OAuth", "Slack API"],
      story: {
        intro: "知見を参照する機能だけでなく、社内で導入・運用できる条件まで整備する。",
        inputTitle: "導入に必要だった条件",
        inputs: [
          { icon: "support", title: "Slackに蓄積した知見", note: "AIから解決事例を参照したい" },
          { icon: "shield", title: "既製コネクタの権限", note: "読める範囲が広く、導入が難しい" },
          { icon: "users", title: "非エンジニアも利用", note: "導入しやすい方法が必要" },
        ],
        processTitle: "社内で使える条件を整える",
        steps: [
          { icon: "shield", title: "権限・監査要件を合意", note: "参照範囲と運用上の要件を整理" },
          { icon: "code", title: "MCPサーバーを自作", note: "社内の利用条件に合わせて実装" },
          { icon: "install", title: "導入用インストーラーを用意", note: "非エンジニアへの展開まで対応" },
        ],
        outcomeTitle: "利用開始とその後",
        outcome: { icon: "users", title: "社内利用を開始、運用も継続", note: "導入後の対応も担当" },
        contribution: "起案から権限設計・合意・実装・展開・継続運用まで担当。",
      },
    },
    {
      tab: "テンプレート機能",
      title: "自ら提案し、PoCで価値を示して営業・CSの提案につなげる",
      role: "自主提案・PoC・社内展開",
      period: { from: "2026-06", to: "2026-09" },
      status: "released",
      situation: "顧客オンボーディングのたびに、アプリを手作業でゼロから組み立てていた。",
      action: "テンプレート機能を自ら提案し、PoCまでやり切って価値を提示。社内で実運用を試せる仕組みも用意し、セールス・CSへの展開につなげた。",
      outcome: "セールス・CSの双方で、テンプレート機能を軸とした追加提案の動きが生まれた。社内で試せるリリースの仕組みもプロダクト全体で利用できる形にした。",
      tech: ["React", "TypeScript", "Go", "FeatureFlag"],
      story: {
        intro: "現場の手作業から着想し、動くPoCで価値を示して提案活動につなげる。",
        inputTitle: "提案のきっかけ",
        inputs: [
          { icon: "settings", title: "毎回ゼロから手作業で構築", note: "顧客オンボーディングの負担" },
          { icon: "lightbulb", title: "テンプレート化を自主提案", note: "動く形で機能の価値を示す" },
        ],
        processTitle: "PoCから社内の活用へ",
        steps: [
          { icon: "lightbulb", title: "機能を起案し、PoCを実装", note: "アイデアを動くものにして価値を提示" },
          { icon: "test", title: "社内で試せる環境を用意", note: "実運用で確認できるリリース方法を整備" },
          { icon: "support", title: "セールス・CSに展開", note: "機能を軸にした追加提案へつなげる" },
        ],
        outcomeTitle: "提案活動への広がり",
        outcome: { icon: "chart", title: "営業・CSの追加提案の軸に", note: "双方で活用の動きが生まれた" },
        contribution: "自主的な機能提案とPoCを起点に、セールス・CSの提案活動へ接続。",
      },
    },
  ],
};

/* ────────────────────────────── 技術トピック ── */

/**
 * 技術レベルの裏付けになる話題。現職での取り組み（engineerNow）が
 * 「どう動いたか」を書くのに対し、ここは「何を作ったか」を書く。
 * 記事を書いたら href を足すと、カードがリンクになる。
 */
export type TechTopic = {
  source: string;
  period: Period;
  title: string;
  summary: string;
  tech: string[];
  href?: string;
  visual?: "dashboard-migration";
};

export const engineerTechTopics: TechTopic[] = [
  {
    source: "HRBrain（実装中）",
    period: { from: "2026-04", to: "present" },
    title: "必要な時に取得・集計し、共通基盤への負荷を抑える",
    summary:
      "BigQueryに日次蓄積していた過去データのインフラコストと保守負担を見直し、中央DBから必要なデータを集計時に取得する方式へ移行。大規模な過去時点集計によるDB負荷と表示待ち時間に対し、Goでの分割取得とValkeyによる結果キャッシュを設計。データ鮮度・問い合わせ対応コストを踏まえて保持方針と管理者の手動更新を検討し、中央DBチームと性能改善を協議しながら、Go・Reactで実装・検証を進めている。",
    tech: ["Go", "React", "BigQuery", "Valkey"],
    visual: "dashboard-migration",
  },
  {
    source: "HRBrain",
    period: { from: "2025-07", to: "2025-09" },
    title: "4万人規模テナントの日次バッチを、約2時間から約1分へ",
    summary:
      "本番デバッグ用ワークフローで原因を特定し、gRPCのストリーミング化とメンバー変更反映の高速化で解消。全企業のCloud Run Jobs移行はコスト試算で見送り、該当バッチのコストは約98%削減。",
    tech: ["Go", "gRPC", "Cloud Run Jobs", "Workflows"],
  },
  {
    source: "HRBrain",
    period: { from: "2025-12", to: "2026-06" },
    title: "クロス集計：テーブル仮想化とN階層ヘッダー、権限を伝播する集計エンジン",
    summary:
      "9つの項目タイプを扱う集計を、FEは仮想化とN階層ヘッダーで、BEは閲覧者ロールでの権限伝播つきの集計エンジンで実装。約60PR。",
    tech: ["React", "TypeScript", "Go", "PostgreSQL"],
  },
  {
    source: "HRBrain",
    period: { from: "2026-01", to: "2026-07" },
    title: "プロンプトではなく権限で塞ぐ、MCPサーバーの2層設計",
    summary:
      "OAuth scopeをパブリックチャンネル限定にし、公開ツールも読み取り系のみに限定。監査はIP制限＋ローカルログで、残るリスクまで明記して合意。",
    tech: ["MCP", "OAuth", "Slack API"],
  },
];

/* ────────────────────────────── 職務経歴 ── */

export type CareerProject = {
  name: string;
  role?: string;
  teamSize?: string;
  description: string;
  /** 定量的な実績・工夫。 */
  highlights: string[];
  tech: string[];
};

export type EngineerCareerEntry = {
  period: Period;
  company: string;
  employmentType: string;
  role: string;
  /**
   * "sales" はエンジニア職ではない経歴。表示はするが、通算年数には数えない。
   * 省略時はエンジニア職。
   */
  kind?: "engineering" | "sales";
  summary?: string;
  /**
   * 案件カードの代わりに出す技術タグ。詳細を別の節に置いた会社（現職）で使う。
   * 絞り込みの件数には数えない。
   */
  tech?: string[];
  /** 詳細を別の節に置いたときの案内。画面ではその節へのリンク、紙では参照の一文になる。 */
  seeAlso?: { label: string; href: string };
  projects: CareerProject[];
};

/** 本業の職務経歴（新しい順）。 */
export const engineerCareer: EngineerCareerEntry[] = [
  {
    period: { from: "2025-04", to: "present" },
    company: "株式会社HRBrain",
    employmentType: "正社員",
    role: "プロダクトエンジニア → ユニットリーダー",
    summary: "人事データ活用SaaSの仕様策定・フルスタック実装・リリース判断を担当。",
    tech: ["React", "TypeScript", "Go", "GCP", "PostgreSQL", "GitHub Actions"],
    seeAlso: { label: "現職での取り組み", href: "#now" },
    projects: [],
  },
  {
    // TODO: 在籍期間を確認してください（Offers の表記から推定）
    period: { from: "2022-01", to: "2025-03" },
    company: "株式会社pluszero",
    employmentType: "正社員",
    role: "PM・フルスタックエンジニア",
    summary:
      "受託・共同開発案件を中心に、PMとフルスタックエンジニアの両輪で多様なプロジェクトを担当",
    projects: [
      {
        name: "自動車CADファイルOCRシステム",
        role: "PM・フルスタックエンジニア",
        teamSize: "7名",
        description:
          "自動車部品CADファイルのOCRシステム開発。PMとして要件定義〜結合試験まで一気通貫で担当し、メンバー7名の仕様・チケット整理を行いつつ、インフラ構築や綿密な仕様理解が必要な機能の開発を担当。",
        highlights: [
          "FastAPI・CADツールマクロ・VBAマクロなど複数のバックエンドを横断してデータを生成し、AIチームのチェックロジックに繋ぎ込むフローを構築",
          "Azure OpenAI を使ったLLMとのAPI連携を実装し、プロンプトエンジニアリングを実践",
          "技術選定・Swagger作成・インフラ構築・チケット管理を担当",
        ],
        tech: ["Python", "TypeScript", "Rust", "React", "FastAPI", "Tauri", "AWS (EC2 / ECS / RDS / S3)", "Azure OpenAI"],
      },
      {
        name: "染料のAI処方 社内ツール開発",
        role: "PM・フルスタックエンジニア",
        teamSize: "4名",
        description:
          "髪の染料メーカーの研究チーム向けに、画像から染料の処方を生成するAIツールをプロジェクト全体のPMとして一から設計・構築・実装し、AIロジックとの繋ぎ込みまで担当。",
        highlights: [
          "バックエンドとフロントエンドのAPI型共有をコマンド一つで行える仕組みなど、開発環境を積極的に整備",
          "プロジェクト初期に仕様をチームで徹底討論し顧客とすり合わせることで、手戻りの少ない開発を実現",
          "ジュニアメンバーのコードレビューを担当",
        ],
        tech: ["TypeScript", "React", "NestJS", "Prisma", "AWS (Lambda / API Gateway / RDS / S3 / VPC)"],
      },
      {
        name: "クラウドCTIサービスへのAIオペレーターエンジン繋ぎ込み",
        role: "フルスタックエンジニア",
        description:
          "人に代わり電話応対をするAIオペレーターエンジンと既存CTIシステムとの繋ぎ込み開発。既存顧客AWS環境と自社AWS環境の接続フロー策定、AIオペレーターコンテナと既存SIPサーバーの接続を担当。",
        highlights: [
          "AWSインフラ接続フロー図の策定",
          "既存SIPサーバーとPythonプログラムでの内線通話接続を整備",
        ],
        tech: ["Python", "FastAPI", "ECS (Fargate)", "EC2 (Asterisk)", "VPC Peering", "ALB"],
      },
      {
        name: "学習支援システムの統計バッチ コスト改善",
        role: "エンジニア",
        teamSize: "2名",
        description:
          "教科書販売会社が運営する学習支援サービスの統計バッチ処理に毎日30ドル以上のコストがかかっていたため、調査とリファクタリングを担当。",
        highlights: [
          "DynamoDBからのデータ取得を leveldb にキャッシュするなどのチューニングで、日次コストを30ドル→3ドルに削減（約90%減）",
          "ループ内での再三のAPI呼び出しをやめ、必要な分を事前にまとめて取得しMap化することで計算効率も改善",
        ],
        tech: ["TypeScript", "AWS Lambda", "DynamoDB"],
      },
      {
        name: "囲碁サービス運営会社の業務自動化・システム保守",
        role: "エンジニア",
        teamSize: "4名",
        description:
          "基幹業務である請求・ポイント付与作業を自動化するプログラムをPythonで開発。Delphi製の既存バッチ資産を読み解きながら再構築。",
        highlights: [
          "月に約4〜5日を要していた煩雑な手作業を半日〜1日程度に短縮",
          "保守者のいない言語（Delphi）のコードを調べながら読み解き、ユーザーへのヒアリングで「本当に達成したいこと」を再確認して再構築",
        ],
        tech: ["Python", "Delphi", "AWK", "AWS (EC2 / S3)"],
      },
      {
        name: "囲碁対局デスクトップアプリの再開発",
        role: "エンジニア",
        teamSize: "6名",
        description:
          "Delphi・C#で書かれていた対局アプリを Electron で再開発するプロジェクト。モックを顧客に見せてイメージを共有してから実装するなど、アウトプットの質にこだわって開発。",
        highlights: ["Redux（Action / Reducer / Store）による状態管理設計・実装"],
        tech: ["React", "Redux", "Electron", "AWS (EC2 / S3)"],
      },
      {
        name: "人事向け従業員分析SaaSの開発・保守運用",
        role: "エンジニア",
        teamSize: "3名",
        description:
          "従業員アンケートを分析し組織改善のアドバイスを行うSaaSの開発・保守運用。要望の多い顧客との会議に参加し、入念なヒアリングをもとに実装。",
        highlights: [
          "1回1,000〜10,000件のアンケート処理を、Lambda / API Gateway の制限を考慮したチャンク分割で安定処理",
          "前ベンダー実装によるDynamoDB Scanの多発でコストが膨張していた問題を、調査→原因究明→実装調整で解消",
        ],
        tech: ["Vue.js", "Nuxt.js", "Node.js", "AWS (Amplify / Cognito / Lambda / API Gateway / DynamoDB / S3)"],
      },
      {
        name: "法人向け建築資材通販会社のOCRシステム",
        role: "エンジニア",
        teamSize: "3名",
        description:
          "業務効率化のためのOCRシステム導入におけるIT部分（読み取り結果の表示・編集）を、フロント・バックエンド・インフラ全て担当。",
        highlights: [
          "DynamoDBからの無駄なデータ取得をなくす設計最適化、idの配列を取得してからのbatchGetなどAPI設計を工夫",
          "AWS CDK によるインフラ構築",
        ],
        tech: ["React", "TypeScript", "Node.js", "NestJS", "AWS (Lambda / API Gateway / DynamoDB / S3)", "AWS CDK"],
      },
    ],
  },
  {
    // TODO: 在籍期間を確認してください（Offers の表記から推定）
    period: { from: "2020-06", to: "2021-12" },
    company: "株式会社システムシェアード",
    employmentType: "正社員",
    role: "エンジニア",
    summary:
      "受託開発・自社サービス開発にて、立ち上げから保守運用まで幅広く経験。営業職からエンジニアへの転身後、最初のキャリア",
    projects: [
      {
        name: "プログラミング学習サービスの立ち上げ",
        role: "アーキテクト・エンジニア",
        teamSize: "2名",
        description:
          "社内外向けプログラミング学習サービスを、コンセプト提案からアーキテクチャ設計・開発・デプロイまで全工程担当。2週間という短期間で最速リリース。",
        highlights: [
          "フロント〜インフラまでのサーバーレス構成（Nuxt.js / Lambda / DynamoDB / Cognito / API Gateway）を単独で設計・構築",
          "Develop / Prod 環境を分離したCI/CD体制を整備し、チームで開発しやすい環境を構築",
          "新人エンジニア育成の社内教材としても採用され、参加者の約50%の現場配属に貢献",
        ],
        tech: ["Vue.js", "Nuxt.js", "Node.js", "Python", "AWS (Amplify / Lambda / DynamoDB / Cognito / API Gateway / CodePipeline)"],
      },
      {
        name: "AWS学習用アカウント管理サービスの立ち上げ・運用",
        role: "エンジニア",
        teamSize: "2名",
        description:
          "IT研修用のAWSアカウント管理サービスを企画フェーズから開発。競合分析を踏まえ「選ばれるプロダクトにするには」というビジネス視点を持って開発に参画。",
        highlights: ["Nuxt.js によるユーザー画面全般の開発、API連携・テストを担当"],
        tech: ["Vue.js", "Nuxt.js", "Node.js", "AWS (Lambda / DynamoDB / Cognito / Aurora / Organizations / GuardDuty)"],
      },
      {
        name: "LINEメッセージ広告運用SaaSの開発",
        role: "フロントエンドエンジニア",
        teamSize: "2名",
        description:
          "LINEのステップ配信サービスの要件定義・設計・開発。ユーザーの行動・属性によってメッセージやクーポンを柔軟に出し分けるフローを、直感的なGUIで設定できるフロントエンドを実装。",
        highlights: [
          "番号を振ったノードを再帰処理でループさせ、CSS Grid に描画位置を与えることで複雑なフロー図描画を実現",
        ],
        tech: ["Vue.js", "Nuxt.js", "AWS ECS"],
      },
      {
        name: "顧客内基幹システムの保守・運用",
        role: "エンジニア",
        teamSize: "2名",
        description: "小売業の基幹システムの障害対応と、改善課題に対するJavaでの改修を担当。",
        highlights: ["Java / PostgreSQL / VB を使った業務システムの保守・運用を経験"],
        tech: ["Java", "VB", "PostgreSQL", "AWS EC2"],
      },
    ],
  },
  {
    period: { from: "2017-04", to: "2020-08" },
    company: "DELL株式会社",
    employmentType: "正社員",
    role: "内勤営業",
    kind: "sales",
    summary:
      "新卒入社し、内勤営業職として3年以上従事。顧客折衝・提案の経験は、現在のエンジニアとしての要件ヒアリングや顧客コミュニケーションの土台になっている",
    projects: [],
  },
];

/** 副業・業務委託（新しい順）。本業と期間が重なるので通算年数には数えない。 */
export const engineerSideWorks: EngineerCareerEntry[] = [
  {
    period: { from: "2023-10", to: "present" },
    company: "wizOnChain株式会社",
    employmentType: "副業",
    role: "バックエンドエンジニア",
    projects: [
      {
        name: "Twitter⇔Web3Authのログイン外部連携 / バックエンド新機能開発",
        description:
          "VPC on Lambda などを AWS CDK で構築し、既存の Cognito と連携。AWSでも事例の少ない構成のため、AWSのSAサポートと連携しながら構築。新機能開発では詳細設計〜実装、クリーンアーキテクチャに基づく実装、Jestでのテストまで担当。",
        highlights: [
          "テーブル・カラム設計、API設計などの詳細設計から、CI/CDテスト通過までを一貫して担当",
        ],
        tech: ["Node.js", "AWS CDK", "Cognito", "Lambda", "Jest"],
      },
    ],
  },
  {
    period: { from: "2024-01", to: "2024-03" },
    company: "株式会社Cory",
    employmentType: "副業",
    role: "フルスタックエンジニア",
    projects: [
      {
        name: "LINEメッセージ広告運用SaaSのインフラ移行",
        description:
          "Elastic Beanstalk のEOLと度重なるサービス停止を受け、ECS環境への移行を担当。CDKによるインフラ構築から手順書作成、顧客への説明まで実施。",
        highlights: [
          "ALB連携不備によるサービス停止を解消し、事業スケールに耐える構成へ移行",
          "環境ごとの GitHub Actions CI/CD 構築、フロントエンドの S3 + CloudFront 化",
          "Sentry を導入し、エラーをSlackへ即時通知する監視体制をゼロから構築",
        ],
        tech: ["AWS CDK", "ECS", "S3 + CloudFront", "GitHub Actions", "Sentry"],
      },
    ],
  },
];

/* ────────────────────────────── スキル ── */

export type EngineerSkill = {
  name: string;
  /** "5年以上" "3年以上" "1年以上" "1年" のいずれか。バーの長さと並び順はここから決まる。 */
  years: string;
};

export type EngineerSkillCategory = {
  title: string;
  skills: EngineerSkill[];
};

export const engineerSkills: EngineerSkillCategory[] = [
  {
    title: "フロントエンド",
    skills: [
      { name: "React", years: "5年以上" },
      { name: "TypeScript", years: "3年以上" },
      { name: "JavaScript", years: "3年以上" },
      { name: "HTML / CSS", years: "3年以上" },
      { name: "Nuxt.js / Vue.js", years: "3年以上" },
      { name: "Next.js", years: "1年以上" },
      { name: "Redux", years: "1年以上" },
      { name: "Electron", years: "1年以上" },
    ],
  },
  {
    title: "バックエンド",
    skills: [
      { name: "Node.js", years: "3年以上" },
      { name: "Python", years: "3年以上" },
      { name: "Go", years: "1年以上" },
      { name: "NestJS", years: "1年以上" },
      { name: "FastAPI", years: "1年以上" },
      { name: "PHP / Laravel", years: "1年以上" },
    ],
  },
  {
    title: "インフラ / CI・CD",
    skills: [
      { name: "AWS", years: "3年以上" },
      { name: "ECS", years: "3年以上" },
      { name: "Docker", years: "3年以上" },
      { name: "マイクロサービス", years: "3年以上" },
      { name: "GitHub Actions", years: "3年以上" },
      { name: "AWS CDK", years: "1年以上" },
      { name: "GCP", years: "1年以上" },
    ],
  },
  {
    title: "データベース",
    skills: [
      { name: "PostgreSQL", years: "3年以上" },
      { name: "MySQL", years: "3年以上" },
      { name: "DynamoDB", years: "1年以上" },
    ],
  },
  {
    title: "AI",
    skills: [
      { name: "LLM連携（Azure OpenAI）", years: "1年以上" },
      { name: "プロンプト設計", years: "1年以上" },
      { name: "Claude Code 活用・社内推進", years: "1年" },
    ],
  },
];
