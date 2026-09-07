/**
 * コンテンツの型定義。
 *
 * ここのデータを書き換えて push すれば、CI が GitHub Pages を
 * 更新するので職務経歴書が最新になる。
 *
 * 設計上の要点：**数値は任意**にしてある。
 * 「p95 を 40% 改善」のような未確認の数字を埋めるくらいなら
 * 数字なしで質的に書く。捏造した指標は読み手にすぐ見抜かれる。
 */

/** "2024-04" 形式の年月。 */
export type YearMonth = `${number}-${number}`;

export type Period = {
  from: YearMonth;
  /** 在籍中は "present"。 */
  to: YearMonth | "present";
};

export type Link = {
  label: string;
  href: string;
  /** 補足（「ソース公開」「要ログイン」など）。 */
  note?: string;
};

/* ────────────────────────────── プロフィール ── */

/**
 * 見出しの中の 1 語だけ背後に色帯を敷く。
 * `mark` は `text` に含まれる部分文字列を指す。含まれていなければ帯は出ない。
 * 画面で一番大きい声を 1 箇所だけ作るための仕掛けなので、短い語を選ぶこと。
 */
export type MarkedText = {
  text: string;
  mark: string;
};

export type Profile = {
  name: string;
  nameLatin: string;
  /** 「フルスタックエンジニア」など。 */
  role: string;
  /** 冒頭の宣言。1 語だけ強調される。 */
  headline: MarkedText;
  /** 宣言の下に続く 1〜2 文。 */
  lede: string;
  location: string;
  /** 現在の状況。採用側が最初に知りたい情報。 */
  status: {
    /** 「転職活動中」「情報交換歓迎」など。 */
    label: string;
    /** 「2026年10月から稼働可能」など。空なら非表示。 */
    detail?: string;
  };
  /** 要約の箇条書き。3〜5 件。 */
  summary: string[];
  links: Link[];
  email: string;
  /**
   * 顔写真のパス（public/ からの相対）。
   * 未設定ならモノグラムのプレースホルダが出る。
   */
  photo?: string;
  /** 最終更新日 "YYYY-MM-DD"。印刷ヘッダとコロフォンに出る。 */
  updatedAt: string;
};

/* ────────────────────────────── 職務経歴 ── */

export type Outcome = {
  /** 何をしたか。 */
  label: string;
  /**
   * 定量的な結果。**確認できた数字だけ**入れる。
   * 未確定なら省略する（数字のない行としてそのまま出る）。
   */
  value?: string;
  /** 数字の出どころや前提。 */
  note?: string;
};

export type CareerEntry = {
  id: string;
  company: string;
  /** 事業内容の 1 行説明。読み手はたいてい社名を知らない。 */
  companyNote: string;
  period: Period;
  role: string;
  /** 関わったチームの人数。 */
  teamSize?: number;
  /** 置かれていた状況。成果の意味はここで決まる。 */
  context: string;
  responsibilities: string[];
  outcomes: Outcome[];
  stack: string[];
};

/* ────────────────────────────── スキル ── */

/** 1=触れた / 2=業務で使える / 3=主戦場 / 4=設計と判断ができる */
export type SkillLevel = 1 | 2 | 3 | 4;

export type Skill = {
  name: string;
  level: SkillLevel;
  /** 実務で使った年数。 */
  years?: number;
  /** 「どこで使ったか」。自己申告だけにしないための根拠。 */
  evidence?: string;
  /**
   * ロゴの差し替え。通常は name から自動で引けるので不要。
   * 表示名と対応表のキーがずれるときだけ指定する。
   * 対応表は src/components/icons/registry.ts。
   */
  icon?: string;
};

export type SkillGroup = {
  category: string;
  items: Skill[];
};

/* ────────────────────────────── 事例 ── */

export type CaseStudy = {
  id: string;
  title: string;
  /** 1 行での要約。 */
  oneLiner: string;
  role: string;
  period: string;
  /** 何が問題だったか。 */
  problem: string;
  /** 何をしたか。 */
  approach: string;
  /** なぜその手を選んだか。技術的な判断力が出るのはここ。 */
  reasoning: string;
  /** どうなったか。数字がなければ質的に書く。 */
  result: string;
  stack: string[];
  links?: Link[];
};

/* ──────────────────────── 業務自動化（/business） ── */

/*
 * ここから下は /business 専用。読み手は従業員 20〜100 名程度の会社の
 * 社長または事務責任者で、IT には詳しくない。
 *
 * 文章の決まりごと（原稿と実装で共有する）：
 *   · 見出しは名詞。文にするのはヒーローだけ
 *   · 抽象名詞を使わない（DX／変革／実現／最適化／伴走／寄り添う は禁止）
 *   · 顧客が実際に口にする言葉で書く
 *   · 誇張しない。「すべて」ではなく「たいてい」
 *   · 技術名を前面に出さない（買い手にとってリスク要因になる）
 *   · 「〜ではなく、〜します」の対句はページ全体で 1 回まで
 *   · 断りの文で営業しない。値段の話は別の場所に置く
 *
 * 実績が公開できない段階のサイトなので、導入企業ロゴ・お客様の声・
 * 実績件数・受賞歴は**型として持たない**。盛れないようにしてある。
 */

/** ヒーロー。和文は自動改行に任せると変な位置で折れるので行を明示する。 */
export type BusinessHero = {
  lines: string[];
  /** lines のいずれかに含まれる短い語。そこだけ背後に色帯が敷かれる。 */
  mark: string;
  /** 見出しの下の 1 文。 */
  lede: string;
  /** ボタンの下に並べる条件の要約。3 つまで。 */
  terms: string[];
};

/**
 * ブラウザ内で完結するデモ。触れるものであり、持ち帰れるものでもある。
 * 実績ゼロの段階で唯一機能する証拠なので、このページの中心に置く。
 */
export type Demo = {
  id: string;
  title: string;
  /** 触り方の指示。1〜2 文。 */
  invitation: string;
  /** いま現場で起きている手順。番号付きで出る。 */
  before: string[];
  /** 自動にしたあとの 1 行。 */
  after: string;
  /** 削減の目安。「月およそ 4 時間」など、幅を持たせて書く。 */
  saving: string;
};

/** 買い切りの 1 段。 */
export type PriceTier = {
  id: string;
  label: string;
  /**
   * 「10 万円」。金額を決めない段は undefined にする。
   * 空欄が「高いから書けない」に見えないよう、その場合は必ず reason を書く。
   */
  amount?: string;
  /** 金額を出さない理由。amount がないときだけ使う。 */
  reason?: string;
  /**
   * 試算に使う数値（円）。表示は amount の文字列を使うので、
   * ここは計算専用。表記を変えても計算が壊れないように分けてある。
   */
  amountYen?: number;
  /** 範囲。金額より先に読ませたいので、表示上はこちらが主役。 */
  scope: string;
  /** 納期の目安。 */
  lead: string;
};

/** 買い切りのあとから任意で付けられるもの。 */
export type PriceAddon = {
  id: string;
  label: string;
  amount: string;
  /** 1 行の補足。 */
  summary: string;
  includes?: string[];
  /** 但し書き。高い理由など、聞かれる前に答える。 */
  note?: string;
};

/** 実績が貯まるまでの条件つき価格。3 社に達したら消す。 */
export type MonitorOffer = {
  headline: string;
  body: string;
  conditions: string[];
  note: string;
};

/** 削減額の試算。初期値と単価はここでだけ決める。 */
export type SavingsConfig = {
  /** 週あたりの作業時間（スライダー）。 */
  hoursPerWeek: { min: number; max: number; step: number; initial: number };
  /** 担当者の時給（スライダー）。 */
  hourlyWage: { min: number; max: number; step: number; initial: number };
  /** 試算に使う買い切りの段の id。 */
  tierIds: string[];
  /** 数字が独り歩きしないための但し書き。 */
  disclaimer: string;
};

export type ProcessStep = {
  /** 「01」など。順序があるものなので番号は正当。 */
  no: string;
  title: string;
  body: string;
  /** 相手に用意してもらうもの。 */
  youProvide?: string;
};

export type Faq = {
  q: string;
  a: string;
};

/** お問い合わせフォームの 1 項目。送信先はメールなので型は素朴でよい。 */
export type ContactField = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select";
  required?: boolean;
  /** type が "select" のときの選択肢。 */
  options?: string[];
};
