export interface WorkspaceItem {
  filename: string;
  path: string;
  icon: string;
  label: string;
  description: string;
  group: "workspace" | "system";
  match: "exact" | "prefix";
}

export const workspaceItems: WorkspaceItem[] = [
  {
    filename: "home.jsx",
    path: "/",
    icon: "/react_icon.svg",
    label: "Home",
    description: "Open the engineering command center",
    group: "workspace",
    match: "exact",
  },
  {
    filename: "projects.js",
    path: "/projects",
    icon: "/js_icon.svg",
    label: "Projects",
    description: "Browse selected case studies and engineering work",
    group: "workspace",
    match: "prefix",
  },
  {
    filename: "about.html",
    path: "/about",
    icon: "/html_icon.svg",
    label: "About",
    description: "Read the leadership profile and operating style",
    group: "workspace",
    match: "exact",
  },
  {
    filename: "blog.json",
    path: "/blog",
    icon: "/json_icon.svg",
    label: "Blog",
    description: "Open technical notes and writing",
    group: "workspace",
    match: "prefix",
  },
  {
    filename: "contact.css",
    path: "/contact",
    icon: "/css_icon.svg",
    label: "Contact",
    description: "Start a conversation",
    group: "workspace",
    match: "exact",
  },
  {
    filename: "github.md",
    path: "/github",
    icon: "/markdown_icon.svg",
    label: "GitHub",
    description: "View GitHub activity and repository signals",
    group: "system",
    match: "exact",
  },
  {
    filename: "settings.json",
    path: "/settings",
    icon: "/json_icon.svg",
    label: "Settings",
    description: "Change workspace theme preferences",
    group: "system",
    match: "exact",
  },
];

export function isWorkspaceItemActive(item: WorkspaceItem, pathname: string) {
  if (item.match === "exact") {
    return pathname === item.path;
  }

  return pathname === item.path || pathname.startsWith(`${item.path}/`);
}

export function getActiveWorkspaceItem(pathname: string) {
  return (
    workspaceItems.find((item) => isWorkspaceItemActive(item, pathname)) ||
    workspaceItems[0]
  );
}

export function getDynamicTab(pathname: string) {
  if (pathname.startsWith("/projects/")) {
    const slug = pathname.split("/").filter(Boolean).at(-1) || "project";
    return {
      filename: `${slug}.case.tsx`,
      path: pathname,
      icon: "/js_icon.svg",
      label: slug,
      description: "Project case study",
      group: "workspace",
      match: "exact",
    } satisfies WorkspaceItem;
  }

  return null;
}
