import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { client } from "@/studio/lib/client";
import { urlFor } from "@/studio/lib/image";
async function getProjects() {
  return await client.fetch(`*[_type == "project"] | order(_createdAt desc)`);
}

export default async function Projects() {
  const projects = await getProjects();

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">My Projects</h1>
      <div className="grid gap-12">
        {projects.map((project: any) => (
          <div
            key={project._id}
            id={`project-${project._id}`}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div className="md:flex">
              <div className="md:w-1/2">
                <Image
                  src={urlFor(project.mainImage).width(600).height(400).url()}
                  alt={project.title}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-6">
                <h2 className="text-2xl font-bold mb-4">{project.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {project.description}
                </p>
                <div className="mb-4">
                  <h3 className="font-bold mb-2">Technologies used:</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies &&
                      project.technologies.map((tech: any) => (
                        <span
                          key={tech}
                          className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                  </div>
                </div>
                <div className="flex space-x-4">
                  {project.github && (
                    <Link
                      href={project.github}
                      className="flex items-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <FaGithub className="mr-2" /> GitHub
                    </Link>
                  )}
                  {project.live && (
                    <Link
                      href={project.live}
                      className="flex items-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <FaExternalLinkAlt className="mr-2" /> Live Demo
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
