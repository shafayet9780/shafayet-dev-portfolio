import { client } from "@/studio/lib/client";
import Image from "next/image";

async function getData() {
  const aboutData = await client.fetch(`
    *[_type == "siteSettings"][0] {
      aboutTitle,
      aboutContent,
      aboutImage {
        asset->{
          _id,
          url
        }
      },
      skills
    }
  `);
  
  return { aboutData };
}

export default async function AboutPage() {
  const { aboutData } = await getData();
  
  return (
    <div className="py-4">
      <h1 className="text-4xl font-bold mb-8">{aboutData?.aboutTitle || "About Me"}</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <div className="prose prose-invert max-w-none">
            {aboutData?.aboutContent ? (
              <div dangerouslySetInnerHTML={{ __html: aboutData.aboutContent }} />
            ) : (
              <p>I'm a passionate full-stack developer with expertise in modern web technologies.</p>
            )}
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Skills & Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {aboutData?.skills ? (
                aboutData.skills.map((skill: string, index: number) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-[--explorer-hover-bg] rounded-md text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                ["JavaScript", "TypeScript", "React", "Next.js", "Node.js"].map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-[--explorer-hover-bg] rounded-md text-sm"
                  >
                    {skill}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/3">
          {aboutData?.aboutImage ? (
            <Image
              src={aboutData.aboutImage.asset.url}
              alt="Profile"
              width={300}
              height={300}
              className="rounded-md mx-auto"
            />
          ) : (
            <div className="w-full h-64 bg-[--explorer-hover-bg] rounded-md flex items-center justify-center">
              <span className="text-[--text-color] opacity-50">Profile Image</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
