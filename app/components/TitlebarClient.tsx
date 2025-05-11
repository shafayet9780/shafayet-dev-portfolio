"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface TitlebarClientProps {
  mainName: string;
}

export default function TitlebarClient({ mainName }: TitlebarClientProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="h-[30px] relative flex items-center justify-between bg-[--titlebar-bg] text-[--titlebar-text] text-[0.85rem] border-b border-[--explorer-border] backdrop-blur-sm">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(var(--accent-rgb),0.08)] to-transparent opacity-50"></div>
      
      <div className="flex items-center z-10 px-2">
        <div className="flex items-center">
          <Image
            src="/vscode_icon.svg"
            alt="VSCode Icon"
            height={16}
            width={16}
            className="icon opacity-90"
          />
        </div>
        
        {isMobile ? (
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="ml-2 flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] px-2 py-1 rounded-sm transition-colors"
            aria-label="Menu"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="transition-transform"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <span className="ml-1 text-[0.8rem] font-medium tracking-tight">Menu</span>
          </button>
        ) : (
          <div className="flex mr-auto ml-2">
            {["File", "Edit", "View", "Go", "Run", "Terminal", "Help"].map((item) => (
              <p key={item} className="px-2 cursor-pointer transition-colors duration-150 hover:bg-[rgba(255,255,255,0.1)] rounded-sm">
                {item}
              </p>
            ))}
          </div>
        )}
      </div>
      
      <p className="absolute left-1/2 transform -translate-x-1/2 font-medium tracking-tight opacity-70 truncate max-w-[200px] text-center">{mainName}</p>
      
      <div className="flex items-center z-10 px-2 space-x-2">
        <button className="h-[13px] w-[13px] rounded-full cursor-pointer bg-[#ffbd2e] flex items-center justify-center hover:bg-[#ffc446] transition-colors group">
          <svg className="w-3 h-3 opacity-0 group-hover:opacity-70" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.8)" strokeWidth="3">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <button className="h-[13px] w-[13px] rounded-full cursor-pointer bg-[#28c840] flex items-center justify-center hover:bg-[#30d648] transition-colors group">
          <svg className="w-3 h-3 opacity-0 group-hover:opacity-70" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.8)" strokeWidth="3">
            <path d="M5 12h14"></path>
          </svg>
        </button>
        <button className="h-[13px] w-[13px] rounded-full cursor-pointer bg-[#ff5f57] flex items-center justify-center hover:bg-[#ff6e66] transition-colors group">
          <svg className="w-3 h-3 opacity-0 group-hover:opacity-70" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.8)" strokeWidth="3">
            <path d="M12 5v14"></path>
            <path d="M5 12h14"></path>
          </svg>
        </button>
      </div>
      
      {/* Mobile menu dropdown with backdrop filter */}
      {isMobile && menuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          ></div>
          <div className="absolute top-[30px] left-0 w-48 bg-[--explorer-bg]/95 shadow-lg z-50 backdrop-blur-sm border border-[--explorer-border] rounded-md overflow-hidden">
            {["File", "Edit", "View", "Go", "Run", "Terminal", "Help"].map((item) => (
              <p 
                key={item}
                className="px-4 py-2 cursor-pointer hover:bg-[--explorer-hover-bg] transition-colors flex items-center"
              >
                <span className="w-5 text-[--accent-color] opacity-70">{item.charAt(0)}</span>
                {item}
              </p>
            ))}
          </div>
        </>
      )}
    </section>
  );
} 