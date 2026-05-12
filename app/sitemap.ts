import type { MetadataRoute } from "next";
import { client } from "@/studio/lib/client";
import { absoluteUrl } from "@/lib/seo";

interface SlugEntry {
  slug?: string;
  updatedAt?: string;
}

function normalizeSlug(slug?: string) {
  return slug?.replace(/^\/+/, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([
    client.withConfig({ useCdn: false }).fetch<SlugEntry[]>(`
      *[_type == "project" && defined(slug.current)] {
        "slug": slug.current,
        "updatedAt": _updatedAt
      }
    `),
    client.withConfig({ useCdn: false }).fetch<SlugEntry[]>(`
      *[_type == "post" && defined(slug.current)] {
        "slug": slug.current,
        "updatedAt": _updatedAt
      }
    `),
  ]);

  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/about",
    "/projects",
    "/blog",
    "/github",
    "/contact",
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects
    .map((project) => normalizeSlug(project.slug))
    .filter(Boolean)
    .map((slug) => {
      const entry = projects.find((project) => normalizeSlug(project.slug) === slug);

      return {
        url: absoluteUrl(`/projects/${slug}`),
        lastModified: entry?.updatedAt ? new Date(entry.updatedAt) : now,
      };
    });

  const postRoutes: MetadataRoute.Sitemap = posts
    .map((post) => normalizeSlug(post.slug))
    .filter(Boolean)
    .map((slug) => {
      const entry = posts.find((post) => normalizeSlug(post.slug) === slug);

      return {
        url: absoluteUrl(`/blog/${slug}`),
        lastModified: entry?.updatedAt ? new Date(entry.updatedAt) : now,
      };
    });

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
