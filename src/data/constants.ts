/**
 * 金額・条件などの定数はここで一元管理する。
 * 値を書き換えて push すればサイトに反映される。
 */
export const CONSTANTS = {
  /** 希望年収（正社員） */
  desiredAnnualSalary: "800万円",
  /** Offers の自動診断による想定年収 */
  offersAssessedSalary: "1,075万円",
  /** 転職スタンス */
  jobChangeStance: "良いオファーがあれば検討",
  /** 副業の稼働条件 */
  sideJobAvailability: "月20〜30時間（平日夜・土日祝に対応可）",
  /** エンジニアとしての経験年数 */
  yearsOfExperience: "5年",
  /** 携わったプロジェクト数（概数） */
  projectCount: "15+",
  /** PMとして完遂した案件数 */
  pmProjectCount: "2案件",
  /** 営業職としての経験年数（DELL） */
  salesYears: "3年",
} as const;
