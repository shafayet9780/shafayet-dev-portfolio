// Import homepage client component
import HomePage from './home-client';
import { client } from "@/studio/lib/client";
import { JsonLd } from "@/app/components/JsonLd";
import {
  createPageMetadata,
  graphJsonLd,
  personJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Engineering Leader, Full Stack Architect & DevOps Specialist",
  description:
    "Shafayet Ahmmed helps teams clarify architecture, reduce delivery risk, and ship reliable production software.",
  path: "/",
});

// Server component
export default async function Page() {
  // Fetch data on the server
  const siteSettings = await client.fetch(`
    *[_type == "siteSettings"][0] {
      mainName,
      jobTitle,
      headerText,
      ctaText,
      ctaLink,
      secondaryCtaText,
      secondaryCtaLink,
      bio
    }
  `);
  
  const projects = await client.fetch(
    `*[_type == "project"] | order(_createdAt desc)[0...3] {
      title,
      slug,
      "description": coalesce(description, excerpt),
      "imageUrl": mainImage.asset->url,
      "tags": categories[]->title
    }`
  );

  const experiences = await client.fetch(
    `*[_type == "experience"] | order(startDate desc, orderRank asc)[0...3] {
      _id,
      companyName,
      role,
      startDate,
      endDate,
      isCurrent,
      sectors,
      products[] {
        name,
        sector
      }
    }`
  );
  
  // Pass data to client component
  return (
    <>
      <JsonLd data={graphJsonLd([personJsonLd(), websiteJsonLd()])} />
      <HomePage 
        siteSettings={siteSettings}
        projects={projects}
        experiences={experiences}
      />
    </>
  );
}
