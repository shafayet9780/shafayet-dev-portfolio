import { client } from "@/studio/lib/client";
import ProjectCard from "@/app/components/ProjectCard";

async function getData() {
  const projects = await client.fetch(`
    *[_type == "project"] | order(_createdAt desc) {
      _id,
      title,
      excerpt,
      "tags": categories[]->title,
      mainImage {
        asset->{
          _id,
          url
        },
        alt
      },
      sourceCodeUrl,
      demoUrl,
      slug
    }
  `);
  
  return { projects };
}

export default async function ProjectsPage() {
  const { projects } = await getData();
  
  return (
    <div className="py-4">
      <h1 className="text-4xl font-bold mb-8">Projects</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: any) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
} 