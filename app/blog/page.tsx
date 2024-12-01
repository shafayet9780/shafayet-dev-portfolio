import Link from "next/link";
import { client } from "@/studio/lib/client";

async function getPosts() {
  return await client.fetch(`*[_type == "post"] | order(_createdAt desc)`);
}

export default async function Blog() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid gap-8">
        {posts.map((post: any) => (
          <div
            key={post._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">
                <Link
                  href={`/blog/${post.slug.current}`}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {post.excerpt}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(post._createdAt).toLocaleDateString()}
                </span>
                <Link
                  href={`/blog/${post.slug.current}`}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Read more
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
