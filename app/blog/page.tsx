import { client } from "@/studio/lib/client";
import ArticleCard from "@/app/components/ArticleCard";

async function getData() {
  const posts = await client.fetch(`
    *[_type == "post"] | order(_createdAt desc) {
      _id,
      title,
      excerpt,
      mainImage {
        asset->{
          _id,
          url
        },
        alt
      },
      slug,
      viewCount,
      likeCount,
      commentCount
    }
  `);
  
  return { posts };
}

export default async function BlogPage() {
  const { posts } = await getData();
  
  return (
    <div className="py-4">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {posts.map((post: any) => (
          <ArticleCard key={post._id} article={post} />
        ))}
      </div>
    </div>
  );
} 