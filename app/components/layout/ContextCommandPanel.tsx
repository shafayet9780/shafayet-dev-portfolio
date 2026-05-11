"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { getActiveWorkspaceItem } from "../workspaceNavigation";

interface ContextCommandPanelProps {
  x: number;
  y: number;
  onClose: () => void;
  onOpenCommandPalette: () => void;
}

interface ContextAction {
  label: string;
  description: string;
  href?: string;
  external?: boolean;
  run?: () => void | Promise<void>;
}

function getPageActions(pathname: string): ContextAction[] {
  if (pathname === "/") {
    return [
      {
        label: "Open capability matrix",
        href: "/#capabilities",
        description:
          "Jump to leadership, architecture, DevOps, and product engineering strengths.",
      },
      {
        label: "View case studies",
        href: "/projects",
        description:
          "Open the selected engineering work framed around decisions and outcomes.",
      },
      {
        label: "Start a conversation",
        href: "/contact",
        description:
          "Move from the command center into a focused collaboration handoff.",
      },
    ];
  }

  if (pathname.startsWith("/projects/")) {
    return [
      {
        label: "Back to case studies",
        href: "/projects",
        description:
          "Return to the full case-study index without losing the workspace context.",
      },
      {
        label: "Open GitHub signals",
        href: "/github",
        description:
          "Pair this case-study narrative with activity and repository signals.",
      },
      {
        label: "Discuss this work",
        href: "/contact",
        description:
          "Open a conversation around architecture, delivery, or technical leadership.",
      },
    ];
  }

  if (pathname.startsWith("/projects")) {
    return [
      {
        label: "Read case studies",
        href: "/projects",
        description:
          "Stay inside the curated work surface and inspect engineering evidence.",
      },
      {
        label: "View GitHub signals",
        href: "/github",
        description:
          "Open activity, repository signals, and public engineering habits.",
      },
      {
        label: "Start architecture conversation",
        href: "/contact",
        description:
          "Move from proof of work into a focused leadership or systems discussion.",
      },
    ];
  }

  if (pathname.startsWith("/github")) {
    return [
      {
        label: "Open GitHub profile",
        href: "https://github.com/shafayet9780",
        external: true,
        description:
          "Open the source profile behind the activity matrix and repository signals.",
      },
      {
        label: "View case studies",
        href: "/projects",
        description:
          "Connect repository habits with the selected engineering case studies.",
      },
      {
        label: "Start DevOps conversation",
        href: "/contact",
        description:
          "Discuss reliability, automation, release confidence, or platform maturity.",
      },
    ];
  }

  if (pathname.startsWith("/blog")) {
    return [
      {
        label: "Open technical notes",
        href: "/blog",
        description:
          "Browse field notes on architecture, DevOps, delivery, and leadership.",
      },
      {
        label: "View case studies",
        href: "/projects",
        description:
          "Pair written thinking with concrete engineering work and outcomes.",
      },
      {
        label: "Start a conversation",
        href: "/contact",
        description:
          "Turn a technical note into a deeper architecture or leadership discussion.",
      },
    ];
  }

  if (pathname.startsWith("/about")) {
    return [
      {
        label: "View case studies",
        href: "/projects",
        description:
          "Move from leadership profile into proof of engineering judgment.",
      },
      {
        label: "Open GitHub signals",
        href: "/github",
        description:
          "Inspect consistency, public work, and repository maintenance habits.",
      },
      {
        label: "Start a leadership conversation",
        href: "/contact",
        description:
          "Open a handoff for team direction, architecture, or delivery clarity.",
      },
    ];
  }

  if (pathname.startsWith("/contact")) {
    return [
      {
        label: "View case studies first",
        href: "/projects",
        description:
          "Review engineering evidence before starting a collaboration thread.",
      },
      {
        label: "Open leadership profile",
        href: "/about",
        description:
          "Read the operating style and technical leadership positioning.",
      },
      {
        label: "Open GitHub signals",
        href: "/github",
        description:
          "Check activity, repository signal, and public engineering habits.",
      },
    ];
  }

  return [
    {
      label: "Open home command center",
      href: "/",
      description:
        "Return to the senior engineering command center and architecture brief.",
    },
    {
      label: "View case studies",
      href: "/projects",
      description: "Open selected engineering work and outcome-focused proof.",
    },
    {
      label: "Start a conversation",
      href: "/contact",
      description: "Open the focused collaboration handoff.",
    },
  ];
}

export function ContextCommandPanel({
  x,
  y,
  onClose,
  onOpenCommandPalette,
}: ContextCommandPanelProps) {
  const pathname = usePathname();
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [status, setStatus] = useState("context.ready");
  const activeFile = getActiveWorkspaceItem(pathname);

  const actions = useMemo<ContextAction[]>(
    () => [
      ...getPageActions(pathname),
      {
        label: "Open command center",
        description:
          "Search the full workspace with keyboard-first command palette controls.",
        run: onOpenCommandPalette,
      },
      {
        label: "Copy current path",
        description: "Copy this workspace route for quick sharing.",
        run: async () => {
          await navigator.clipboard.writeText(window.location.href);
          setStatus("path.copied");
        },
      },
    ],
    [onOpenCommandPalette, pathname]
  );

  const activeAction = actions[activeIndex] || actions[0];

  const runAction = useCallback(
    async (action?: ContextAction) => {
      if (!action) return;

      if (action.run) {
        await action.run();
      }

      if (action.href) {
        if (action.external) {
          window.open(action.href, "_blank", "noopener,noreferrer");
        } else {
          router.push(action.href);
        }
      }

      if (action.label !== "Copy current path") {
        onClose();
      }
    },
    [onClose, router]
  );

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((current) => Math.min(current + 1, actions.length - 1));
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((current) => Math.max(current - 1, 0));
      }

      if (event.key === "Enter") {
        event.preventDefault();
        runAction(actions[activeIndex]);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [actions, activeIndex, onClose, runAction]);

  return (
    <motion.div
      ref={panelRef}
      role="menu"
      aria-label="Context actions"
      initial={{ opacity: 0, scale: 0.96, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 4 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
      className="fixed z-50 w-[min(92vw,420px)] overflow-hidden rounded-lg border border-(--explorer-border) bg-(--article-bg) shadow-2xl"
      style={{ left: x, top: y }}
      onContextMenu={(event) => event.preventDefault()}
    >
      <div className="border-b border-(--explorer-border) bg-(--titlebar-bg)/90 px-3 py-2">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[11px] text-(--accent-color)">
            context.actions
          </p>
          <span className="rounded-full border border-(--explorer-border) px-2 py-0.5 font-mono text-[10px] text-(--text-color) opacity-50">
            {activeFile.filename}
          </span>
        </div>
      </div>

      <div className="grid gap-0 sm:grid-cols-[minmax(0,1fr)_150px]">
        <div className="p-2">
          {actions.map((action, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={action.label}
                type="button"
                role="menuitem"
                className={`group w-full rounded-md px-3 py-2.5 text-left transition-colors ${
                  isActive
                    ? "bg-(--explorer-hover-bg)"
                    : "hover:bg-(--explorer-hover-bg)"
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => runAction(action)}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      isActive
                        ? "bg-(--accent-color)"
                        : "bg-(--text-color) opacity-25"
                    }`}
                  />
                  <span className="font-mono text-xs text-(--text-color)">
                    {action.label}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 pl-3.5 text-[11px] leading-5 text-(--text-color) opacity-45">
                  {action.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="hidden border-l border-(--explorer-border) bg-(--main-bg)/55 p-3 sm:block">
          <p className="font-mono text-[10px] uppercase text-(--text-color) opacity-35">
            Preview
          </p>
          <p className="mt-3 font-mono text-xs leading-5 text-(--accent-color)">
            {activeAction?.label}
          </p>
          <p className="mt-2 text-xs leading-5 text-(--text-color) opacity-60">
            {activeAction?.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-(--explorer-border) px-3 py-2 font-mono text-[10px] text-(--text-color) opacity-45">
        <span>{status}</span>
        <span>{actions.length} actions</span>
      </div>
    </motion.div>
  );
}
