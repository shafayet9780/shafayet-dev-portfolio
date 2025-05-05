import Link from "next/link";
import Illustration from "../components/Illustration";
import { client } from "@/studio/lib/client";

async function getData() {
  const siteSettings = await client.fetch(`
    *[_type == "siteSettings"][0] {
      mainName,
      jobTitle,
      headerText,
      ctaText,
      ctaLink,
      secondaryCtaText,
      secondaryCtaLink
    }
  `);
  
  const projects = await client.fetch(
    `*[_type == "project"] | order(_createdAt desc)[0...3]`
  );
  
  const posts = await client.fetch(
    `*[_type == "post"] | order(_createdAt desc)[0...2]`
  );
  
  return { siteSettings, projects, posts };
}

export default async function Home() {
  const { siteSettings, projects, posts } = await getData();
  
  // Default values in case settings aren't found
  const {
    mainName = "Shafayet Ahmmed",
    jobTitle = "Full Stack Web Developer",
    headerText = "I BUILD WEBSITES",
    ctaText = "View Work",
    ctaLink = "/projects",
    secondaryCtaText = "Contact Me",
    secondaryCtaLink = "/contact"
  } = siteSettings || {};

  return (
    <div className="min-h-full relative">
      <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[--bg-text]">
        <h1 className="text-8xl md:text-[150px] font-bold tracking-tighter">
          {headerText.split(' ')[0]}
        </h1>
        <h1 className="text-8xl md:text-[150px] font-bold tracking-tighter">
          {headerText.split(' ').slice(1).join(' ')}
        </h1>
      </div>
      <div className="relative z-10 min-h-[calc(100vh-200px)] flex flex-col md:flex-row items-center justify-center py-8">
        <div className="text-center md:text-left md:mr-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{mainName}</h1>
          <h6 className="text-xl opacity-80 mb-6">{jobTitle}</h6>
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            <Link href={ctaLink}>
              <button className="px-4 py-2 bg-[--button-bg] text-[--button-text] rounded hover:opacity-90 transition-opacity">
                {ctaText}
              </button>
            </Link>
            <Link href={secondaryCtaLink}>
              <button className="px-4 py-2 border border-[--text-color] rounded hover:bg-opacity-20 hover:bg-white transition-colors">
                {secondaryCtaText}
              </button>
            </Link>
          </div>
        </div>
        <Illustration className="w-full max-w-md mt-8 md:mt-0 text-[--accent-color]" />
      </div>
    </div>
  );
}
