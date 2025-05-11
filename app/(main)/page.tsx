// Import homepage client component
import HomePage from './home-client';
import { client } from "@/studio/lib/client";

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
      description,
      "imageUrl": mainImage.asset->url,
      tags
    }`
  );
  
  const posts = await client.fetch(
    `*[_type == "post"] | order(_createdAt desc)[0...2] {
      title,
      slug,
      excerpt,
      "imageUrl": mainImage.asset->url,
      publishedAt
    }`
  );
  
  // Pass data to client component
  return (
    <HomePage 
      siteSettings={siteSettings}
      projects={projects}
      posts={posts}
    />
  );
}
