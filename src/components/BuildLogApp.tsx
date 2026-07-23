"use client";

import { AppProvider } from "@/components/providers/AppProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Explorer } from "@/components/layout/Explorer";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { Hero } from "@/components/sections/Hero";
import { BuildHistory } from "@/components/sections/BuildHistory";
import { Journey } from "@/components/sections/Journey";
import { CareerSnapshot } from "@/components/sections/CareerSnapshot";
import { FeaturedBuilds } from "@/components/sections/FeaturedBuilds";
import { BuildArchive } from "@/components/sections/BuildArchive";
import { TechMap } from "@/components/sections/TechMap";
import { Lessons } from "@/components/sections/Lessons";
import { CurrentBuild } from "@/components/sections/CurrentBuild";
import { NextBuild } from "@/components/sections/NextBuild";
import { Contact } from "@/components/sections/Contact";
import { BuildDetailModal } from "@/components/build/BuildDetailModal";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { ShortcutsOverlay } from "@/components/ui/ShortcutsOverlay";

export function BuildLogApp() {
  return (
    <AppProvider>
      <SmoothScroll />
      <Header />

      <div className="mx-auto flex w-full max-w-6xl">
        {/* Explorer: PC のみ固定 */}
        <aside className="sticky top-12 hidden h-[calc(100vh-3rem)] w-60 shrink-0 overflow-y-auto border-r border-line px-3 py-6 md:block">
          <Explorer />
        </aside>

        <main className="min-w-0 flex-1 px-5 sm:px-10 lg:px-14">
          <Hero />
          <BuildHistory />
          <Journey />
          <CareerSnapshot />
          <FeaturedBuilds />
          <BuildArchive />
          <TechMap />
          <Lessons />
          <CurrentBuild />
          <NextBuild />
          <Contact />
        </main>
      </div>

      <MobileDrawer />
      <BuildDetailModal />
      <CommandPalette />
      <ShortcutsOverlay />
    </AppProvider>
  );
}
