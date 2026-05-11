import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { client } from "@/studio/lib/client";

interface ProjectProcessStep {
  _key?: string;
  title?: string;
  description?: string;
}

interface ProjectDetail {
  title: string;
  slug?: { current: string };
  excerpt?: string;
  role?: string;
  problem?: string;
  approach?: string;
  outcome?: string;
  highlights?: string[];
  process?: ProjectProcessStep[];
  body?: PortableTextBlock[];
  tags?: string[];
  sourceCodeUrl?: string;
  demoUrl?: string;
  mainImage?: {
    asset?: {
      url?: string;
    };
    alt?: string;
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

const PROJECT_QUERY = `
  *[_type == "project" && slug.current in [$slug, $slashSlug]][0] {
    title,
    slug,
    excerpt,
    role,
    problem,
    approach,
    outcome,
    highlights,
    process[] {
      _key,
      title,
      description
    },
    body,
    sourceCodeUrl,
    demoUrl,
    "tags": categories[]->title,
    mainImage {
      asset->{
        url
      },
      alt
    }
  }
`;

async function getProject(slug: string) {
  return client.fetch<ProjectDetail | null>(PROJECT_QUERY, {
    slug,
    slashSlug: `/${slug}`,
  });
}

export async function generateStaticParams() {
  const slugs = await client.withConfig({ useCdn: false }).fetch<string[]>(
    `*[_type == "project" && defined(slug.current)][].slug.current`
  );

  return slugs.map((slug) => ({
    slug: slug.replace(/^\/+/, ""),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project not found",
    };
  }

  return {
    title: `${project.title} | Shafayet Ahmmed`,
    description:
      project.excerpt ||
      project.problem ||
      "A focused engineering case study by Shafayet Ahmmed.",
  };
}

function DetailBlock({
  label,
  title,
  body,
  index,
}: {
  label: string;
  title: string;
  body?: string;
  index: number;
}) {
  return (
    <section className="group relative overflow-hidden rounded-lg border border-(--explorer-border) bg-(--article-bg) p-5 shadow-lg transition-colors hover:border-(--accent-color)">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-(--accent-color) to-transparent opacity-0 transition-opacity group-hover:opacity-70" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-(--accent-color)">{label}</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight text-(--text-color)">
            {title}
          </h2>
        </div>
        <span className="font-mono text-xs text-(--text-color) opacity-35">
          {String(index).padStart(2, "0")}
        </span>
      </div>
      <p className="mt-5 text-sm leading-7 text-(--text-color) opacity-70">
        {body || "Add this proof point in Sanity when the evidence is ready."}
      </p>
    </section>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[88px_1fr] gap-3 border-b border-(--explorer-border) py-3 last:border-b-0">
      <p className="font-mono text-[11px] uppercase text-(--text-color) opacity-45">
        {label}
      </p>
      <p className="text-sm font-medium text-(--text-color)">{value}</p>
    </div>
  );
}

function LinkButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  const isPrimary = variant === "primary";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={
        isPrimary
          ? "rounded-md bg-(--accent-color) px-5 py-3 text-sm font-semibold text-(--main-bg) transition-transform hover:-translate-y-0.5"
          : "rounded-md border border-(--accent-color) px-5 py-3 text-sm font-semibold text-(--accent-color) hover:bg-[rgba(var(--accent-rgb),0.1)]"
      }
    >
      {children}
    </a>
  );
}

function normalizeProjectHref(project?: ProjectDetail) {
  const slug = project?.slug?.current?.replace(/^\/+/, "");
  return slug ? `/projects/${slug}` : "/projects";
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const highlights = project.highlights?.length
    ? project.highlights
    : [
        project.role ? `Role: ${project.role}` : "Technical direction and implementation",
        "Architecture decisions",
        "Production confidence",
      ];

  const process = project.process?.length
    ? project.process
    : [
        {
          _key: "frame",
          title: "Frame",
          description:
            project.problem || "Clarified risk, users, constraints, and delivery pressure.",
        },
        {
          _key: "decide",
          title: "Decide",
          description:
            project.approach ||
            "Chose a maintainable path through the technical tradeoffs.",
        },
        {
          _key: "ship",
          title: "Ship",
          description:
            project.outcome || "Prepared the result for real visitors and future iteration.",
        },
      ];

  const tags = project.tags?.length ? project.tags : ["Next.js", "Sanity"];
  const visibleTags = tags.slice(0, 4);
  const visibleHighlights = highlights.slice(0, 3);
  const heroAlt = project.mainImage?.alt || `${project.title} case study preview`;

  return (
    <article className="relative overflow-hidden pb-14">
      <div className="pointer-events-none absolute inset-0 workstation-grid opacity-25" />
      <div className="pointer-events-none absolute right-0 top-10 h-72 w-72 rounded-full bg-[rgba(var(--accent-rgb),0.13)] blur-3xl" />

      <section className="relative grid gap-8 py-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <Link
            href="/projects"
            className="font-mono text-xs text-(--accent-color) hover:underline"
          >
            ../projects
          </Link>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-(--explorer-border) bg-(--article-bg) px-4 py-2 font-mono text-xs text-(--text-color) shadow-lg">
            <span className="h-2 w-2 rounded-full bg-(--accent-color) shadow-[0_0_18px_rgba(var(--accent-rgb),0.9)]" />
            {project.role || "Case study"}
          </div>

          <h1 className="mt-5 max-w-5xl text-4xl font-black leading-[0.98] tracking-normal text-(--text-color) sm:text-6xl">
            {project.title}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-(--text-color) opacity-[0.72]">
            {project.excerpt ||
              "A focused case study from Shafayet's engineering workspace."}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.demoUrl && (
              <LinkButton href={project.demoUrl}>Open live demo</LinkButton>
            )}
            {project.sourceCodeUrl && (
              <LinkButton href={project.sourceCodeUrl} variant="secondary">
                Source code
              </LinkButton>
            )}
          </div>
        </div>

        <aside className="rounded-lg border border-(--explorer-border) bg-(--article-bg) p-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-(--explorer-border) pb-3">
            <p className="font-mono text-xs text-(--accent-color)">
              case-study.meta
            </p>
            <span className="rounded-full bg-[rgba(var(--accent-rgb),0.14)] px-2 py-1 font-mono text-[10px] text-(--accent-color)">
              READY
            </span>
          </div>
          <div className="mt-2">
            <MetaRow label="Role" value={project.role || "Technical direction"} />
            <MetaRow label="Stack" value={visibleTags.slice(0, 3).join(", ")} />
            <MetaRow
              label="Focus"
              value={project.outcome ? "Outcome-driven delivery" : "Architecture and delivery"}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-(--explorer-border) px-2 py-1 font-mono text-[11px] text-(--text-color) opacity-70"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            {visibleHighlights.map((highlight) => (
              <div
                key={highlight}
                className="rounded-md border border-(--explorer-border) bg-(--main-bg)/55 p-3 text-sm leading-6 text-(--text-color) opacity-75"
              >
                {highlight}
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="relative mt-4 overflow-hidden rounded-lg border border-(--explorer-border) bg-(--article-bg) shadow-2xl">
        <div className="flex h-10 items-center justify-between border-b border-(--explorer-border) bg-(--titlebar-bg)/85 px-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28ca41]" />
          </div>
          <p className="font-mono text-xs text-(--text-color) opacity-55">
            preview/{project.slug?.current?.replace(/^\/+/, "") || slug}
          </p>
        </div>

        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="relative aspect-[16/9] min-h-[260px] bg-(--main-bg)">
            {project.mainImage?.asset?.url ? (
              <Image
                src={project.mainImage.asset.url}
                alt={heroAlt}
                fill
                priority
                sizes="(min-width: 1024px) 65vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-8 text-center font-mono text-sm text-(--text-color) opacity-45">
                Add a strong project image in Sanity to complete this proof surface.
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-(--main-bg)/55 via-transparent to-transparent" />
          </div>

          <div className="border-t border-(--explorer-border) bg-(--main-bg)/55 p-5 lg:border-l lg:border-t-0">
            <p className="font-mono text-xs text-(--accent-color)">
              decision.trace
            </p>
            <div className="mt-5 space-y-4 font-mono text-xs leading-6">
              <p className="text-(--text-color) opacity-70">
                <span className="text-(--accent-color)">$</span> inspect --context
              </p>
              <p className="text-(--text-color) opacity-55">
                {project.problem ||
                  "Context and constraints can be authored in Sanity."}
              </p>
              <p className="text-(--text-color) opacity-70">
                <span className="text-(--accent-color)">$</span> verify --outcome
              </p>
              <p className="text-(--text-color) opacity-55">
                {project.outcome ||
                  "Outcome notes can be added when evidence is ready."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="relative mt-8 grid gap-5 lg:grid-cols-3">
        <DetailBlock
          index={1}
          label="context"
          title="Context and constraint"
          body={project.problem}
        />
        <DetailBlock
          index={2}
          label="direction"
          title="Technical direction"
          body={project.approach}
        />
        <DetailBlock
          index={3}
          label="outcome"
          title="What changed"
          body={project.outcome}
        />
      </div>

      <section className="relative mt-8 overflow-hidden rounded-lg border border-(--explorer-border) bg-(--article-bg) p-5 shadow-xl">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(var(--accent-rgb),0.08),transparent_32%)]" />
        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs text-(--accent-color)">
              process.timeline
            </p>
            <h2 className="mt-3 text-3xl font-bold text-(--text-color)">
              Execution path
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-(--text-color) opacity-60">
            How the work moved from ambiguity to direction, delivery, and
            evidence.
          </p>
        </div>

        <div className="relative mt-8 grid gap-4 md:grid-cols-3">
          <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-(--explorer-border) md:block" />
          {process.map((step, index) => (
            <div
              key={step._key || step.title || index}
              className="relative rounded-md border border-(--explorer-border) bg-(--main-bg)/80 p-5"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-(--accent-color) bg-(--article-bg) font-mono text-xs text-(--accent-color)">
                0{index + 1}
              </div>
              <h3 className="mt-3 text-lg font-semibold text-(--text-color)">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-(--text-color) opacity-70">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {project.body && (
        <section className="relative mt-8 rounded-lg border border-(--explorer-border) bg-(--article-bg) p-5 shadow-xl">
          <p className="font-mono text-xs text-(--accent-color)">
            notes.longform
          </p>
          <div className="project-portable mt-5 max-w-3xl text-(--text-color)">
            <PortableText value={project.body} />
          </div>
        </section>
      )}

      <div className="relative mt-8 flex flex-col gap-3 border-t border-(--explorer-border) pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-(--text-color) opacity-45">
          Case study route verified inside the portfolio workspace.
        </p>
        <Link
          href={normalizeProjectHref(project)}
          className="font-mono text-xs text-(--text-color) opacity-50"
        >
          {project.slug?.current || slug}
        </Link>
      </div>
    </article>
  );
}
