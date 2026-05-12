import type { Metadata } from "next";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.shafayet.dev"
).replace(/\/$/, "");

export const siteTitle = "Shafayet Ahmmed";

export const defaultDescription =
  "Portfolio of Shafayet Ahmmed, an engineering leader, full stack architect, and DevOps specialist.";

export const defaultKeywords = [
  "Shafayet Ahmmed",
  "Engineering Leader",
  "Full Stack Architect",
  "DevOps Specialist",
  "Next.js",
  "Sanity CMS",
  "System Architecture",
  "Technical Leadership",
];

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createPageMetadata({
  title,
  description,
  path,
  type = "website",
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const images = image
    ? [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ]
    : undefined;

  return {
    title,
    description,
    keywords: defaultKeywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteTitle,
      type,
      images,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

export function graphJsonLd(items: Array<Record<string, unknown>>) {
  return {
    "@context": "https://schema.org",
    "@graph": items,
  };
}

export function personJsonLd() {
  return {
    "@type": "Person",
    "@id": absoluteUrl("/#person"),
    name: "Shafayet Ahmmed",
    url: absoluteUrl("/"),
    jobTitle: "Engineering Leader, Full Stack Architect, and DevOps Specialist",
    sameAs: [
      "https://github.com/shafayet9780",
      "https://www.linkedin.com/in/shafayet2368/",
      "https://x.com/shafayet2368",
    ],
    knowsAbout: [
      "Technical leadership",
      "System architecture",
      "DevOps",
      "Full stack engineering",
      "Next.js",
      "Sanity CMS",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: "shafayet.dev",
    url: absoluteUrl("/"),
    description: defaultDescription,
    publisher: {
      "@id": absoluteUrl("/#person"),
    },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function creativeWorkJsonLd({
  title,
  description,
  path,
  image,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
}) {
  return {
    "@type": "CreativeWork",
    name: title,
    headline: title,
    description,
    url: absoluteUrl(path),
    image,
    keywords,
    author: {
      "@id": absoluteUrl("/#person"),
    },
    creator: {
      "@id": absoluteUrl("/#person"),
    },
  };
}

export function articleJsonLd({
  title,
  description,
  path,
  publishedAt,
  updatedAt,
  image,
  authorName = "Shafayet Ahmmed",
}: {
  title: string;
  description: string;
  path: string;
  publishedAt?: string;
  updatedAt?: string;
  image?: string;
  authorName?: string;
}) {
  return {
    "@type": "Article",
    headline: title,
    description,
    url: absoluteUrl(path),
    image,
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    author: {
      "@type": "Person",
      name: authorName,
      url: absoluteUrl("/"),
    },
    publisher: {
      "@id": absoluteUrl("/#person"),
    },
  };
}
