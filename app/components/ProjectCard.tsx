import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
  project: {
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
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const imageUrl = project.mainImage?.asset?.url;
  const slug = project.slug?.current?.replace(/^\/+/, '');
  const projectHref = slug ? `/projects/${slug}` : '/projects';
  const tags = project.tags?.length ? project.tags : ['Case Study'];
  
  return (
    <article className="group relative overflow-hidden rounded-lg border border-(--explorer-border) bg-(--article-bg) shadow-lg transition-colors hover:border-(--accent-color)">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-(--accent-color) to-transparent opacity-0 transition-opacity group-hover:opacity-70" />

      <Link href={projectHref} className="block">
        <div className="relative h-48 overflow-hidden bg-(--main-bg)">
          {imageUrl ? (
            <Image 
              src={imageUrl}
              alt={project.mainImage?.alt || project.title}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-(--main-bg)">
              <span className="font-mono text-sm text-(--text-color) opacity-40">
                preview.pending
              </span>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-(--main-bg)/65 via-transparent to-transparent" />
        </div>
      </Link>

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="truncate font-mono text-[11px] text-(--accent-color)">
            {project.role || 'case-study'}
          </p>
          <span className="h-2 w-2 rounded-full bg-(--accent-color) opacity-70" />
        </div>

        <Link href={projectHref}>
          <h3 className="text-xl font-bold leading-tight text-(--text-color) transition-colors hover:text-(--accent-color)">
            {project.title}
          </h3>
        </Link>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-(--text-color) opacity-70">
          {project.outcome || project.excerpt}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <span 
              key={tag} 
              className="rounded-full border border-(--explorer-border) px-2 py-1 font-mono text-[11px] text-(--text-color) opacity-65"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-(--explorer-border) pt-4">
          <Link
            href={projectHref}
            className="font-mono text-xs text-(--accent-color) hover:underline"
          >
            read case study
          </Link>
          {project.sourceCodeUrl && (
            <a
              href={project.sourceCodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-(--text-color) opacity-55 hover:text-(--accent-color) hover:opacity-100"
            >
              source
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-(--text-color) opacity-55 hover:text-(--accent-color) hover:opacity-100"
            >
              demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
