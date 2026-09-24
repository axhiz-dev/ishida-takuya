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

/**
 * 現職の取り組み 1 件。画面ではカルーセルの 1 枚、紙では縦に並ぶ箱になる。
 * 「状況 → 取りに行ったこと → 結果」の順で読ませる。技術の中身はここに書かず、
 * 技術トピック（engineerTechTopics）へ回す。
 */
export type NowInitiative = {
  /** カルーセルのタブに出る短い名前。 */
  tab: string;
  title: string;
  /** 「案件オーナー」など、この件での立場。 */
  role: string;
  period: Period;
  /** "ongoing" は進行中。3 段目の見出しが「現在」になり、緑の印が付く。 */
  status: "released" | "ongoing";
  situation: string;
  action: string;
  /** released なら結果、ongoing ならいまの状況。 */
  outcome: string;
  tech: string[];
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
    "人事データ活用SaaS開発において、セールス・CS・PdMと協議し、仕様策定・実装・リリース判断までを行っています。ユニットリーダー任命後は、AI駆動開発のスキル整備やE2Eテストの拡充を行い、より早く顧客価値を提供するための施策を実行しています。",
  role: "プロダクトエンジニア → 2026.07〜 ユニットリーダー",
  team: "エンジニア2〜4名／PdM・QA・デザイナー各1名",
  initiatives: [
    {
      tab: "クロス集計",
      title: "主力機能「クロス集計」",
      role: "案件オーナー",
      period: { from: "2025-12", to: "2026-06" },
      status: "released",
      situation: "失注要因になっていた機能。仕様は「ほしい」の一言だけで、期中に設計担当が退職した。",
      action:
        "案件オーナーとして引き取り、仕様検討MTGを主催して項目・上限・権限を決め切った。完了日も残バグから逆算し、自分から提示した。",
      outcome: "予定通りリリース。当日から営業がデモに組み込み、クロスセルの武器になった。",
      tech: ["React", "TypeScript", "Go", "PostgreSQL"],
    },
    {
      tab: "テンプレート生成",
      title: "新機能「テンプレート生成」",
      role: "起案〜全社展開",
      period: { from: "2026-06", to: "2026-09" },
      status: "released",
      situation: "顧客オンボーディングのたびに、アプリを手作業でゼロから組み立てていた。",
      action:
        "自ら起案し、PoCで価値を見せて本実装へ。顧客に出さずに実運用で試せるよう、社内IP限定で有効化できる仕組みも新設した。",
      outcome: "2026.09に全社展開。社内IP限定リリースの仕組みはプロダクト全体の資産になった。",
      // TODO: 技術タグを確認してください（仮置き）
      tech: ["React", "TypeScript", "Go", "FeatureFlag"],
    },
    {
      tab: "Slack MCP",
      title: "社内AI活用基盤「Slack MCPサーバー」",
      role: "起案・設計・実装・展開",
      period: { from: "2026-01", to: "2026-07" },
      status: "released",
      situation:
        "Slackに埋もれた解決事例をAIから引きたいが、既製のコネクタでは読める範囲が広すぎて導入できなかった。",
      action: "自作すると決め、権限設計から監査要件の合意、非エンジニア向けのインストーラーまで一人で用意した。",
      outcome: "2026.07に社内で解禁。その後の運用も継続して担当している。",
      tech: ["MCP", "OAuth", "Slack API"],
    },
    {
      tab: "AI駆動開発",
      title: "AI駆動開発の仕組みづくり",
      role: "ユニットリーダー",
      period: { from: "2026-07", to: "present" },
      status: "ongoing",
      situation: "AIによって開発スピードは上がったが、レビューが追い付かずボトルネックになっていた。",
      action:
        "「レビューを速くするには、まずE2Eで品質の下限を保証する必要がある」と逆算して着手順を決めた。仕様を着手前に握り、実装はAIに任せるフローをSkill群として整備し、E2Eを「QAでも書ける」自律生成基盤として構築した。",
      outcome: "リポジトリ内で稼働し、日々の開発で運用中。",
      // TODO: 技術タグを確認してください（仮置き）
      tech: ["Claude Code", "E2E"],
    },
    {
      tab: "ユニットリーダー",
      title: "プロダクト統合プロジェクトの技術リード",
      role: "技術リード",
      period: { from: "2026-07", to: "present" },
      status: "ongoing",
      situation:
        "別プロダクトの機能を主力プロダクトへ統合する案件。「何を再現し、何を諦めるか」が決まらないまま、体制も想定の5名から3名に縮んだ。",
      action:
        "止まっていた最大の論点を「結論 → 理由 → 段階案 → 決めるべき問い」の形で提案し、意思決定を前に進めた。他チームへの依頼は受け入れ基準と性能目標を数値で渡し、計画は体制に合わせて3回引き直した。",
      outcome: "技術方針の承認と、11月末の1stリリースの合意まで取り付け、実装に着手。",
      // TODO: 技術タグを確認してください（仮置き）
      tech: ["React", "TypeScript", "Go", "BigQuery"],
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
};

export const engineerTechTopics: TechTopic[] = [
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
