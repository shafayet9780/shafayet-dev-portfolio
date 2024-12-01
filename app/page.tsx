import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { client } from "@/studio/lib/client";
import { urlFor } from "@/studio/lib/image";
async function getData() {
  const projects = await client.fetch(
    `*[_type == "project"] | order(_createdAt desc)[0...3]`
  );
  const posts = await client.fetch(
    `*[_type == "post"] | order(_createdAt desc)[0...2]`
  );
  return { projects, posts };
}

export default async function Home() {
  const { projects, posts } = await getData();

  return (
    <div className="container mx-auto px-4 py-16">
      <section className="flex flex-col-reverse md:flex-row items-center justify-between mb-16">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Hi, I'm{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              Shafayet Ahmmed
            </span>
          </h1>
          <p className="text-xl mb-6 text-gray-600 dark:text-gray-400">
            A passionate Full Stack Developer crafting innovative web solutions
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300"
          >
            Get in touch <FaArrowRight className="ml-2" />
          </Link>
        </div>
        <div className="md:w-1/2 mb-8 md:mb-0">
          <Image
            src="/placeholder.svg"
            alt="John Doe"
            width={400}
            height={400}
            className="rounded-full shadow-lg"
          />
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project: any) => (
            <div
              key={project._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <Image
                src={urlFor(project.mainImage).width(400).height(200).url()}
                alt={project.title}
                width={400}
                height={200}
                className="w-full"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {project.excerpt}
                </p>
                <Link
                  href={`/projects/${project.slug.current}`}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Learn more
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8">Latest Blog Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post: any) => (
            <div
              key={post._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug.current}`}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Read more
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
