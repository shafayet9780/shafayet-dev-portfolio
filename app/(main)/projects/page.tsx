import Image from "next/image";
import Link from "next/link";
import { client } from "@/studio/lib/client";
import ProjectCard from "@/app/components/ProjectCard";
import { JsonLd } from "@/app/components/JsonLd";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  graphJsonLd,
} from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Engineering Case Studies",
  description:
    "Selected case studies from Shafayet Ahmmed, framed around architecture decisions, delivery constraints, technical direction, and outcomes.",
  path: "/projects",
});

interface Project {
  _id: string;
  title: string;
  excerpt: string;
  role?: string;
  outcome?: string;
  tags?: string[];
  mainImage?: {
    asset?: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  sourceCodeUrl?: string;
  demoUrl?: string;
  slug?: {
    current: string;
  };
}

async function getData() {
  const projects = await client.fetch<Project[]>(`
    *[_type == "project"] | order(_createdAt desc) {
      _id,
      title,
      excerpt,
      role,
      outcome,
      "tags": categories[]->title,
      mainImage {
        asset->{
          _id,
          url
        },
        alt
      },
      sourceCodeUrl,
      demoUrl,
      slug
    }
  `);
  
  return { projects };
}

function getProjectHref(project: Project) {
  const slug = project.slug?.current?.replace(/^\/+/, "");
  return slug ? `/projects/${slug}` : "/projects";
}

export default async function ProjectsPage() {
  const { projects } = await getData();
  const featuredProject = projects[0];
  const liveDemoCount = projects.filter((project) => project.demoUrl).length;
  const sourceCount = projects.filter((project) => project.sourceCodeUrl).length;
  
  return (
    <div className="relative overflow-hidden pb-14">
      <JsonLd
        data={graphJsonLd([
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
          ]),
        ])}
      />
      <div className="pointer-events-none absolute inset-0 workstation-grid opacity-25" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-[rgba(var(--accent-rgb),0.12)] blur-3xl" />

      <section className="relative grid gap-8 py-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <p className="font-mono text-xs text-(--accent-color)">
            case-studies/index
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.02] tracking-normal text-(--text-color) sm:text-6xl">
            Case studies with decisions exposed.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-(--text-color) opacity-70">
            Work samples framed around context, tradeoffs, technical direction,
            and what changed after shipping.
          </p>
        </div>

        <aside className="rounded-lg border border-(--explorer-border) bg-(--article-bg) p-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-(--explorer-border) pb-3">
            <p className="font-mono text-xs text-(--accent-color)">
              proof.surface
            </p>
            <span className="rounded-full bg-[rgba(var(--accent-rgb),0.14)] px-2 py-1 font-mono text-[10px] text-(--accent-color)">
              CURATED
            </span>
          </div>

          <div className="mt-3 divide-y divide-(--explorer-border)">
            <div className="grid grid-cols-[96px_1fr] gap-3 py-3">
              <p className="font-mono text-[10px] uppercase text-(--text-color) opacity-45">
                Cases
              </p>
              <p className="text-sm font-semibold text-(--text-color)">
                {projects.length} selected
              </p>
            </div>
            <div className="grid grid-cols-[96px_1fr] gap-3 py-3">
              <p className="font-mono text-[10px] uppercase text-(--text-color) opacity-45">
                Evidence
              </p>
              <p className="text-sm font-semibold text-(--text-color)">
                {liveDemoCount} demos / {sourceCount} repos
              </p>
            </div>
            <div className="grid grid-cols-[96px_1fr] gap-3 py-3">
              <p className="font-mono text-[10px] uppercase text-(--text-color) opacity-45">
                Mode
              </p>
              <p className="text-sm font-semibold text-(--text-color)">
                Decisions first
              </p>
            </div>
          </div>
        </aside>
      </section>

      {featuredProject && (
        <section className="relative mt-4 overflow-hidden rounded-lg border border-(--explorer-border) bg-(--article-bg) shadow-2xl">
          <div className="flex h-10 items-center justify-between border-b border-(--explorer-border) bg-(--titlebar-bg)/85 px-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28ca41]" />
            </div>
            <p className="font-mono text-xs text-(--text-color) opacity-55">
              lead.case-study
            </p>
          </div>

          <div className="grid gap-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)]">
            <div className="relative min-h-[320px] bg-(--main-bg)">
              {featuredProject.mainImage?.asset?.url ? (
                <Image
                  src={featuredProject.mainImage.asset.url}
                  alt={featuredProject.mainImage.alt || featuredProject.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex min-h-[320px] items-center justify-center px-8 text-center font-mono text-sm text-(--text-color) opacity-45">
                  Add a project image in Sanity to complete this featured panel.
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-(--main-bg)/65 via-transparent to-transparent" />
            </div>

            <div className="border-t border-(--explorer-border) p-6 lg:border-l lg:border-t-0">
              <p className="font-mono text-xs text-(--accent-color)">
                decision.file
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-(--text-color)">
                {featuredProject.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-(--text-color) opacity-70">
                {featuredProject.outcome ||
                  featuredProject.excerpt ||
                  "The lead case study in this portfolio workspace."}
              </p>

              <div className="mt-5 divide-y divide-(--explorer-border) border-y border-(--explorer-border)">
                <div className="grid grid-cols-[72px_1fr] gap-3 py-3">
                  <p className="font-mono text-[10px] uppercase text-(--text-color) opacity-45">
                    Role
                  </p>
                  <p className="text-sm text-(--text-color) opacity-75">
                    {featuredProject.role || "Technical direction"}
                  </p>
                </div>
                <div className="grid grid-cols-[72px_1fr] gap-3 py-3">
                  <p className="font-mono text-[10px] uppercase text-(--text-color) opacity-45">
                    Focus
                  </p>
                  <p className="text-sm text-(--text-color) opacity-75">
                    Architecture and delivery readiness
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={getProjectHref(featuredProject)}
                  className="rounded-md bg-(--accent-color) px-5 py-3 text-sm font-semibold text-(--main-bg) transition-transform hover:-translate-y-0.5"
                >
                  Read case study
                </Link>
                {featuredProject.demoUrl && (
                  <a
                    href={featuredProject.demoUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="rounded-md border border-(--accent-color) px-5 py-3 text-sm font-semibold text-(--accent-color) hover:bg-[rgba(var(--accent-rgb),0.1)]"
                  >
                    Live demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="relative mt-8">
        <div className="mb-4 flex items-end justify-between gap-4 border-b border-(--explorer-border) pb-3">
          <div>
            <p className="font-mono text-xs text-(--accent-color)">
              case-study.files
            </p>
            <h2 className="mt-2 text-2xl font-bold text-(--text-color)">
              Case study files
            </h2>
          </div>
          <p className="hidden font-mono text-xs text-(--text-color) opacity-45 sm:block">
            {projects.length} selected
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-(--explorer-border) bg-(--article-bg) p-8 text-center">
            <p className="font-mono text-xs text-(--accent-color)">
              no-projects.json
            </p>
            <p className="mt-3 text-sm text-(--text-color) opacity-70">
              Add case studies in Sanity to publish this proof surface.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
