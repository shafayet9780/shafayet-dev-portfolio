"use client";

import Image from "next/image";
import Link from "next/link";

interface TabProps {
  icon: string;
  filename: string;
  path: string;
  isActive: boolean;
  isDirty?: boolean;
}

export default function Tab({
  icon,
  filename,
  path,
  isActive,
  isDirty = false,
}: TabProps) {
  return (
    <Link href={path} className="shrink-0">
      <div
        className={`group flex h-[40px] min-w-0 items-center border-r border-(--explorer-border) px-3 text-sm transition-colors duration-200 ${
          isActive
            ? "border-t border-t-[var(--accent-color)] bg-(--tab-active-bg) text-(--text-color)"
            : "bg-(--tab-bg) text-(--text-color) opacity-[0.58] hover:bg-(--explorer-hover-bg) hover:opacity-95"
        }`}
      >
        <Image
          src={icon}
          alt=""
          height={17}
          width={17}
          className="mr-2 shrink-0"
        />
        <span className="max-w-[150px] truncate">{filename}</span>
        <span
          className={`ml-3 h-2 w-2 rounded-full transition-colors ${
            isDirty
              ? "bg-(--accent-color)"
              : "border border-(--text-color) opacity-0 group-hover:opacity-30"
          }`}
        />
      </div>
    </Link>
  );
}
