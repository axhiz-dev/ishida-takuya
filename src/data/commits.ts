export type Commit = {
  no: string;
  hash: string;
  year: string;
  message: string;
};

// Build History(Git Log 風)。スクロールで順に append される。
export const commits: Commit[] = [
  { no: "0001", hash: "a3f91c2", year: "2017", message: "Started learning HTML." },
  { no: "0005", hash: "7d20e4b", year: "2017", message: "Wrote my first line of JavaScript." },
  { no: "0014", hash: "c58aa01", year: "2019", message: "Built my first React app." },
  { no: "0022", hash: "1e9b3f7", year: "2020", message: "Joined my first product team." },
  { no: "0031", hash: "b44c6d9", year: "2021", message: "Shipped a NestJS backend to production." },
  { no: "0038", hash: "f02d81a", year: "2022", message: "Designed scalable AWS infrastructure." },
  { no: "0047", hash: "6a7e5c3", year: "2023", message: "Led architecture for a streaming platform." },
  { no: "0055", hash: "d913b28", year: "2024", message: "Started building products with LLMs." },
  { no: "0061", hash: "42e0f9d", year: "2025", message: "Released MatoMessage." },
];

export const headCommit = {
  ref: "HEAD -> main",
  year: "2026",
  message: "Still building.",
};

// hover(または Developer Mode)でだけ見える隠し commit
export const hiddenCommit = {
  hash: "0000000",
  message: "you found the hidden commit. hi :)",
};
