"use client";

import { useState, useEffect } from 'react';

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Set theme on client-side only after component is mounted
  useEffect(() => {
    try {
      let isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      let theme = localStorage.getItem('theme');
      
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