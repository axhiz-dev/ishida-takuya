export type SectionId =
  | "readme"
  | "history"
  | "journey"
  | "snapshot"
  | "featured"
  | "archive"
  | "stack"
  | "lessons"
  | "current"
  | "next"
  | "contact";

export type SectionMeta = {
  id: SectionId;
  file: string;
  title: string;
};

// ページの表示順
export const sections: SectionMeta[] = [
  { id: "readme", file: "README.md", title: "Build Log" },
  { id: "history", file: "journey/history.log", title: "Build History" },
  { id: "journey", file: "journey/path.md", title: "Journey" },
  { id: "snapshot", file: "journey/stats.json", title: "Career Snapshot" },
  { id: "featured", file: "builds/featured/", title: "Featured Builds" },
  { id: "archive", file: "builds/archive/", title: "Build Archive" },
  { id: "stack", file: "stack/tech-map.json", title: "Tech Map" },
  { id: "lessons", file: "lessons/lessons.md", title: "Lessons" },
  { id: "current", file: "builds/current.build", title: "Current Build" },
  { id: "next", file: "builds/next.build", title: "Next Build" },
  { id: "contact", file: "contact/links.json", title: "Contact" },
];

type ExplorerFile = { id: SectionId; label: string };
type ExplorerNode =
  | { type: "file"; id: SectionId; label: string }
  | { type: "folder"; label: string; children: ExplorerFile[] };

// Explorer のツリー構造(仕様の Builds / Journey / Stack / Lessons / Contact)
export const explorerTree: ExplorerNode[] = [
  { type: "file", id: "readme", label: "README.md" },
  {
    type: "folder",
    label: "builds",
    children: [
      { id: "featured", label: "featured/" },
      { id: "archive", label: "archive/" },
      { id: "current", label: "current.build" },
      { id: "next", label: "next.build" },
    ],
  },
  {
    type: "folder",
    label: "journey",
    children: [
      { id: "history", label: "history.log" },
      { id: "journey", label: "path.md" },
      { id: "snapshot", label: "stats.json" },
    ],
  },
  {
    type: "folder",
    label: "stack",
    children: [{ id: "stack", label: "tech-map.json" }],
  },
  {
    type: "folder",
    label: "lessons",
    children: [{ id: "lessons", label: "lessons.md" }],
  },
  {
    type: "folder",
    label: "contact",
    children: [{ id: "contact", label: "links.json" }],
  },
];
