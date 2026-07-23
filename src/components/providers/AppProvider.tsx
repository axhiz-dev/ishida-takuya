"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { orderedBuilds } from "@/data/builds";
import { scrollToId } from "@/lib/scroll";

type AppState = {
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  shortcutsOpen: boolean;
  setShortcutsOpen: (v: boolean) => void;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  openBuildId: string | null;
  openBuild: (id: string | null) => void;
  focusIndex: number;
  selectedTech: string | null;
  selectTech: (name: string | null) => void;
  archiveOpen: boolean;
  setArchiveOpen: (v: boolean) => void;
  devMode: boolean;
};

const AppContext = createContext<AppState | null>(null);

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable
  );
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openBuildId, setOpenBuildId] = useState<string | null>(null);
  const [focusIndex, setFocusIndex] = useState(-1);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const konamiPos = useRef(0);

  const openBuild = useCallback((id: string | null) => {
    setOpenBuildId(id);
    if (id) {
      const idx = orderedBuilds.findIndex((b) => b.id === id);
      if (idx >= 0) setFocusIndex(idx);
    }
  }, []);

  const selectTech = useCallback((name: string | null) => {
    setSelectedTech(name);
    if (name) setArchiveOpen(true);
  }, []);

  // コンソールのイースターエッグ
  useEffect(() => {
    console.log(
      "%c" +
        [
          " ___      _ _    _   _              ",
          "| _ )_  _(_) |__| | | |   ___  __ _ ",
          "| _ \\ || | | / _` | | |__/ _ \\/ _` |",
          "|___/\\_,_|_|_\\__,_| |____\\___/\\__, |",
          "                              |___/ ",
        ].join("\n"),
      "color:#1a7f37;font-family:monospace"
    );
    console.log("Thanks for inspecting :)");
    console.log("hint: try the Konami code.");
  }, []);

  useEffect(() => {
    const scrollToBuild = (idx: number) => {
      const build = orderedBuilds[idx];
      if (!build) return;
      const el = document.querySelector<HTMLElement>(
        `[data-build-id="${build.id}"]`
      );
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // Konami コマンド → Developer Mode
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === KONAMI[konamiPos.current]) {
        konamiPos.current += 1;
        if (konamiPos.current === KONAMI.length) {
          konamiPos.current = 0;
          setDevMode((v) => {
            const next = !v;
            console.log(
              next
                ? "%cDEVELOPER MODE UNLOCKED — welcome to the source."
                : "%cdeveloper mode disabled. see you.",
              "color:#1a7f37;font-weight:bold"
            );
            return next;
          });
        }
      } else {
        konamiPos.current = key === KONAMI[0] ? 1 : 0;
      }

      if (isTypingTarget(e.target) || e.isComposing) {
        return;
      }

      // Ctrl / Cmd + K → Command Palette
      if ((e.metaKey || e.ctrlKey) && key === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        setShortcutsOpen(false);
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (key === "Escape") {
        if (paletteOpen) setPaletteOpen(false);
        else if (shortcutsOpen) setShortcutsOpen(false);
        else if (openBuildId) setOpenBuildId(null);
        else if (drawerOpen) setDrawerOpen(false);
        else if (selectedTech) setSelectedTech(null);
        else setFocusIndex(-1);
        return;
      }

      if (paletteOpen) return;

      if (key === "?") {
        e.preventDefault();
        setShortcutsOpen((v) => !v);
        return;
      }

      // J / K → 次・前の Build
      if (key === "j" || key === "k") {
        e.preventDefault();
        const delta = key === "j" ? 1 : -1;
        if (openBuildId) {
          const idx = orderedBuilds.findIndex((b) => b.id === openBuildId);
          const next =
            (idx + delta + orderedBuilds.length) % orderedBuilds.length;
          openBuild(orderedBuilds[next].id);
        } else {
          setFocusIndex((prev) => {
            const next =
              prev < 0
                ? key === "j"
                  ? 0
                  : orderedBuilds.length - 1
                : (prev + delta + orderedBuilds.length) % orderedBuilds.length;
            scrollToBuild(next);
            return next;
          });
        }
        return;
      }

      if (key === "Enter" && focusIndex >= 0 && !openBuildId && !shortcutsOpen) {
        e.preventDefault();
        openBuild(orderedBuilds[focusIndex].id);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    paletteOpen,
    shortcutsOpen,
    drawerOpen,
    openBuildId,
    selectedTech,
    focusIndex,
    openBuild,
  ]);

  // オーバーレイ表示中は背景スクロールを止める
  useEffect(() => {
    const locked = paletteOpen || shortcutsOpen || openBuildId !== null || drawerOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [paletteOpen, shortcutsOpen, openBuildId, drawerOpen]);

  const value = useMemo<AppState>(
    () => ({
      paletteOpen,
      setPaletteOpen,
      shortcutsOpen,
      setShortcutsOpen,
      drawerOpen,
      setDrawerOpen,
      openBuildId,
      openBuild,
      focusIndex,
      selectedTech,
      selectTech,
      archiveOpen,
      setArchiveOpen,
      devMode,
    }),
    [
      paletteOpen,
      shortcutsOpen,
      drawerOpen,
      openBuildId,
      openBuild,
      focusIndex,
      selectedTech,
      selectTech,
      archiveOpen,
      devMode,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function navigateToSection(id: string, close?: () => void) {
  scrollToId(id);
  close?.();
}
