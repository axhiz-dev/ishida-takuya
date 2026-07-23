export type Tech = {
  name: string;
  // キャリア全体で使った Build 数(表示用)
  careerBuilds: number;
};

// Tech Map。クリックすると Archive 内の該当 Build がハイライトされる。
// name は builds.ts の stack の表記と一致させること。
export const techs: Tech[] = [
  { name: "TypeScript", careerBuilds: 28 },
  { name: "React", careerBuilds: 23 },
  { name: "Node.js", careerBuilds: 21 },
  { name: "PostgreSQL", careerBuilds: 18 },
  { name: "Docker", careerBuilds: 16 },
  { name: "AWS", careerBuilds: 15 },
  { name: "Next.js", careerBuilds: 14 },
  { name: "NestJS", careerBuilds: 12 },
  { name: "Terraform", careerBuilds: 8 },
  { name: "GraphQL", careerBuilds: 7 },
  { name: "LLM / OpenAI", careerBuilds: 6 },
  { name: "React Native", careerBuilds: 5 },
];
