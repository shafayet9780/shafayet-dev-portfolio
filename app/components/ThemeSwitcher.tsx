"use client";

import { useState, useEffect } from 'react';

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('');
  
  const themes = [
    // Dark themes
    { id: '', name: 'GitHub Dark', category: 'dark' }, // Default theme (no data-theme attribute)
    { id: 'dracula', name: 'Dracula', category: 'dark' },
    { id: 'nord', name: 'Nord', category: 'dark' },
    { id: 'night-owl', name: 'Night Owl', category: 'dark' },
    { id: 'vs-dark', name: 'Visual Studio Dark', category: 'dark' },
    { id: 'dark-modern', name: 'Dark Modern', category: 'dark' },
    // Light themes
    { id: 'vs-light', name: 'Visual Studio Light', category: 'light' },
    { id: 'light-modern', name: 'Light Modern', category: 'light' },
  ];
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || '';
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);
  
  const setTheme = (themeId: string) => {
    if (themeId === '') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', themeId);
    }
    localStorage.setItem('theme', themeId);
    setCurrentTheme(themeId);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[--accent-color] text-[--main-bg] p-2 rounded-full shadow-lg hover:opacity-90 transition-opacity"
        title="Change Theme"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 bg-[--article-bg] rounded-md shadow-lg overflow-hidden w-56">
          <div className="py-1 px-3 text-xs font-semibold text-[--accent-color] border-b border-[--explorer-border]">
            Light Themes
          </div>
          {themes
            .filter(theme => theme.category === 'light')
            .map((theme) => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-[--explorer-hover-bg] ${
                  currentTheme === theme.id ? 'bg-[--explorer-hover-bg] text-[--accent-color]' : ''
                }`}
              >
                {theme.name}
              </button>
            ))
          }
          
          <div className="py-1 px-3 text-xs font-semibold text-[--accent-color] border-b border-t border-[--explorer-border] mt-1">
            Dark Themes
          </div>
          {themes
            .filter(theme => theme.category === 'dark')
            .map((theme) => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-[--explorer-hover-bg] ${
                  currentTheme === theme.id ? 'bg-[--explorer-hover-bg] text-[--accent-color]' : ''
                }`}
              >
                {theme.name}
              </button>
            ))
          }
        </div>
      )}
    </div>
  );
}
