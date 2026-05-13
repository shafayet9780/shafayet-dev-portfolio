"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  isWorkspaceItemActive,
  workspaceItems,
  type WorkspaceItem,
} from "./workspaceNavigation";

const ChevronRight = ({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
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
    className={className}
    style={style}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

function ExplorerGroup({
  id,
  title,
  items,
  defaultOpen = true,
}: {
  id: string;
  title: string;
  items: WorkspaceItem[];
  defaultOpen?: boolean;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div>
      <input
        type="checkbox"
        className="absolute h-0 w-0 opacity-0"
        id={id}
        checked={isOpen}
        onChange={() => setIsOpen(!isOpen)}
      />
      <label
        htmlFor={id}
        className="flex cursor-pointer items-center px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-(--text-color) opacity-60 hover:bg-(--explorer-hover-bg)"
      >
        <ChevronRight
          className="mr-1 transition-transform duration-150"
          style={isOpen ? { transform: "rotate(90deg)" } : undefined}
        />
        <span>{title}</span>
        <span className="ml-auto font-mono text-[10px] opacity-50">
          {items.length}
        </span>
      </label>

      {isOpen && (
        <div className="py-1">
          {items.map((item) => {
            const isActive = isWorkspaceItemActive(item, pathname);

            return (
              <Link href={item.path} key={item.path} title={item.description}>
                <div
                  className={`group flex items-center border-l-2 px-4 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "border-(--accent-color) bg-(--explorer-hover-bg) text-(--text-color)"
                      : "border-transparent text-(--text-color) opacity-75 hover:bg-(--explorer-hover-bg) hover:opacity-100"
                  }`}
                >
                  <Image
                    src={item.icon}
                    alt=""
                    height={17}
                    width={17}
                    className="mr-2 shrink-0"
                  />
                  <span className="truncate">{item.filename}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-(--accent-color)" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Explorer() {
  const workspace = workspaceItems.filter((item) => item.group === "workspace");
  const system = workspaceItems.filter((item) => item.group === "system");

  return (
    <aside className="flex h-full w-64 flex-col overflow-hidden border-r border-(--explorer-border) bg-(--explorer-bg) text-(--text-color)">
      <div className="shrink-0 border-b border-(--explorer-border) px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-50">
          Explorer
        </p>
        <p className="mt-2 font-mono text-[11px] text-(--accent-color)">
          shafayet.dev
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <ExplorerGroup
          id="portfolio-workspace"
          title="Workspace"
          items={workspace}
        />
        <ExplorerGroup
          id="portfolio-system"
          title="System"
          items={system}
          defaultOpen={false}
        />
      </div>

      <div className="border-t border-(--explorer-border) px-4 py-3">
        <button
          onClick={() =>
            window.dispatchEvent(new Event("portfolio:open-terminal"))
          }
          className="w-full rounded-md border border-(--explorer-border) bg-(--main-bg)/60 px-3 py-2 text-left font-mono text-xs text-(--text-color) transition-colors hover:border-(--accent-color)"
        >
          <span className="text-(--accent-color)">terminal</span>
          <span className="float-right opacity-50">Ctrl `</span>
        </button>
        <button
          onClick={() =>
            window.dispatchEvent(new Event("portfolio:open-command-center"))
          }
          className="mt-2 w-full rounded-md border border-(--explorer-border) bg-(--main-bg)/60 px-3 py-2 text-left font-mono text-xs text-(--text-color) transition-colors hover:border-(--accent-color)"
        >
          <span className="text-(--accent-color)">cmd</span> palette
          <span className="float-right opacity-50">⌘K</span>
        </button>
      </div>
    </aside>
  );
}
