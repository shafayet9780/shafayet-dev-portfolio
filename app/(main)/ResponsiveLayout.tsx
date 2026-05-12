"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Explorer from "../components/Explorer";
import Tabsbar from "../components/Tabsbar";
import Bottombar from "../components/Bottombar";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { CommandPalette } from "../components/layout/CommandPalette";
import { ContextCommandPanel } from "../components/layout/ContextCommandPanel";
import { TerminalDrawer, type TerminalProfile } from "../components/layout/TerminalDrawer";
import { AnimatePresence } from "motion/react";

interface ContextPanelPosition {
  x: number;
  y: number;
}

// This is a client component - it cannot directly include server components that use async/await
export default function ResponsiveLayout({
  children,
  terminalProfile,
}: {
  children: React.ReactNode;
  terminalProfile: TerminalProfile;
}) {
  const [isPanelsVisible, setIsPanelsVisible] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isBottombarVisible, setIsBottombarVisible] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [contextPanelPosition, setContextPanelPosition] =
    useState<ContextPanelPosition | null>(null);
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

  useEffect(() => {
    const openCommandPalette = () => {
      setContextPanelPosition(null);
      setIsTerminalOpen(false);
      setIsCommandPaletteOpen(true);
    };

    const openTerminal = () => {
      setContextPanelPosition(null);
      setIsCommandPaletteOpen(false);
      setIsBottombarVisible(true);
      setIsTerminalOpen(true);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openCommandPalette();
      }

      if (
        (event.metaKey || event.ctrlKey) &&
        (event.key === "`" || event.code === "Backquote")
      ) {
        event.preventDefault();
        setContextPanelPosition(null);
        setIsCommandPaletteOpen(false);
        setIsBottombarVisible(true);
        setIsTerminalOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setIsTerminalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("portfolio:open-command-center", openCommandPalette);
    window.addEventListener("portfolio:open-terminal", openTerminal);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("portfolio:open-command-center", openCommandPalette);
      window.removeEventListener("portfolio:open-terminal", openTerminal);
    };
  }, []);

  const openCommandPalette = useCallback(() => {
    setContextPanelPosition(null);
    setIsTerminalOpen(false);
    setIsCommandPaletteOpen(true);
  }, []);

  const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setIsCommandPaletteOpen(false);

    const panelWidth = 420;
    const panelHeight = 330;
    const gutter = 12;
    const x = Math.min(event.clientX, window.innerWidth - panelWidth - gutter);
    const y = Math.min(event.clientY, window.innerHeight - panelHeight - gutter);

    setContextPanelPosition({
      x: Math.max(gutter, x),
      y: Math.max(gutter, y),
    });
  };

  // Scroll behavior for bottombar
  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return;

    const handleScroll = () => {
      setContextPanelPosition(null);
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
    <div className="flex h-full w-full relative bg-(--main-bg) text-(--text-color)">
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <CommandPalette onClose={() => setIsCommandPaletteOpen(false)} />
        )}
        {contextPanelPosition && (
          <ContextCommandPanel
            x={contextPanelPosition.x}
            y={contextPanelPosition.y}
            onClose={() => setContextPanelPosition(null)}
            onOpenCommandPalette={openCommandPalette}
          />
        )}
        {isTerminalOpen && (
          <TerminalDrawer
            isOpen={isTerminalOpen}
            onClose={() => setIsTerminalOpen(false)}
            profile={terminalProfile}
          />
        )}
      </AnimatePresence>

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
        flex flex-col flex-1 overflow-hidden min-w-0 text-(--text-color)
        ${isMobileView && isPanelsVisible ? 'ml-[50px]' : ''}
      `}>
        {/* Mobile toggle bar */}
        {isMobileView && (
          <div className="h-9 bg-(--explorer-bg) flex items-center px-4 border-b border-(--explorer-border) shrink-0">
            <button 
              onClick={togglePanels}
              className="text-(--text-color) hover:text-white text-sm flex items-center"
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
        <div className="shrink-0">
          <Tabsbar />
        </div>
        
        {/* Content - scrollable */}
        <main 
          ref={mainRef} 
          onContextMenu={handleContextMenu}
          className="flex-1 overflow-auto bg-(--main-bg) p-4 pb-16 text-(--text-color) scroll-smooth md:p-8 md:pb-20"
        >
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
      
      {/* Theme switcher - positioned above the bottombar */}
      <div className="fixed bottom-[42px] right-3 z-30 md:bottom-[40px] md:right-[20px]">
        <ThemeSwitcher />
      </div>
      
      {/* Bottom bar - fixed at the bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-40 bg-(--bottombar-bg) transform transition-transform duration-300 ease-in-out"
        style={{ transform: isBottombarVisible ? 'translateY(0)' : 'translateY(100%)' }}
      >
        <Bottombar />
      </div>
      
      {/* Overlay for mobile when panels are visible */}
      {isMobileView && isPanelsVisible && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsPanelsVisible(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
} 
