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

/* ────────────────────────────── ビジネス面 ── */

/** 「できること」と、その裏づけの対。Split Studio の 1 行になる。 */
export type Offering = {
  id: string;
  /** できること。 */
  title: string;
  /** どんな相手向けか。 */
  forWhom: string;
  body: string;
  /** 隣に並べる証拠。 */
  proof: {
    /** 「実績」「成果物」など証拠の種別。 */
    kind: string;
    title: string;
    detail: string;
    /** 補足の箇条書き。 */
    facts?: string[];
    link?: Link;
  };
};

export type ProcessStep = {
  /** 「01」など。順序があるものなので番号は正当。 */
  no: string;
  title: string;
  body: string;
  /** 相手に用意してもらうもの。 */
  youProvide?: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** どの仕事に対する声か。 */
  context: string;
};

export type Faq = {
  q: string;
  a: string;
};

export type Pricing = {
  label: string;
  /** 「30万円〜」など。目安であることを明示する。 */
  range: string;
  note: string;
};
