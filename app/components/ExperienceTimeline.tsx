"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export interface ExperienceProduct {
  name?: string;
  sector?: string;
  summary?: string;
  url?: string;
}

export interface ExperienceItem {
  _id: string;
  companyName: string;
  companyUrl?: string;
  role: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  location?: string;
  sectors?: string[];
  products?: ExperienceProduct[];
  scopeSummary?: string;
  proofPoints?: string[];
  outcomes?: string[];
  technologies?: string[];
  companyLogo?: {
    asset?: {
      url?: string;
    };
    alt?: string;
  };
}

function formatDate(value?: string) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatRange(experience: ExperienceItem) {
  const start = formatDate(experience.startDate);
  const end = experience.isCurrent ? "Present" : formatDate(experience.endDate);

  return [start, end].filter(Boolean).join(" - ");
}

function getPrimarySector(experience: ExperienceItem) {
  return (
    experience.sectors?.[0] ||
    experience.products?.find((product) => product.sector)?.sector ||
    "Product"
  );
}

function ExperienceLogo({ experience }: { experience: ExperienceItem }) {
  const imageUrl = experience.companyLogo?.asset?.url;

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-(--explorer-border) bg-(--main-bg)">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={experience.companyLogo?.alt || `${experience.companyName} logo`}
          width={48}
          height={48}
          className="h-full w-full object-contain p-1.5"
        />
      ) : (
        <span className="font-mono text-sm font-bold text-(--accent-color)">
          {experience.companyName.slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function EmptyTimeline() {
  return (
    <div className="rounded-lg border border-(--explorer-border) bg-(--article-bg) p-6 shadow-xl mt-8">
      <p className="font-mono text-xs text-(--accent-color)">
        experience.timeline
      </p>
      <h2 className="mt-3 text-2xl font-bold text-(--text-color)">
        Career systems map
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-(--text-color) opacity-70">
        Add experience entries in Sanity to show companies, sectors, products,
        scope, and senior engineering proof.
      </p>
    </div>
  );
}

function MobileExperienceCard({ experience }: { experience: ExperienceItem }) {
  return (
    <article className="rounded-lg border border-(--explorer-border) bg-(--article-bg) p-4 shadow-lg">
      <div className="flex gap-3">
        <ExperienceLogo experience={experience} />
        <div className="min-w-0">
          <p className="font-mono text-[11px] text-(--accent-color)">
            {formatRange(experience)}
          </p>
          <h3 className="mt-1 text-lg font-bold text-(--text-color)">
            {experience.companyName}
          </h3>
          <p className="mt-1 text-sm text-(--text-color) opacity-70">
            {experience.role}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[getPrimarySector(experience), ...(experience.sectors || []).slice(1, 3)]
          .filter(Boolean)
          .map((sector) => (
            <span
              key={sector}
              className="rounded-full border border-(--explorer-border) px-2 py-1 font-mono text-[10px] text-(--text-color) opacity-65"
            >
              {sector}
            </span>
          ))}
      </div>

      {experience.scopeSummary && (
        <p className="mt-4 text-sm leading-6 text-(--text-color) opacity-75">
          {experience.scopeSummary}
        </p>
      )}

      {experience.products?.length ? (
        <div className="mt-4 border-t border-(--explorer-border) pt-4">
          <p className="font-mono text-[10px] uppercase text-(--text-color) opacity-45">
            products
          </p>
          <div className="mt-2 space-y-2">
            {experience.products.slice(0, 2).map((product) => (
              <p
                key={product.name}
                className="text-xs leading-5 text-(--text-color) opacity-65"
              >
                <span className="font-semibold text-(--text-color)">
                  {product.name}
                </span>
                {product.sector ? ` / ${product.sector}` : ""}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

export function ExperienceTimeline({
  experiences,
}: {
  experiences: ExperienceItem[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeExperience = experiences[activeIndex];
  const shouldReduceMotion = useReducedMotion();
  const yearRange = useMemo(() => {
    if (!experiences.length) return "pending";
    const years = experiences
      .flatMap((experience) => [
        experience.startDate?.slice(0, 4),
        experience.isCurrent ? new Date().getFullYear().toString() : experience.endDate?.slice(0, 4),
      ])
      .filter(Boolean) as string[];

    return `${Math.min(...years.map(Number))} - ${Math.max(...years.map(Number))}`;
  }, [experiences]);

  if (!experiences.length) {
    return <EmptyTimeline />;
  }

  return (
    <section id="experience" className="relative mt-8 scroll-mt-12">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs text-(--accent-color)">
            experience.timeline
          </p>
          <h2 className="mt-3 text-3xl font-bold text-(--text-color)">
            Career systems map
          </h2>
        </div>
        <p className="font-mono text-xs text-(--text-color) opacity-45">
          {yearRange} / {experiences.length} roles
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(300px,0.72fr)_minmax(0,1fr)]">
        <div className="hidden rounded-lg border border-(--explorer-border) bg-(--article-bg) p-2 shadow-xl lg:block">
          {experiences.map((experience, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={experience._id}
                type="button"
                className={`group w-full rounded-md border px-3 py-3 text-left transition-[border-color,background-color,transform] hover:-translate-y-0.5 ${
                  isActive
                    ? "border-(--accent-color) bg-[rgba(var(--accent-rgb),0.1)]"
                    : "border-transparent hover:border-(--explorer-border) hover:bg-(--main-bg)/55"
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <div className="flex items-center gap-3">
                  <ExperienceLogo experience={experience} />
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] text-(--accent-color)">
                      {formatRange(experience)}
                    </p>
                    <h3 className="truncate text-base font-semibold text-(--text-color)">
                      {experience.companyName}
                    </h3>
                    <p className="truncate text-xs text-(--text-color) opacity-60">
                      {experience.role}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="premium-panel signature-scan relative hidden overflow-hidden rounded-lg border border-(--explorer-border) bg-(--article-bg) shadow-2xl lg:block">
          <div className="flex h-10 items-center justify-between border-b border-(--explorer-border) bg-(--titlebar-bg)/85 px-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28ca41]" />
            </div>
            <p className="font-mono text-xs text-(--text-color) opacity-55">
              {activeExperience.companyName.toLowerCase().replace(/\s+/g, "-")}.experience.md
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeExperience._id}
              className="grid gap-5 p-5 xl:grid-cols-[1fr_220px]"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
            <div>
              <p className="font-mono text-xs text-(--accent-color)">
                {formatRange(activeExperience)}
              </p>
              <h3 className="mt-3 text-3xl font-bold text-(--text-color)">
                {activeExperience.companyName}
              </h3>
              <p className="mt-2 text-lg font-semibold text-(--accent-color)">
                {activeExperience.role}
              </p>
              {activeExperience.scopeSummary && (
                <p className="mt-5 text-sm leading-7 text-(--text-color) opacity-75">
                  {activeExperience.scopeSummary}
                </p>
              )}

              {activeExperience.products?.length ? (
                <div className="mt-6">
                  <p className="font-mono text-[10px] uppercase text-(--text-color) opacity-45">
                    products
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {activeExperience.products.map((product) => (
                      <div
                        key={product.name}
                        className="rounded-md border border-(--explorer-border) bg-(--main-bg)/55 p-3"
                      >
                        <p className="font-semibold text-(--text-color)">
                          {product.name}
                        </p>
                        {product.sector && (
                          <p className="mt-1 font-mono text-[11px] text-(--accent-color)">
                            {product.sector}
                          </p>
                        )}
                        {product.summary && (
                          <p className="mt-2 text-xs leading-5 text-(--text-color) opacity-65">
                            {product.summary}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeExperience.proofPoints?.length ? (
                <div className="mt-6">
                  <p className="font-mono text-[10px] uppercase text-(--text-color) opacity-45">
                    proof
                  </p>
                  <div className="mt-3 grid gap-2">
                    {activeExperience.proofPoints.slice(0, 5).map((point) => (
                      <p
                        key={point}
                        className="rounded-md border border-(--explorer-border) bg-(--main-bg)/55 px-3 py-2 text-sm leading-6 text-(--text-color) opacity-75"
                      >
                        {point}
                      </p>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="rounded-md border border-(--explorer-border) bg-(--main-bg)/55 p-4">
              <ExperienceLogo experience={activeExperience} />
              <div className="mt-5 space-y-3">
                {[
                  ["sector", getPrimarySector(activeExperience)],
                  ["type", activeExperience.employmentType || "Role"],
                  ["location", activeExperience.location || "Visible"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="border-b border-(--explorer-border) pb-3 last:border-b-0"
                  >
                    <p className="font-mono text-[10px] uppercase text-(--text-color) opacity-45">
                      {label}
                    </p>
                    <p className="mt-1 text-sm text-(--text-color) opacity-75">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {activeExperience.technologies?.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {activeExperience.technologies.slice(0, 8).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-(--explorer-border) px-2 py-1 font-mono text-[10px] text-(--text-color) opacity-65"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              ) : null}
            </aside>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="grid gap-4 lg:hidden">
          {experiences.map((experience) => (
            <MobileExperienceCard key={experience._id} experience={experience} />
          ))}
        </div>
      </div>
    </section>
  );
}
