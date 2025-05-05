"use client";

import { useState, useEffect } from 'react';

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('github-dark');
  
  const themes = [
    { id: 'github-dark', name: 'GitHub Dark' },
    { id: 'dracula', name: 'Dracula' },
    { id: 'nord', name: 'Nord' },
    { id: 'night-owl', name: 'Night Owl' }
  ];
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'github-dark';
    setCurrentTheme(savedTheme);
  }, []);
  
  const setTheme = (themeId: string) => {
    document.documentElement.setAttribute('data-theme', themeId);
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
        <div className="absolute bottom-full right-0 mb-2 bg-[--article-bg] rounded-md shadow-lg overflow-hidden w-48">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-[--explorer-hover-bg] ${
                currentTheme === theme.id ? 'bg-[--explorer-hover-bg] text-[--accent-color]' : ''
              }`}
            >
              {theme.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
