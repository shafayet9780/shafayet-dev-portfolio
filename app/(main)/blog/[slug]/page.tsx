import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type {
  PortableTextBlock,
  PortableTextComponents,
} from "@portabletext/react";
import type { Metadata } from "next";
import { client } from "@/studio/lib/client";
import { JsonLd } from "@/app/components/JsonLd";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  createPageMetadata,
  graphJsonLd,
  personJsonLd,
} from "@/lib/seo";

interface PostDetail {
  title: string;
  _updatedAt?: string;
  slug?: { current: string };
  excerpt?: string;
  publishedAt?: string;
  categories?: string[];
  author?: {
    name?: string;
  };
  body?: PortableTextBlock[];
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  mainImage?: {
    asset?: {
      url?: string;
    };
    alt?: string;
  };
}

interface PortableImageValue {
  asset?: {
    url?: string;
  };
  alt?: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

const POST_QUERY = `
  *[_type == "post" && slug.current in [$slug, $slashSlug]][0] {
    title,
    _updatedAt,
    slug,
    excerpt,
    publishedAt,
    author->{
      name
    },
    "categories": categories[]->title,
    viewCount,
    likeCount,
    commentCount,
    mainImage {
      asset->{
        url
      },
      alt
    },
    body[]{
      ...,
      _type == "image" => {
        ...,
        asset->{
          url
        }
      },
      markDefs[]{
        ...
      }
    }
  }
`;

const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="mt-10 text-4xl font-black leading-tight text-(--text-color)">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-9 text-3xl font-bold leading-tight text-(--text-color)">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-2xl font-semibold leading-tight text-(--text-color)">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-7 text-xl font-semibold leading-tight text-(--text-color)">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-(--accent-color) bg-(--article-bg) px-5 py-4 text-(--text-color) opacity-80">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="mt-5 text-base leading-8 text-(--text-color) opacity-75">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-5 list-disc space-y-2 pl-6 text-(--text-color) opacity-75">
        {children}
      </ul>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-8">{children}</li>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const isExternal = href.startsWith("http");

      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noreferrer noopener" : undefined}
          className="text-(--accent-color) underline underline-offset-4"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const image = value as PortableImageValue;

      if (!image.asset?.url) {
        return null;
      }

      return (
        <div className="relative my-8 aspect-[16/9] overflow-hidden rounded-lg border border-(--explorer-border) bg-(--article-bg)">
          <Image
            src={image.asset.url}
            alt={image.alt || ""}
            fill
            sizes="(min-width: 1024px) 70vw, 100vw"
            className="object-cover"
          />
        </div>
      );
    },
  },
};

async function getPost(slug: string) {
  return client.fetch<PostDetail | null>(POST_QUERY, {
    slug,
    slashSlug: `/${slug}`,
  });
}

function formatDate(date?: string) {
  if (!date) {
    return "Draft note";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function estimateReadMinutes(blocks?: PortableTextBlock[]) {
  if (!blocks?.length) {
    return 2;
  }

  const words = blocks
    .filter((block) => block._type === "block")
    .flatMap((block) => block.children || [])
    .map((child) => ("text" in child ? child.text : ""))
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(2, Math.ceil(words / 220));
}

export async function generateStaticParams() {
  const slugs = await client.withConfig({ useCdn: false }).fetch<string[]>(
    `*[_type == "post" && defined(slug.current)][].slug.current`
  );

  return slugs.map((slug) => ({
    slug: slug.replace(/^\/+/, ""),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    ...createPageMetadata({
      title: post.title,
      description: post.excerpt || "A technical field note by Shafayet Ahmmed.",
      path: `/blog/${slug}`,
      type: "article",
      image: post.mainImage?.asset?.url,
    }),
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const readMinutes = estimateReadMinutes(post.body);
  const categories = post.categories?.length ? post.categories : ["Field Note"];
  const description = post.excerpt || "A technical field note by Shafayet Ahmmed.";
  const postPath = `/blog/${post.slug?.current?.replace(/^\/+/, "") || slug}`;

  return (
    <article className="relative overflow-hidden pb-14">
      <JsonLd
        data={graphJsonLd([
          personJsonLd(),
          articleJsonLd({
            title: post.title,
            description,
            path: postPath,
            publishedAt: post.publishedAt,
            updatedAt: post._updatedAt,
            image: post.mainImage?.asset?.url,
            authorName: post.author?.name || "Shafayet Ahmmed",
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: postPath },
          ]),
        ])}
      />
      <div className="pointer-events-none absolute inset-0 workstation-grid opacity-25" />
      <div className="pointer-events-none absolute right-6 top-10 h-64 w-64 rounded-full bg-[rgba(var(--accent-rgb),0.12)] blur-3xl" />

      <section className="relative grid gap-8 py-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <Link
            href="/blog"
            className="font-mono text-xs text-(--accent-color) hover:underline"
          >
            ../blog
          </Link>

          <p className="mt-6 font-mono text-xs text-(--accent-color)">
            notes/{post.slug?.current?.replace(/^\/+/, "") || slug}.md
          </p>
          <h1 className="mt-5 max-w-5xl text-4xl font-black leading-[1.02] tracking-normal text-(--text-color) sm:text-6xl">
            {post.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-(--text-color) opacity-70">
            {post.excerpt || "A technical note from the portfolio workspace."}
          </p>
        </div>

        <aside className="rounded-lg border border-(--explorer-border) bg-(--article-bg) p-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-(--explorer-border) pb-3">
            <p className="font-mono text-xs text-(--accent-color)">
              note.meta
            </p>
            <span className="rounded-full bg-[rgba(var(--accent-rgb),0.14)] px-2 py-1 font-mono text-[10px] text-(--accent-color)">
              READ
            </span>
          </div>
          <div className="mt-2 space-y-3 font-mono text-xs">
            <div className="flex justify-between gap-4 border-b border-(--explorer-border) py-2">
              <span className="text-(--text-color) opacity-45">date</span>
              <span className="text-right text-(--text-color) opacity-75">
                {formatDate(post.publishedAt)}
              </span>
            </div>
            <div className="flex justify-between gap-4 border-b border-(--explorer-border) py-2">
              <span className="text-(--text-color) opacity-45">author</span>
              <span className="text-right text-(--text-color) opacity-75">
                {post.author?.name || "Shafayet Ahmmed"}
              </span>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <span className="text-(--text-color) opacity-45">read</span>
              <span className="text-right text-(--text-color) opacity-75">
                {readMinutes} min
              </span>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-(--explorer-border) px-2 py-1 font-mono text-[11px] text-(--text-color) opacity-70"
              >
                {category}
              </span>
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
            article.preview
          </p>
        </div>
        <div className="relative aspect-[16/7] min-h-[260px] bg-(--main-bg)">
          {post.mainImage?.asset?.url ? (
            <Image
              src={post.mainImage.asset.url}
              alt={post.mainImage.alt || post.title}
              fill
              priority
              sizes="(min-width: 1024px) 75vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-8 text-center font-mono text-sm text-(--text-color) opacity-45">
              article.preview.pending
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-(--main-bg)/70 via-transparent to-transparent" />
        </div>
      </section>

      <section className="relative mt-8 grid gap-8 lg:grid-cols-[minmax(0,760px)_minmax(240px,1fr)]">
        <div className="rounded-lg border border-(--explorer-border) bg-(--article-bg) p-5 shadow-xl sm:p-8">
          <p className="font-mono text-xs text-(--accent-color)">
            body.portable-text
          </p>
          <div className="mt-4">
            {post.body?.length ? (
              <PortableText
                value={post.body}
                components={portableTextComponents}
                onMissingComponent={false}
              />
            ) : (
              <p className="text-sm leading-7 text-(--text-color) opacity-70">
                Add Portable Text content in Sanity to complete this field note.
              </p>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-(--explorer-border) bg-(--article-bg) p-5 shadow-xl">
          <p className="font-mono text-xs text-(--accent-color)">
            reader.status
          </p>
          <div className="mt-5 space-y-3 font-mono text-xs text-(--text-color) opacity-65">
            <p>views: {post.viewCount || 0}</p>
            <p>likes: {post.likeCount || 0}</p>
            <p>comments: {post.commentCount || 0}</p>
          </div>
          <Link
            href="/blog"
            className="mt-6 inline-flex font-mono text-xs text-(--accent-color) hover:underline"
          >
            back to notes
          </Link>
        </aside>
      </section>
    </article>
  );
}
