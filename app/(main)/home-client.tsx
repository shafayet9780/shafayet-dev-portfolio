"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

interface SiteSettings {
  mainName?: string | null;
  jobTitle?: string | null;
  headerText?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  secondaryCtaText?: string | null;
  secondaryCtaLink?: string | null;
  bio?: string | null;
}

interface Project {
  title: string;
  slug?: { current: string };
  description?: string;
  imageUrl?: string;
  tags?: string[];
}

const capabilityAreas = [
  {
    title: "Technical Leadership",
    body: "Team direction, delivery planning, code review culture, and execution clarity.",
    uses: "Planning, mentoring, reviews, delivery rhythm",
  },
  {
    title: "System Architecture",
    body: "Service boundaries, data modeling, scalability, maintainability, and tradeoff decisions.",
    uses: "Node.js, APIs, data flow, system design",
  },
  {
    title: "DevOps & Reliability",
    body: "CI/CD, deployment strategy, infrastructure thinking, monitoring, and release confidence.",
    uses: "CI/CD, cloud platforms, automation, observability",
  },
  {
    title: "Product Engineering",
    body: "Full stack delivery, frontend systems, CMS architecture, and UX-minded implementation.",
    uses: "Next.js, React, TypeScript, Sanity",
  },
];

function getProjectHref(project: Project) {
  const slug = project.slug?.current?.replace(/^\/+/, "");
  return slug ? `/projects/${slug}` : "/projects";
}

function CapabilityCard({
  title,
  body,
  uses,
  index,
}: {
  title: string;
  body: string;
  uses: string;
  index: number;
}) {
  return (
    <motion.article
      className="group relative overflow-hidden rounded-lg border border-(--explorer-border) bg-(--article-bg) p-5 shadow-lg transition-colors hover:border-(--accent-color)"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-(--accent-color) to-transparent opacity-0 transition-opacity group-hover:opacity-70" />
      <p className="font-mono text-xs text-(--accent-color)">
        capability.{String(index + 1).padStart(2, "0")}
      </p>
      <h3 className="mt-4 text-xl font-bold text-(--text-color)">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-(--text-color) opacity-70">
        {body}
      </p>
      <p className="mt-5 border-t border-(--explorer-border) pt-4 font-mono text-[11px] leading-5 text-(--text-color) opacity-55">
        <span className="text-(--accent-color)">Uses:</span> {uses}
      </p>
    </motion.article>
  );
}

function WorkstationVisual() {
  return (
    <motion.div
      className="relative min-h-[390px] overflow-hidden rounded-lg border border-(--explorer-border) bg-(--article-bg) shadow-2xl"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(var(--accent-rgb),0.18),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.055),transparent_42%)]" />
      <div className="absolute inset-0 workstation-grid opacity-30" />

      <div className="relative flex h-10 items-center justify-between border-b border-(--explorer-border) bg-(--titlebar-bg)/80 px-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28ca41]" />
        </div>
        <p className="font-mono text-xs text-(--text-color) opacity-60">
          architecture-brief.md
        </p>
      </div>

      <div className="relative flex min-h-[350px] flex-col justify-between p-5 sm:p-7">
        <div className="rounded-md border border-(--explorer-border) bg-(--main-bg)/72 p-5 backdrop-blur">
          <div className="mb-5 flex flex-col gap-4 border-b border-(--explorer-border) pb-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-mono text-xs text-(--accent-color)">
                # architecture-brief.md
              </p>
              <h2 className="mt-2 text-2xl font-bold text-(--text-color)">
                Engineering command center
              </h2>
            </div>
            <span className="w-fit rounded-md border border-(--accent-color) px-2 py-1 font-mono text-[10px] text-(--accent-color)">
              review.ready
            </span>
          </div>

          <div className="space-y-5">
            <div>
              <p className="font-mono text-[11px] uppercase text-(--text-color) opacity-45">
                Role
              </p>
              <p className="mt-2 text-sm leading-6 text-(--text-color) opacity-80">
                Engineering leadership across product, platform, and delivery.
              </p>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase text-(--text-color) opacity-45">
                Focus
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  "System architecture",
                  "DevOps reliability",
                  "Team execution",
                  "Product engineering",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-md border border-(--explorer-border) bg-(--article-bg)/65 px-3 py-2 font-mono text-xs text-(--text-color) opacity-75"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3 border-t border-(--explorer-border) pt-4 sm:grid-cols-3">
              {[
                ["mode", "clarity under complexity"],
                ["signal", "risk.reduced"],
                ["outcome", "fewer surprises"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="font-mono text-[10px] uppercase text-(--accent-color)">
                    {label}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-(--text-color) opacity-70">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {["delivery.clear", "systems.scalable", "teams.aligned"].map(
            (signal) => (
              <span
                key={signal}
                className="rounded-full border border-(--explorer-border) bg-(--main-bg)/55 px-3 py-1.5 font-mono text-[11px] text-(--text-color) opacity-65"
              >
                {signal}
              </span>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ProjectPreview({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      className="group overflow-hidden rounded-lg border border-(--explorer-border) bg-(--article-bg) shadow-lg transition-colors hover:border-(--accent-color)"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
    >
      <Link href={getProjectHref(project)} className="block">
        <div className="relative h-48 overflow-hidden bg-(--explorer-hover-bg)">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-mono text-sm text-(--text-color) opacity-45">
              case-study.preview
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-(--article-bg) via-transparent to-transparent" />
        </div>
        <div className="p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {(project.tags?.length ? project.tags : ["Architecture", "Delivery"]).map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-(--explorer-border) px-2 py-1 font-mono text-[11px] text-(--text-color) opacity-70"
                >
                  {tag}
                </span>
              )
            )}
          </div>
          <h3 className="text-xl font-semibold text-(--text-color) group-hover:text-(--accent-color)">
            {project.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-(--text-color) opacity-70">
            {project.description ||
              "A selected case study from the engineering workspace."}
          </p>
          <p className="mt-5 font-mono text-xs text-(--accent-color)">
            Read case study
          </p>
        </div>
      </Link>
    </motion.article>
  );
}

function HandoffPanel() {
  return (
    <section className="relative py-14">
      <div className="grid gap-5 rounded-lg border border-(--explorer-border) bg-(--article-bg) p-5 shadow-xl lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="font-mono text-xs text-(--accent-color)">
            contact.handoff
          </p>
          <h2 className="mt-3 text-3xl font-bold text-(--text-color)">
            Need senior technical direction?
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-(--text-color) opacity-70">
            Bring the architecture question, delivery risk, team execution gap,
            or product engineering challenge. I work best where systems,
            people, and shipping pressure meet.
          </p>
        </div>
        <Link
          href="/contact"
          className="w-fit rounded-md border border-(--accent-color) px-5 py-3 text-sm font-semibold text-(--accent-color) transition-colors hover:bg-[rgba(var(--accent-rgb),0.1)]"
        >
          Start a Conversation
        </Link>
      </div>
    </section>
  );
}

export default function HomePage({
  siteSettings = {},
  projects = [],
}: {
  siteSettings?: SiteSettings;
  projects?: Project[];
}) {
  const mainName = siteSettings?.mainName || "Shafayet Ahmmed";
  const legacyJobTitles = ["Full Stack Developer & DevOps Engineer"];
  const legacyHeaderText = [
    "CREATIVE ENGINEER",
    "I Build Scalable Software Solutions",
    "I BUILD WEBSITES",
  ];
  const jobTitle =
    siteSettings?.jobTitle && !legacyJobTitles.includes(siteSettings.jobTitle)
      ? siteSettings.jobTitle
      : "Engineering Leader, Full Stack Architect & DevOps Specialist";
  const headerText =
    siteSettings?.headerText &&
    !legacyHeaderText.includes(siteSettings.headerText)
      ? siteSettings.headerText
      : "HELLO WORLD";
  const ctaText =
    siteSettings?.ctaText &&
    !["Explore", "Open Case Studies"].includes(siteSettings.ctaText)
      ? siteSettings.ctaText
      : "View Case Studies";
  const ctaLink = siteSettings?.ctaLink || "/projects";
  const secondaryCtaText =
    siteSettings?.secondaryCtaText &&
    siteSettings.secondaryCtaText !== "Contact Me"
      ? siteSettings.secondaryCtaText
      : "Start a Conversation";
  const secondaryCtaLink = siteSettings?.secondaryCtaLink || "/contact";
  const bio =
    siteSettings?.bio ||
    "I help teams design reliable systems, simplify complex architecture, and ship production software with clarity.";

  const openCommandCenter = () => {
    window.dispatchEvent(new Event("portfolio:open-command-center"));
  };

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 workstation-grid opacity-35" />
      <div className="pointer-events-none absolute right-0 top-0 h-[520px] w-[520px] rounded-full bg-[rgba(var(--accent-rgb),0.1)] blur-3xl" />

      <section className="relative grid min-h-[calc(100vh-170px)] items-center gap-14 py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-(--explorer-border) bg-(--article-bg)/80 px-4 py-2 font-mono text-xs text-(--text-color) shadow-lg">
            <span className="h-2 w-2 rounded-full bg-(--accent-color)" />
            {headerText}
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.98] text-(--text-color) sm:text-6xl lg:text-7xl">
            {mainName}
          </h1>

          <p className="mt-7 max-w-2xl font-mono text-xl font-semibold leading-tight text-(--accent-color) sm:text-2xl">
            {jobTitle}
          </p>
          <p className="mt-6 max-w-2xl text-base leading-8 text-(--text-color) opacity-[0.72] sm:text-lg">
            {bio}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href={ctaLink || "/projects"}
              className="group rounded-md border border-(--accent-color) bg-(--accent-color) px-5 py-3 text-sm font-semibold text-(--main-bg) shadow-[0_18px_45px_rgba(var(--accent-rgb),0.18)] transition-transform hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-3">
                <span className="flex flex-col leading-none">
                  <span>{ctaText}</span>
                  <span className="mt-1 font-mono text-[10px] font-medium opacity-70">
                    /projects
                  </span>
                </span>
                <span className="font-mono text-lg transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
            <Link
              href={secondaryCtaLink || "/contact"}
              className="group rounded-md border border-(--explorer-border) bg-(--article-bg)/55 px-5 py-3 text-sm font-semibold text-(--text-color) shadow-lg transition-colors hover:border-(--accent-color) hover:bg-(--explorer-hover-bg)"
            >
              <span className="flex items-center gap-3">
                <span className="flex flex-col leading-none">
                  <span>{secondaryCtaText}</span>
                  <span className="mt-1 font-mono text-[10px] font-medium opacity-50">
                    /contact
                  </span>
                </span>
                <span className="font-mono text-lg text-(--accent-color) opacity-70 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          </div>

          <button
            onClick={openCommandCenter}
            className="mt-8 font-mono text-xs text-(--text-color) opacity-55 transition-colors hover:text-(--accent-color) hover:opacity-100"
          >
            Press Cmd/Ctrl + K to explore the workspace
          </button>
        </motion.div>

        <WorkstationVisual />
      </section>

      <section id="capabilities" className="relative py-10">
        <div className="mb-7 max-w-3xl">
          <p className="font-mono text-xs text-(--accent-color)">
            capability.matrix
          </p>
          <h2 className="mt-3 text-3xl font-bold text-(--text-color)">
            Skills framed as applied engineering judgment.
          </h2>
          <p className="mt-4 text-sm leading-7 text-(--text-color) opacity-68">
            The stack matters, but the real value is knowing where it fits:
            leadership, architecture, reliability, and product delivery.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {capabilityAreas.map((capability, index) => (
            <CapabilityCard
              key={capability.title}
              title={capability.title}
              body={capability.body}
              uses={capability.uses}
              index={index}
            />
          ))}
        </div>
      </section>

      <section className="relative py-14">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs text-(--accent-color)">
              case-studies.directory
            </p>
            <h2 className="mt-2 text-3xl font-bold text-(--text-color)">
              Selected Case Studies
            </h2>
          </div>
          <Link
            href="/projects"
            className="font-mono text-sm text-(--accent-color) hover:underline"
          >
            view all case studies
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.slice(0, 3).map((project, index) => (
            <ProjectPreview
              key={project.slug?.current || project.title}
              project={project}
              index={index}
            />
          ))}
        </div>
      </section>

      <HandoffPanel />
    </div>
  );
}
