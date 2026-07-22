/** サイト全体で使うデータの型定義。データ本体は同ディレクトリの各ファイルを編集する */

export interface SocialLink {
  label: string;
  url: string;
}

export interface Profile {
  nameJa: string;
  nameEn: string;
  /** エンジニア向けの肩書 */
  title: string;
  /** ビジネス向けの平易な一言 */
  bizTagline: string;
  /** 職務要約（段落ごとに配列） */
  summary: string[];
  links: SocialLink[];
  email: string;
}

export interface CareerProject {
  name: string;
  period?: string;
  role?: string;
  teamSize?: string;
  description: string;
  /** 定量的な実績・工夫を箇条書きで */
  highlights: string[];
  tech: string[];
}

export interface Career {
  company: string;
  employmentType: "正社員" | "業務委託" | "副業" | string;
  period: string;
  role: string;
  summary?: string;
  projects: CareerProject[];
}

export interface SkillItem {
  name: string;
  years: string;
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
}

/** ビジネス向けの実績事例（課題 → やったこと → 成果） */
export interface CaseStudy {
  title: string;
  clientType: string;
  problem: string;
  action: string;
  result: string;
  metric?: {
    value: string;
    label: string;
  };
}

/** ビジネス向け「できること」 */
export interface ServiceArea {
  title: string;
  description: string;
}

/** ビジネス向け「人となり」 */
export interface PersonalNote {
  heading: string;
  body: string;
}
