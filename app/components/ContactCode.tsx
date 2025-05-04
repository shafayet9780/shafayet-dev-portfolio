"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@sanity/client';

// Sanity config
const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
};

// Default contact items as fallback
const defaultContactItems = [
  {
    social: 'website',
    link: 'shafayet.dev',
    href: 'https://shafayet.dev',
  },
  {
    social: 'email',
    link: 'contact@shafayet.dev',
    href: 'mailto:contact@shafayet.dev',
  },
  {
    social: 'github',
    link: 'shafayet9780',
    href: 'https://github.com/shafayet9780',
  },
  {
    social: 'linkedin',
    link: 'shafayet-ahmmed',
    href: 'https://www.linkedin.com/in/shafayet-ahmmed/',
  },
];

// Create a client configured to fetch data only
const client = createClient({
  ...config,
  useCdn: true,
  perspective: 'published',
});

interface ContactCodeProps {
  socialLinks?: any[];
}

export default function ContactCode({ socialLinks }: ContactCodeProps) {
  const [contactItems, setContactItems] = useState(defaultContactItems);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If socialLinks are provided as props, use them directly
    if (socialLinks && socialLinks.length > 0) {
      setContactItems(socialLinks);
      setIsLoading(false);
      return;
    }
    
    // Otherwise fetch from Sanity
    async function fetchSocials() {
      try {
        const socials = await client.fetch(`
          *[_type == "social"] | order(orderRank asc)
        `);
        
        if (socials && socials.length > 0) {
          setContactItems(socials);
        }
      } catch (error) {
        console.error('Error fetching social links:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSocials();
  }, [socialLinks]);

  return (
    <div className="p-4 font-mono text-[15px] bg-[--article-bg] rounded-md shadow-md">
      <p>
        <span className="text-[#E99287]">.socials</span> &#123;
      </p>
      {isLoading ? (
        <p className="ml-6 opacity-60">Loading social links...</p>
      ) : (
        contactItems.map((item, index) => (
          <p className="ml-6" key={index}>
            <span className="text-[#9CDCFE]">{item.social}:</span>{' '}
            <a 
              href={item.href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#CE9178] hover:underline"
            >
              {item.link}
            </a>
            ;
          </p>
        ))
      )}
      <p>&#125;</p>
    </div>
  );
} 