"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { workspaceItems } from "../workspaceNavigation";

interface CommandPaletteProps {
  onClose: () => void;
}

interface Command {
  label: string;
  href?: string;
  description: string;
  action?: () => void;
}

export const CommandPalette = ({ onClose }: CommandPaletteProps) => {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const commands = useMemo<Command[]>(
    () => [
      ...workspaceItems.map((item) => ({
        label: `Go to ${item.label}`,
        href: item.path,
        description: item.description,
      })),
      {
        label: "Open capability matrix",
        description: "Applied leadership, architecture, and reliability",
        action: () => router.push("/#capabilities"),
      },
      {
        label: "Open case studies",
        href: "/projects",
        description: "Read technical decisions and outcomes",
      },
      {
        label: "Open contact",
        href: "/contact",
        description: "Start a focused technical conversation",
      },
    ],
    [router]
  );

  const filteredCommands = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return commands;

    return commands.filter((command) =>
      `${command.label} ${command.description}`
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [commands, search]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const runCommand = (command: Command) => {
    command.action?.();
    if (command.href) {
      router.push(command.href);
    }
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((current) =>
        Math.min(current + 1, filteredCommands.length - 1)
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const command = filteredCommands[selectedIndex];
      if (command) runCommand(command);
    } else if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/55 px-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <motion.div
        initial={shouldReduceMotion ? false : { scale: 0.97, opacity: 0, y: -10 }}
        animate={shouldReduceMotion ? undefined : { scale: 1, opacity: 1, y: 0 }}
        exit={shouldReduceMotion ? undefined : { scale: 0.97, opacity: 0, y: -10 }}
        transition={{ duration: 0.18 }}
        className="premium-panel signature-scan relative w-full max-w-3xl overflow-hidden rounded-lg border border-(--explorer-border) bg-(--article-bg) shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="border-b border-(--explorer-border) bg-(--titlebar-bg)/80 p-3">
          <div className="mb-2 flex items-center justify-between px-1 font-mono text-[11px] text-(--text-color) opacity-50">
            <span>command.center</span>
            <span>{pathname}</span>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search the workspace..."
            className="w-full rounded-md border border-(--explorer-border) bg-(--main-bg) px-4 py-3 font-mono text-sm text-(--text-color) outline-hidden placeholder:text-[rgba(var(--text-rgb),0.35)]"
          />
        </div>

        <div className="max-h-[440px] overflow-y-auto p-2">
          {filteredCommands.map((command, index) => (
            <button
              key={`${command.label}-${command.href || index}`}
              className={`w-full rounded-md px-4 py-3 text-left transition-colors ${
                index === selectedIndex
                  ? "bg-(--explorer-hover-bg)"
                  : "hover:bg-(--explorer-hover-bg)"
              }`}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => runCommand(command)}
            >
              <div className="font-mono text-sm text-(--text-color)">
                {command.label}
              </div>
              <div className="mt-1 text-xs text-(--text-color) opacity-55">
                {command.description}
              </div>
            </button>
          ))}

          {filteredCommands.length === 0 && (
            <div className="px-4 py-6 text-sm text-(--text-color) opacity-60">
              No commands found.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-(--explorer-border) px-4 py-2 font-mono text-[11px] text-(--text-color) opacity-45">
          <span>↑↓ navigate</span>
          <span>enter run</span>
          <span>esc close</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
