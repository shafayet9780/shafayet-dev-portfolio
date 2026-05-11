"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getActiveWorkspaceItem } from "./workspaceNavigation";

interface TitlebarClientProps {
  mainName: string;
}

type MenuName = "File" | "Edit" | "View" | "Go" | "Run" | "Terminal" | "Help";

interface MenuAction {
  label: string;
  detail: string;
  href?: string;
  external?: boolean;
  run?: () => void | Promise<void>;
}

const menuNames: MenuName[] = [
  "File",
  "Edit",
  "View",
  "Go",
  "Run",
  "Terminal",
  "Help",
];

export default function TitlebarClient({ mainName }: TitlebarClientProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuName | null>(null);
  const [activeActionIndex, setActiveActionIndex] = useState(0);
  const [commandOutput, setCommandOutput] = useState("workspace.ready");
  const [isOutputVisible, setIsOutputVisible] = useState(false);
  const titlebarRef = useRef<HTMLElement>(null);
  const outputTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const activeFile = getActiveWorkspaceItem(pathname);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(
    () => () => {
      if (outputTimerRef.current) {
        clearTimeout(outputTimerRef.current);
      }
    },
    []
  );

  useEffect(() => {
    const closeMenus = (event: PointerEvent) => {
      const target = event.target as Element | null;

      if (target?.closest("[data-titlebar-root]")) {
        return;
      }

      if (titlebarRef.current) {
        setActiveMenu(null);
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveMenu(null);
        setMenuOpen(false);
      }
    };

    window.addEventListener("pointerdown", closeMenus);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", closeMenus);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setActiveActionIndex(0);
  }, [activeMenu]);

  const openCommandCenter = useCallback(() => {
    window.dispatchEvent(new Event("portfolio:open-command-center"));
  }, []);

  const showCommandOutput = useCallback((value: string) => {
    setCommandOutput(value);
    setIsOutputVisible(true);

    if (outputTimerRef.current) {
      clearTimeout(outputTimerRef.current);
    }

    outputTimerRef.current = setTimeout(() => {
      setIsOutputVisible(false);
    }, 2200);
  }, []);

  const copyToClipboard = useCallback(async (value: string, output: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showCommandOutput(output);
    } catch {
      window.prompt("Copy manually:", value);
      showCommandOutput("copy.permission-denied");
    }
  }, [showCommandOutput]);

  const menuActions = useMemo<Record<MenuName, MenuAction[]>>(
    () => ({
      File: [
        {
          label: "Open Home",
          detail: "Return to the command center.",
          href: "/",
        },
        {
          label: "Open Case Studies",
          detail: "Inspect decisions and outcomes.",
          href: "/projects",
        },
        {
          label: "Open GitHub",
          detail: "View activity and repository signals.",
          href: "/github",
        },
        {
          label: "Open Contact",
          detail: "Start a technical conversation.",
          href: "/contact",
        },
      ],
      Edit: [
        {
          label: "Copy Current URL",
          detail: "Copy this route.",
          run: () => copyToClipboard(window.location.href, "url.copied"),
        },
        {
          label: "Copy Email",
          detail: "Copy the contact address.",
          run: () => copyToClipboard("contact@shafayet.dev", "email.copied"),
        },
        {
          label: "Open Command Center",
          detail: "Search the workspace.",
          run: openCommandCenter,
        },
      ],
      View: [
        {
          label: "Capability Matrix",
          detail: "Open applied engineering strengths.",
          href: "/#capabilities",
        },
        {
          label: "GitHub Activity",
          detail: "Open activity and repository signals.",
          href: "/github",
        },
        {
          label: "Theme Settings",
          detail: "Open theme preferences.",
          href: "/settings",
        },
      ],
      Go: [
        {
          label: "Go to About",
          detail: "Read the leadership profile.",
          href: "/about",
        },
        {
          label: "Go to Notes",
          detail: "Open technical field notes.",
          href: "/blog",
        },
        {
          label: "Go to Contact",
          detail: "Open the collaboration handoff.",
          href: "/contact",
        },
      ],
      Run: [
        {
          label: "Architecture Review",
          detail: "Boundaries, tradeoffs, and delivery risk.",
          href: "/projects",
        },
        {
          label: "Reliability Check",
          detail: "CI/CD, release confidence, and rollback thinking.",
          href: "/github",
        },
        {
          label: "Leadership Brief",
          detail: "Team clarity, reviews, and execution.",
          href: "/about",
        },
      ],
      Terminal: [
        {
          label: "whoami",
          detail: "Show current positioning.",
          href: "/about",
        },
        {
          label: "pwd",
          detail: "Show current file.",
          run: () => showCommandOutput(`pwd -> ${activeFile.filename}`),
        },
        {
          label: "open command-center",
          detail: "Launch command search.",
          run: openCommandCenter,
        },
      ],
      Help: [
        {
          label: "About Shafayet",
          detail: "Open the leadership profile.",
          href: "/about",
        },
        {
          label: "GitHub Profile",
          detail: "Open the source profile.",
          href: "https://github.com/shafayet9780",
          external: true,
        },
        {
          label: "Start a Conversation",
          detail: "Open contact options.",
          href: "/contact",
        },
      ],
    }),
    [activeFile.filename, copyToClipboard, openCommandCenter, showCommandOutput]
  );

  const runMenuAction = async (action: MenuAction) => {
    try {
      if (action.run) {
        await action.run();
      }
    } catch {
      showCommandOutput("command.failed");
    }

    if (action.label.toLowerCase().includes("command")) {
      setActiveMenu(null);
      setMenuOpen(false);
    }

    if (action.href) {
      if (action.external) {
        window.open(action.href, "_blank", "noopener,noreferrer");
      } else {
        router.push(action.href);
      }
      setActiveMenu(null);
      setMenuOpen(false);
    }
  };

  const activeActions = activeMenu ? menuActions[activeMenu] : [];
  const activeAction = activeActions[activeActionIndex] || activeActions[0];

  const menuPanel = activeMenu ? (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.14, ease: "easeOut" }}
      className="fixed left-8 top-[30px] z-[1000] w-[min(92vw,430px)] overflow-hidden rounded-md border border-(--explorer-border) bg-(--article-bg) text-(--text-color) shadow-2xl"
      data-titlebar-menu
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-(--explorer-border) bg-(--titlebar-bg)/90 px-3 py-2">
        <p className="font-mono text-[11px] text-(--accent-color)">
          menu.{activeMenu.toLowerCase()}
        </p>
        <span className="font-mono text-[10px] opacity-45">{activeFile.filename}</span>
      </div>

      <div className="grid sm:grid-cols-[minmax(0,1fr)_150px]">
        <div className="p-1.5">
          {activeActions.map((action, index) => (
            <button
              key={action.label}
              type="button"
              className={`w-full rounded-sm px-3 py-2 text-left transition-colors ${
                index === activeActionIndex
                  ? "bg-(--explorer-hover-bg)"
                  : "hover:bg-(--explorer-hover-bg)"
              }`}
              onMouseEnter={() => setActiveActionIndex(index)}
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void runMenuAction(action);
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs">{action.label}</span>
                <span className="font-mono text-[10px] text-(--accent-color) opacity-55">
                  {action.href ? "open" : "run"}
                </span>
              </div>
              <p className="mt-1 line-clamp-1 text-[11px] leading-5 opacity-50">
                {action.detail}
              </p>
            </button>
          ))}
        </div>

        <div className="hidden border-l border-(--explorer-border) bg-(--main-bg)/60 p-3 sm:block">
          <p className="font-mono text-[10px] uppercase opacity-35">Output</p>
          <p className="mt-3 font-mono text-xs leading-5 text-(--accent-color)">
            &gt; {activeAction?.label || activeMenu}
          </p>
          <p className="mt-2 text-xs leading-5 opacity-60">
            {activeAction?.detail || commandOutput}
          </p>
          <p className="mt-4 border-t border-(--explorer-border) pt-3 font-mono text-[10px] opacity-40">
            {commandOutput}
          </p>
        </div>
      </div>
    </motion.div>
  ) : null;

  return (
    <section ref={titlebarRef} data-titlebar-root className="relative z-[1000] flex h-[30px] items-center justify-between overflow-visible border-b border-(--explorer-border) bg-(--titlebar-bg) text-[0.85rem] text-(--titlebar-text) backdrop-blur-xs">
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
            onClick={() => {
              setMenuOpen(!menuOpen);
              setActiveMenu((current) => current || "File");
            }}
            className="ml-2 flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] px-2 py-1 rounded-xs transition-colors"
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
            {menuNames.map((item) => (
              <div key={item} className="relative">
                <button
                  type="button"
                  className={`px-2 transition-colors duration-150 rounded-xs ${
                    activeMenu === item
                      ? "bg-[rgba(var(--accent-rgb),0.16)] text-(--accent-color)"
                      : "hover:bg-[rgba(255,255,255,0.1)]"
                  }`}
                  onClick={() =>
                    setActiveMenu((current) => (current === item ? null : item))
                  }
                  onMouseEnter={() => {
                    if (activeMenu) setActiveMenu(item);
                  }}
                >
                  {item}
                </button>
                <AnimatePresence>
                  {activeMenu === item && menuPanel}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <p className="absolute left-1/2 transform -translate-x-1/2 font-medium tracking-tight opacity-70 truncate max-w-[200px] text-center">{mainName}</p>

      <AnimatePresence>
        {isOutputVisible && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="pointer-events-none absolute left-1/2 top-[32px] z-50 hidden -translate-x-1/2 rounded-full border border-(--explorer-border) bg-(--article-bg) px-3 py-1.5 font-mono text-[11px] text-(--accent-color) shadow-xl sm:block"
          >
            {commandOutput}
          </motion.div>
        )}
      </AnimatePresence>
      
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
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-xs"
            onClick={() => setMenuOpen(false)}
          ></div>
          <div
            className="absolute top-[30px] left-0 z-50 w-[min(92vw,430px)] overflow-hidden rounded-md border border-(--explorer-border) bg-(--article-bg) shadow-2xl backdrop-blur-xs"
            data-titlebar-menu
            onPointerDown={(event) => event.stopPropagation()}
          >
            <div className="flex gap-1 overflow-x-auto border-b border-(--explorer-border) bg-(--titlebar-bg)/90 p-1.5">
              {menuNames.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`shrink-0 rounded-sm px-2 py-1 font-mono text-[11px] ${
                    activeMenu === item
                      ? "bg-[rgba(var(--accent-rgb),0.16)] text-(--accent-color)"
                      : "hover:bg-(--explorer-hover-bg)"
                  }`}
                  onClick={() => setActiveMenu(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="p-1.5">
              {(activeMenu ? menuActions[activeMenu] : menuActions.File).map(
                (action, index) => (
                  <button
                    key={action.label}
                    type="button"
                    className="w-full rounded-sm px-3 py-2 text-left transition-colors hover:bg-(--explorer-hover-bg)"
                    onMouseEnter={() => setActiveActionIndex(index)}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      void runMenuAction(action);
                    }}
                  >
                    <span className="font-mono text-xs text-(--text-color)">
                      {action.label}
                    </span>
                    <span className="mt-1 block text-[11px] leading-5 text-(--text-color) opacity-50">
                      {action.detail}
                    </span>
                  </button>
                )
              )}
            </div>
            <div className="border-t border-(--explorer-border) px-3 py-2 font-mono text-[10px] text-(--text-color) opacity-45">
              {commandOutput}
            </div>
          </div>
        </>
      )}
    </section>
  );
} 
