"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Explorer from "../components/Explorer";
import Tabsbar from "../components/Tabsbar";
import Bottombar from "../components/Bottombar";
import ThemeSwitcher from "../components/ThemeSwitcher";

// This is a client component - it cannot directly include server components that use async/await
export default function ResponsiveLayout({ children }: { children: React.ReactNode }) {
  const [isPanelsVisible, setIsPanelsVisible] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isBottombarVisible, setIsBottombarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const mainRef = useRef<HTMLElement>(null);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileView(isMobile);
      
      // Auto-close panels on mobile, keep them open on desktop
      setIsPanelsVisible(!isMobile);
    };
    
    // Set initial state
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll behavior for bottombar
  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return;

    const handleScroll = () => {
      const scrollY = mainElement.scrollTop;
      const isScrollingDown = scrollY > lastScrollY.current && scrollY > 50;
      const isScrollingUp = scrollY < lastScrollY.current;
      const isAtBottom = mainElement.scrollHeight - mainElement.scrollTop <= mainElement.clientHeight + 50;
      
      if (isScrollingDown && !isAtBottom) {
        setIsBottombarVisible(false);
      } else if (isScrollingUp || isAtBottom) {
        setIsBottombarVisible(true);
      }
      
      lastScrollY.current = scrollY;
    };

    mainElement.addEventListener('scroll', handleScroll);
    return () => mainElement.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle both sidebar and explorer together
  const togglePanels = () => setIsPanelsVisible(!isPanelsVisible);

  return (
    <div className="flex h-full w-full relative bg-[--main-bg] text-[--text-color]">
      {/* Sidebar - toggleable visibility */}
      {(isPanelsVisible || !isMobileView) && (
        <div className={`${isMobileView ? 'absolute' : 'relative'} z-40 h-full`}>
          <Sidebar />
        </div>
      )}
      
      {/* Explorer - toggleable visibility */}
      {(isPanelsVisible || !isMobileView) && (
        <div 
          className={`
            ${isMobileView 
              ? `fixed ${isPanelsVisible ? 'left-[50px]' : 'left-0'} z-30 h-full` 
              : 'relative h-full'
            }
          `}
        >
          <Explorer />
        </div>
      )}
      
      {/* Main content area */}
      <div className={`
        flex flex-col flex-1 overflow-hidden min-w-0 text-[--text-color]
        ${isMobileView && isPanelsVisible ? 'ml-[50px]' : ''}
      `}>
        {/* Mobile toggle bar */}
        {isMobileView && (
          <div className="h-9 bg-[--explorer-bg] flex items-center px-4 border-b border-[--explorer-border] flex-shrink-0">
            <button 
              onClick={togglePanels}
              className="text-[--text-color] hover:text-white text-sm flex items-center"
              aria-label="Toggle sidebar and explorer"
            >
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
                className="mr-2"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
              {isPanelsVisible ? 'Hide Panels' : 'Show Panels'}
            </button>
          </div>
        )}
        
        {/* Tabs - fixed height */}
        <div className="flex-shrink-0">
          <Tabsbar />
        </div>
        
        {/* Content - scrollable */}
        <main 
          ref={mainRef} 
          className="flex-1 overflow-auto bg-[--main-bg] text-[--text-color] p-4 md:p-8 scroll-smooth"
        >
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
      
      {/* Theme switcher - positioned above the bottombar */}
      <div className="fixed bottom-[40px] right-[20px] z-30">
        <ThemeSwitcher />
      </div>
      
      {/* Bottom bar - fixed at the bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-40 bg-[--bottombar-bg] transform transition-transform duration-300 ease-in-out"
        style={{ transform: isBottombarVisible ? 'translateY(0)' : 'translateY(100%)' }}
      >
        <Bottombar />
      </div>
      
      {/* Overlay for mobile when panels are visible */}
      {isMobileView && isPanelsVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsPanelsVisible(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
} 