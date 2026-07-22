import type { Career } from "./types";

/**
 * 職務経歴（新しい順）。
 * 会社単位でグルーピングし、各社の中に担当プロジェクトを並べる。
 *
 * TODO: Offers上の表記ではプロジェクト期間に「現在」が混在していたため、
 *       pluszero・システムシェアードの在籍終了時期は推定で入れています。
 *       正しい期間に修正してください。
 */
export const careers: Career[] = [
  {
    company: "株式会社HRBrain",
    employmentType: "正社員",
    period: "2025年4月 - 現在",
    role: "フルスタックエンジニア",
    summary:
      "HR系SaaSの複数プロダクト（ノーコードツール・ダッシュボード）のフルスタックな設計・開発・保守運用",
    projects: [
      {
        name: "ノーコードツール / ダッシュボードツールの並行開発",
        description:
          "自社開発の2プロダクトを並行でフルスタック開発（設計〜保守運用まで一貫担当）。仕様策定の上流から関わり、リリース後の運用まで担当。",
        highlights: [
          "フロントエンド／バックエンド／インフラを横断した設計・実装、技術選定・アーキテクチャ設計",
          "PdMと密に連携し「プロダクトとして本当にユーザーに価値を届けられる仕様は何か？」を議論しながら開発に落とし込む",
          "仕様に疑問を感じた際は簡易PoCを実装してPdMに提案するなど、プロダクトファーストな開発を実践",
          "Claude Code の積極活用・社内推進による開発サイクルの高速化",
        ],
        tech: ["TypeScript", "Go", "GCP", "PostgreSQL", "GitHub Actions"],
      },
    ],
  },
  {
    company: "株式会社pluszero",
    employmentType: "正社員",
    period: "2022年1月 - 2025年3月", // TODO: 在籍期間を確認してください
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
    company: "株式会社システムシェアード",
    employmentType: "正社員",
    period: "2020年6月 - 2021年12月", // TODO: 在籍期間を確認してください
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
        highlights: [
          "Nuxt.js によるユーザー画面全般の開発、API連携・テストを担当",
        ],
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
        description:
          "小売業の基幹システムの障害対応と、改善課題に対するJavaでの改修を担当。",
        highlights: ["Java / PostgreSQL / VB を使った業務システムの保守・運用を経験"],
        tech: ["Java", "VB", "PostgreSQL", "AWS EC2"],
      },
    ],
  },
  {
    company: "DELL株式会社",
    employmentType: "正社員",
    period: "2017年4月 - 2020年8月",
    role: "内勤営業",
    summary:
      "新卒入社し、内勤営業職として3年以上従事。顧客折衝・提案の経験は、現在のエンジニアとしての要件ヒアリングや顧客コミュニケーションの土台になっている",
    projects: [],
  },
];

/** 副業・業務委託での実績（新しい順） */
export const sideWorks: Career[] = [
  {
    company: "wizOnChain株式会社",
    employmentType: "副業",
    period: "2023年10月 - 現在",
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
    company: "株式会社Cory",
    employmentType: "副業",
    period: "2024年1月 - 2024年3月",
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
