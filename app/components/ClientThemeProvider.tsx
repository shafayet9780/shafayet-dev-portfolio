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
      let theme = localStorage.getItem('theme');
      const userThemeSet = localStorage.getItem('theme:user-set');
      
      if (theme === 'vs-light' && !userThemeSet) {
        localStorage.removeItem('theme');
        theme = '';
      }

      if (theme) {
        document.documentElement.setAttribute('data-theme', theme);
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    } catch {
      // Fallback if localStorage is not available
    }
  }, []);

  // Just return children without any state tracking
  return <>{children}</>;
} 
