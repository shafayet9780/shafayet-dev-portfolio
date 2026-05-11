"use client";

import { usePathname } from "next/navigation";
import Tab from "./Tab";
import {
  getDynamicTab,
  isWorkspaceItemActive,
  workspaceItems,
} from "./workspaceNavigation";

export default function Tabsbar() {
  const pathname = usePathname();
  const dynamicTab = getDynamicTab(pathname);
  const visibleTabs = workspaceItems.filter((item) =>
    ["home.jsx", "about.html", "contact.css", "projects.js", "blog.json", "github.md"].includes(
      item.filename
    )
  );

  return (
    <div className="flex h-[40px] overflow-x-auto border-b border-(--explorer-border) bg-(--tabs-bg) scrollbar-hide">
      {visibleTabs.map((item) => (
        <Tab
          key={item.path}
          icon={item.icon}
          filename={item.filename}
          path={item.path}
          isActive={
            dynamicTab
              ? item.path === "/projects"
                ? false
                : isWorkspaceItemActive(item, pathname)
              : isWorkspaceItemActive(item, pathname)
          }
          isDirty={item.path === "/" && pathname === "/"}
        />
      ))}

      {dynamicTab && (
        <Tab
          icon={dynamicTab.icon}
          filename={dynamicTab.filename}
          path={dynamicTab.path}
          isActive
        />
      )}
    </div>
  );
}
