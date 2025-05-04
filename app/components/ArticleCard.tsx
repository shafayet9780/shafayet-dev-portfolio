import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/studio/lib/image";

// Icon components
const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 4C4 4 1 12 1 12C1 12 4 20 12 20C20 20 23 12 23 12C23 12 20 4 12 4Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.0621 22.0329 6.39462C21.7563 5.72714 21.351 5.12075 20.84 4.61Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CommentIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface ArticleCardProps {
  article: {
    _id: string;
    title: string;
    excerpt: string;
    mainImage?: {
      asset?: {
        _id: string;
        url: string;
      };
      alt?: string;
    };
    slug: {
      current: string;
    };
    viewCount?: number;
    likeCount?: number;
    commentCount?: number;
  };
}

export default function ArticleCard({ article }: ArticleCardProps) {
  // Check if the image exists and has the required asset
  const hasValidImage =
    article.mainImage && article.mainImage.asset && article.mainImage.asset._id;

  // Create image URL or use a placeholder
  const imageUrl = hasValidImage 
    ? urlFor(article.mainImage as any).width(300).height(150).url()
    : '/placeholder-article.jpg';

  return (
    <Link
      href={`/blog/${article.slug.current}`}
      className="block bg-[--article-bg] rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="relative h-40">
        {hasValidImage ? (
          <Image
            src={imageUrl}
            alt={article.mainImage?.alt || article.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <span className="text-sm text-gray-400">No image available</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{article.title}</h3>
        <p className="text-sm opacity-80 mb-4">{article.excerpt}</p>
        <div className="flex items-center text-xs text-[#6A737D]">
          {article.viewCount !== undefined && (
            <div className="flex items-center mr-4">
              <EyeIcon className="mr-1" /> {article.viewCount}
            </div>
          )}
          {article.likeCount !== undefined && (
            <div className="flex items-center mr-4">
              <HeartIcon className="mr-1" /> {article.likeCount}
            </div>
          )}
          {article.commentCount !== undefined && (
            <div className="flex items-center">
              <CommentIcon className="mr-1" /> {article.commentCount}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
