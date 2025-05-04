"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface TabProps {
  icon: string;
  filename: string;
  path: string;
}

export default function Tab({ icon, filename, path }: TabProps) {
  const pathname = usePathname();
  const isActive = pathname === path;

  return (
    <Link href={path}>
      <div
        className={`h-[40px] px-4 flex items-center text-sm cursor-pointer transition-colors duration-200
          ${isActive 
            ? 'bg-[--tab-active-bg] text-[--text-color] border-t border-r border-[--tab-border]' 
            : 'bg-[--tab-bg] text-[#6A737D] hover:text-[--text-color]'
          }`}
      >
        <Image src={icon} alt={filename} height={18} width={18} className="mr-1" />
        <p>{filename}</p>
      </div>
    </Link>
  );
} 