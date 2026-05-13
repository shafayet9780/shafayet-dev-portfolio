import { client } from "@/studio/lib/client";
import Image from "next/image";
import { FaCode, FaServer } from "react-icons/fa";
import {
  SiFigma,
  SiGithubactions,
  SiNextdotjs,
  SiNodedotjs,
  SiReact,
  SiTypescript,
  SiPython,
  SiGo,
  SiDjango,
} from "react-icons/si";
import type { IconType } from "react-icons";
import {
  ExperienceTimeline,
  type ExperienceItem,
} from "@/app/components/ExperienceTimeline";
import { JsonLd } from "@/app/components/JsonLd";
import {
  createPageMetadata,
  graphJsonLd,
  personJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "About Shafayet Ahmmed",
  description:
    "Leadership profile for Shafayet Ahmmed, focused on architecture clarity, team execution, DevOps maturity, and reliable delivery.",
  path: "/about",
});

interface AboutData {
  mainName?: string;
  jobTitle?: string;
  description?: string;
  aboutTitle?: string;
  aboutContent?: string;
  skills?: string[];
  profileImage?: {
    asset?: {
      url?: string;
    };
    alt?: string;
  };
  aboutImage?: {
    asset?: {
      url?: string;
    };
    alt?: string;
  };
}

const fallbackSkills = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "Django",
  "Go",
  "DevOps",
  "CI/CD",
  "Architecture",
];

const workflow = [
  "Clarify the risk and decision surface",
  "Shape architecture and ownership",
  "Guide tradeoffs through review",
  "Stabilize delivery discipline",
];

function textOrFallback(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

function getSkillIcon(skill: string): IconType {
  const normalized = skill.toLowerCase();

  if (normalized.includes("next")) return SiNextdotjs;
  if (normalized.includes("react")) return SiReact;
  if (normalized.includes("type")) return SiTypescript;
  if (normalized.includes("node")) return SiNodedotjs;
  if (normalized.includes("python")) return SiPython;
  if (normalized.includes("django")) return SiDjango;
  if (normalized.includes("go")) return SiGo;
  if (normalized.includes("ci") || normalized.includes("cd")) return SiGithubactions;
  if (normalized.includes("devops")) return FaServer;
  if (normalized.includes("architecture")) return FaServer;
  if (normalized.includes("ux") || normalized.includes("product")) return SiFigma;

  return FaCode;
}

async function getData() {
  const aboutData = await client.fetch<AboutData | null>(`
    *[_type == "siteSettings"][0] {
      mainName,
      jobTitle,
      description,
      aboutTitle,
      aboutContent,
      profileImage {
        asset->{
          url
        },
        alt
      },
      aboutImage {
        asset->{
          url
        },
        alt
      },
      skills
    }
  `);

  const experiences = await client.fetch<ExperienceItem[]>(`
    *[_type == "experience"] | order(startDate desc, orderRank asc) {
      _id,
      companyName,
      companyUrl,
      role,
      employmentType,
      startDate,
      endDate,
      isCurrent,
      location,
      sectors,
      products[] {
        name,
        sector,
        summary,
        url
      },
      scopeSummary,
      proofPoints,
      outcomes,
      technologies,
      companyLogo {
        asset->{
          url
        },
        alt
      }
    }
  `);
  
  return { aboutData, experiences };
}

export default async function AboutPage() {
  const { aboutData, experiences } = await getData();
  const skills = aboutData?.skills?.length ? aboutData.skills : fallbackSkills;
  const image = aboutData?.aboutImage || aboutData?.profileImage;
  const title = textOrFallback(
    aboutData?.aboutTitle || aboutData?.mainName,
    "Shafayet Ahmmed"
  );
  const legacyDescription =
    "Full-stack developer and DevOps engineer building polished, maintainable web products with a strong sense of product direction.";
  const description = textOrFallback(
    aboutData?.description === legacyDescription
      ? undefined
      : aboutData?.description,
    "Engineering leader focused on architecture clarity, team execution, and reliable delivery."
  );
  const legacyJobTitle = "Full Stack Developer & DevOps Engineer";
  const jobTitle = textOrFallback(
    aboutData?.jobTitle === legacyJobTitle ? undefined : aboutData?.jobTitle,
    "Engineering Leader"
  );
  
  return (
    <div className="relative overflow-hidden pb-14">
      <JsonLd
        data={graphJsonLd([
          personJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ])}
      />
      <div className="pointer-events-none absolute inset-0 workstation-grid opacity-25" />
      <div className="pointer-events-none absolute right-8 top-10 h-64 w-64 rounded-full bg-[rgba(var(--accent-rgb),0.12)] blur-3xl" />

      <section className="relative grid gap-8 py-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <p className="font-mono text-xs text-(--accent-color)">
            profile/leadership.operator
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.02] tracking-normal text-(--text-color) sm:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-(--text-color) opacity-70">
            {description}
          </p>
        </div>

        <aside className="overflow-hidden rounded-lg border border-(--explorer-border) bg-(--article-bg) shadow-xl">
          <div className="flex h-10 items-center justify-between border-b border-(--explorer-border) bg-(--titlebar-bg)/85 px-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28ca41]" />
            </div>
            <p className="font-mono text-xs text-(--text-color) opacity-55">
              identity.card
            </p>
          </div>
          <div className="p-4">
            <div className="relative mx-auto aspect-square max-w-[230px] overflow-hidden rounded-lg border border-(--explorer-border) bg-(--main-bg)">
              {image?.asset?.url ? (
                <Image
                  src={image.asset.url}
                  alt={image.alt || aboutData?.mainName || "Profile portrait"}
                  fill
                  sizes="230px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center font-mono text-xs text-(--text-color) opacity-45">
                  portrait.pending
                </div>
              )}
            </div>
            <div className="mt-5 space-y-3 font-mono text-xs">
              <div className="flex justify-between gap-4 border-b border-(--explorer-border) pb-2">
                <span className="text-(--text-color) opacity-45">role</span>
                <span className="text-right text-(--accent-color)">
                  {jobTitle}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-b border-(--explorer-border) pb-2">
                <span className="text-(--text-color) opacity-45">focus</span>
                <span className="text-right text-(--text-color) opacity-75">
                  Architecture, reliability, teams
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-(--text-color) opacity-45">mode</span>
                <span className="text-right text-(--text-color) opacity-75">
                  Clarity first
                </span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="relative mt-4 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.55fr)]">
        <div className="rounded-lg border border-(--explorer-border) bg-(--article-bg) p-5 shadow-xl">
          <p className="font-mono text-xs text-(--accent-color)">
            leadership-profile.md
          </p>
          <h2 className="mt-3 text-3xl font-bold text-(--text-color)">
            How I lead technical work
          </h2>
          {aboutData?.aboutContent ? (
            <div
              className="project-portable mt-5 max-w-3xl"
              dangerouslySetInnerHTML={{ __html: aboutData.aboutContent }}
            />
          ) : (
            <p className="mt-5 max-w-3xl text-sm leading-7 text-(--text-color) opacity-70">
              I work across architecture, delivery, and team execution. The
              goal is a system that is easier to understand, safer to change,
              and calmer to ship.
            </p>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {workflow.map((item, index) => (
              <div
                key={item}
                className="rounded-md border border-(--explorer-border) bg-(--main-bg)/55 p-3"
              >
                <p className="font-mono text-xs text-(--accent-color)">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 text-sm leading-6 text-(--text-color) opacity-75">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-lg border border-(--explorer-border) bg-(--article-bg) p-5 shadow-xl">
          <p className="font-mono text-xs text-(--accent-color)">
            stack.lock
          </p>
          <h2 className="mt-3 text-2xl font-bold text-(--text-color)">
            Tools and systems I reach for
          </h2>
          <div className="mt-5 grid gap-2">
            {skills.map((skill) => {
              const Icon = getSkillIcon(skill);

              return (
                <div
                  key={skill}
                  className="group flex items-center gap-3 rounded-md border border-(--explorer-border) bg-(--main-bg)/55 px-3 py-2 transition-colors hover:border-(--accent-color)"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-md border border-(--explorer-border) bg-(--article-bg) text-(--accent-color)">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs text-(--text-color) opacity-75 group-hover:opacity-95">
                    {skill}
                  </span>
                </div>
              );
            })}
          </div>
        </aside>
      </section>

      <ExperienceTimeline experiences={experiences} />
    </div>
  );
}
