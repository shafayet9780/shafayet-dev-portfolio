import { client } from '../../../sanity'
import { PortableText } from '@portabletext/react'

async function getPost(slug: string) {
  return await client.fetch(`*[_type == "post" && slug.current == $slug][0]`, { slug })
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="text-gray-600 dark:text-gray-400 mb-8">
        {new Date(post._createdAt).toLocaleDateString()}
      </div>
      <div className="prose dark:prose-invert max-w-none">
        <PortableText value={post.body} />
      </div>
    </div>
  )
}