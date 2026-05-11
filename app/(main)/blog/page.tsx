import Image from "next/image";
import Link from "next/link";
import { client } from "@/studio/lib/client";
import ArticleCard from "@/app/components/ArticleCard";

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  publishedAt?: string;
  categories?: string[];
  author?: {
    name?: string;
  };
  mainImage?: {
    asset?: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  slug: {
    current: string;
  };
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
}

async function getData() {
  const posts = await client.fetch<Post[]>(`
    *[_type == "post"] | order(publishedAt desc, _createdAt desc) {
      _id,
      title,
      excerpt,
      publishedAt,
      author->{
        name
      },
      "categories": categories[]->title,
      mainImage {
        asset->{
          _id,
          url
        },
        alt
      },
      slug,
      viewCount,
      likeCount,
      commentCount
    }
  `);
  
  return { posts };
}

function getPostHref(post: Post) {
  return `/blog/${post.slug.current.replace(/^\/+/, "")}`;
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

export default async function BlogPage() {
  const { posts } = await getData();
  const featuredPost = posts[0];
  const totalViews = posts.reduce(
    (total, post) => total + (post.viewCount || 0),
    0
  );
  const categories = Array.from(
    new Set(posts.flatMap((post) => post.categories || []))
  );
  
  return (
    <div className="relative overflow-hidden pb-14">
      <div className="pointer-events-none absolute inset-0 workstation-grid opacity-25" />
      <div className="pointer-events-none absolute right-6 top-10 h-64 w-64 rounded-full bg-[rgba(var(--accent-rgb),0.12)] blur-3xl" />

      <section className="relative grid gap-8 py-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <p className="font-mono text-xs text-(--accent-color)">
            notes/blog.index
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.02] tracking-normal text-(--text-color) sm:text-6xl">
            Field notes from the build room.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-(--text-color) opacity-70">
            Technical writing, product observations, CMS lessons, and frontend
            decisions captured as readable workspace notes.
          </p>
        </div>

        <aside className="rounded-lg border border-(--explorer-border) bg-(--article-bg) p-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-(--explorer-border) pb-3">
            <p className="font-mono text-xs text-(--accent-color)">
              notes.stats
            </p>
            <span className="rounded-full bg-[rgba(var(--accent-rgb),0.14)] px-2 py-1 font-mono text-[10px] text-(--accent-color)">
              SYNCED
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-md border border-(--explorer-border) bg-(--main-bg)/55 p-3">
              <p className="font-mono text-[10px] uppercase text-(--text-color) opacity-45">
                Notes
              </p>
              <p className="mt-2 text-2xl font-bold text-(--text-color)">
                {posts.length}
              </p>
            </div>
            <div className="rounded-md border border-(--explorer-border) bg-(--main-bg)/55 p-3">
              <p className="font-mono text-[10px] uppercase text-(--text-color) opacity-45">
                Views
              </p>
              <p className="mt-2 text-2xl font-bold text-(--text-color)">
                {totalViews}
              </p>
            </div>
            <div className="rounded-md border border-(--explorer-border) bg-(--main-bg)/55 p-3">
              <p className="font-mono text-[10px] uppercase text-(--text-color) opacity-45">
                Topics
              </p>
              <p className="mt-2 text-2xl font-bold text-(--text-color)">
                {categories.length}
              </p>
            </div>
            <div className="rounded-md border border-(--explorer-border) bg-(--main-bg)/55 p-3">
              <p className="font-mono text-[10px] uppercase text-(--text-color) opacity-45">
                Format
              </p>
              <p className="mt-2 text-2xl font-bold text-(--text-color)">
                Log
              </p>
            </div>
          </div>
        </aside>
      </section>

      {featuredPost && (
        <section className="relative mt-4 overflow-hidden rounded-lg border border-(--explorer-border) bg-(--article-bg) shadow-2xl">
          <div className="flex h-10 items-center justify-between border-b border-(--explorer-border) bg-(--titlebar-bg)/85 px-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28ca41]" />
            </div>
            <p className="font-mono text-xs text-(--text-color) opacity-55">
              latest.note
            </p>
          </div>

          <div className="grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.55fr)]">
            <div className="relative min-h-[300px] bg-(--main-bg)">
              {featuredPost.mainImage?.asset?.url ? (
                <Image
                  src={featuredPost.mainImage.asset.url}
                  alt={featuredPost.mainImage.alt || featuredPost.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex min-h-[300px] items-center justify-center px-8 text-center font-mono text-sm text-(--text-color) opacity-45">
                  article.preview.pending
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-(--main-bg)/70 via-transparent to-transparent" />
            </div>

            <div className="border-t border-(--explorer-border) p-6 lg:border-l lg:border-t-0">
              <p className="font-mono text-xs text-(--accent-color)">
                featured.article
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-(--text-color)">
                {featuredPost.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-(--text-color) opacity-70">
                {featuredPost.excerpt}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-(--explorer-border) px-2 py-1 font-mono text-[11px] text-(--text-color) opacity-70">
                  {formatDate(featuredPost.publishedAt)}
                </span>
                {(featuredPost.categories?.length
                  ? featuredPost.categories
                  : ["Field Note"]
                ).map((category) => (
                  <span
                    key={category}
                    className="rounded-full border border-(--explorer-border) px-2 py-1 font-mono text-[11px] text-(--text-color) opacity-70"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <div className="mt-6">
                <Link
                  href={getPostHref(featuredPost)}
                  className="inline-flex rounded-md bg-(--accent-color) px-5 py-3 text-sm font-semibold text-(--main-bg) transition-transform hover:-translate-y-0.5"
                >
                  Read note
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="relative mt-8">
        <div className="mb-4 flex items-end justify-between gap-4 border-b border-(--explorer-border) pb-3">
          <div>
            <p className="font-mono text-xs text-(--accent-color)">
              explorer.notes
            </p>
            <h2 className="mt-2 text-2xl font-bold text-(--text-color)">
              All notes
            </h2>
          </div>
          <p className="hidden font-mono text-xs text-(--text-color) opacity-45 sm:block">
            {posts.length} indexed
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {posts.map((post) => (
              <ArticleCard key={post._id} article={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-(--explorer-border) bg-(--article-bg) p-8 text-center">
            <p className="font-mono text-xs text-(--accent-color)">
              no-notes.json
            </p>
            <p className="mt-3 text-sm text-(--text-color) opacity-70">
              Add posts in Sanity to populate this reading workspace.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
