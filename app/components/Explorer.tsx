"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const ChevronRight = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={style}
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const explorerItems = [
  {
    name: 'home.jsx',
    path: '/',
    icon: '/react_icon.svg',
  },
  {
    name: 'about.html',
    path: '/about',
    icon: '/html_icon.svg',
  },
  {
    name: 'contact.css',
    path: '/contact',
    icon: '/css_icon.svg',
  },
  {
    name: 'projects.js',
    path: '/projects',
    icon: '/js_icon.svg',
  },
  {
    name: 'blog.json',
    path: '/blog',
    icon: '/json_icon.svg',
  },
  {
    name: 'github.md',
    path: '/github',
    icon: '/markdown_icon.svg',
  },
];

export default function Explorer() {
  const [portfolioOpen, setPortfolioOpen] = useState(true);

  return (
    <div className="w-[220px] flex-shrink-0 overflow-y-auto bg-[--explorer-bg] text-[--text-color] border-r border-[--explorer-border] scrollbar-hide">
      <p className="p-4 pb-2 uppercase text-xs font-medium tracking-wider opacity-50">Explorer</p>
      <div>
        <input
          type="checkbox"
          className="absolute opacity-0 w-0 h-0"
          id="portfolio-checkbox"
          checked={portfolioOpen}
          onChange={() => setPortfolioOpen(!portfolioOpen)}
        />
        <label 
          htmlFor="portfolio-checkbox" 
          className="flex items-center px-4 py-1 text-sm cursor-pointer hover:bg-[--explorer-hover-bg]"
        >
          <ChevronRight
            className="transform transition-transform duration-150 mr-1"
            style={portfolioOpen ? { transform: 'rotate(90deg)' } : {}}
          />
          <span>Portfolio</span>
        </label>
        <div
          className="ml-2"
          style={portfolioOpen ? { display: 'block' } : { display: 'none' }}
        >
          {explorerItems.map((item) => (
            <Link href={item.path} key={item.name}>
              <div className="flex items-center px-4 py-1 text-sm cursor-pointer hover:bg-[--explorer-hover-bg]">
                <Image
                  src={item.icon}
                  alt={item.name}
                  height={18}
                  width={18}
                  className="mr-1"
                />
                <p>{item.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 