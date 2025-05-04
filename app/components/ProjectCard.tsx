import Image from 'next/image';
import { urlFor } from '@/studio/lib/image';

interface ProjectCardProps {
  project: {
    title: string;
    excerpt: string;
    tags?: string[];
    mainImage?: {
      asset?: {
        _id: string;
        url: string;
      };
      alt?: string;
    };
    sourceCodeUrl?: string;
    demoUrl?: string;
    slug?: {
      current: string;
    };
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  // Check if the image exists and has the required asset
  const hasValidImage = project.mainImage && 
                        project.mainImage.asset && 
                        project.mainImage.asset._id;
  
  // Create image URL or use a placeholder
  const imageUrl = hasValidImage 
    ? urlFor(project.mainImage as any).width(600).height(300).url()
    : '/placeholder-project.jpg';
  
  return (
    <div className="bg-[--article-bg] rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        {hasValidImage ? (
          <Image 
            src={imageUrl}
            alt={project.mainImage?.alt || project.title}
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
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="mb-4 text-sm opacity-80">{project.excerpt}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags?.map((tag) => (
            <span 
              key={tag} 
              className={`text-xs px-2 py-1 rounded-md ${tag.toLowerCase()}`}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-4">
          {project.sourceCodeUrl && (
            <a
              href={project.sourceCodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[--accent-color] hover:underline"
            >
              Source Code
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[--accent-color] hover:underline"
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
} 