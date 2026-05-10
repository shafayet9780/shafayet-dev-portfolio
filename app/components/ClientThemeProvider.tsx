"use client";

import { useEffect } from 'react';

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Set theme on client-side only after component is mounted
  useEffect(() => {
    try {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = localStorage.getItem('theme');
      
      if (theme === 'vs-light' || (!theme && !isDark)) {
        document.documentElement.setAttribute('data-theme', 'vs-light');
        if (!theme) localStorage.setItem('theme', 'vs-light');
      } else if (theme) {
        document.documentElement.setAttribute('data-theme', theme);
      }
    } catch (e) {
      // Fallback if localStorage is not available
    }
  }, []);

  // Just return children without any state tracking
  return <>{children}</>;
} 