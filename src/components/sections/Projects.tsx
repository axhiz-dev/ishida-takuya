"use client";

import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tilt3D } from "@/components/ui/Tilt3D";
import { projects } from "@/data/projects";

export function Projects() {
  return (
    <section id="projects" className="relative bg-bg-alt py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Selected works" title="制作実績" watermark="Works" />

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              data-testid="project-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
            >
              <Tilt3D className="h-full">
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-surface/70 p-7">
                  {/* アクセントのグロー */}
                  <div
                    aria-hidden="true"
                    className={`absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${project.accent} opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40`}
                  />

                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs text-brand-cyan">
                        {project.category}
                      </p>
                      <h3 className="mt-2 font-display text-xl font-bold text-ink">
                        {project.title}
                      </h3>
                    </div>
                    <span className="font-mono text-sm text-ink-faint">
                      {project.year}
                    </span>
                  </div>

                  <p className="relative mt-4 flex-1 text-sm leading-relaxed text-ink-muted">
                    {project.description}
                  </p>

                  <div className="relative mt-5 flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-white/8 bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-ink-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {project.links && project.links.length > 0 && (
                    <div className="relative mt-5 flex flex-wrap gap-4 border-t border-white/5 pt-4">
                      {project.links.map((link) => {
                        const isExternal = link.href.startsWith("http");
                        return (
                          <a
                            key={link.label}
                            href={link.href}
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noopener noreferrer" : undefined}
                            className="group/link inline-flex items-center gap-1 text-sm font-medium text-ink transition-colors hover:text-brand-cyan"
                          >
                            {link.label}
                            <span className="transition-transform group-hover/link:translate-x-0.5">
                              →
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Tilt3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
