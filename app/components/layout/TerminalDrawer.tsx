"use client";

import {
  FormEvent,
  KeyboardEvent,
  PointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { getActiveWorkspaceItem } from "../workspaceNavigation";

export interface TerminalProfile {
  mainName: string;
  jobTitle: string;
  bio: string;
}

interface TerminalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: TerminalProfile;
}

type TerminalLine =
  | {
      type: "input";
      text: string;
    }
  | {
      type: "output";
      lines: string[];
      suggestion?: string;
    };

interface TerminalCommand {
  name: string;
  aliases: string[];
  summary: string;
  usage?: string;
  run: (
    args: string[],
    rawValue: string
  ) => Promise<string[] | "clear"> | string[] | "clear";
}

const themeOptions = [
  { id: "", command: "github-dark", label: "GitHub Dark" },
  { id: "dracula", command: "dracula", label: "Dracula" },
  { id: "nord", command: "nord", label: "Nord" },
  { id: "night-owl", command: "night-owl", label: "Night Owl" },
  { id: "vs-dark", command: "vs-dark", label: "Visual Studio Dark" },
  { id: "dark-modern", command: "dark-modern", label: "Dark Modern" },
  { id: "vs-light", command: "vs-light", label: "Visual Studio Light" },
  { id: "light-modern", command: "light-modern", label: "Light Modern" },
];

const autocompleteCandidates = [
  "help",
  "whoami",
  "status",
  "pwd",
  "open home",
  "open projects",
  "open github",
  "open contact",
  "open settings",
  "case-studies",
  "experience",
  "github",
  "contact",
  "theme",
  "theme list",
  "theme next",
  "theme set github-dark",
  "theme set dracula",
  "theme set nord",
  "theme set night-owl",
  "copy email",
  "copy url",
  "copy path",
  "clear",
];

const routeTargets: Record<string, { href: string; summary: string[] }> = {
  home: {
    href: "/",
    summary: [
      "opened home.jsx",
      "summary: senior positioning, architecture brief, capability matrix.",
    ],
  },
  projects: {
    href: "/projects",
    summary: [
      "opened projects.js",
      "summary: case studies framed around decisions, constraints, and outcomes.",
    ],
  },
  "case-studies": {
    href: "/projects",
    summary: [
      "opened projects.js",
      "summary: engineering case studies, not a generic project gallery.",
    ],
  },
  experience: {
    href: "/about",
    summary: [
      "opened about.html",
      "summary: leadership profile, operating style, and experience timeline.",
    ],
  },
  timeline: {
    href: "/about",
    summary: [
      "opened about.html",
      "summary: leadership growth and product-sector range.",
    ],
  },
  github: {
    href: "/github",
    summary: [
      "opened github.md",
      "summary: activity matrix, repo signals, and engineering habits.",
    ],
  },
  contact: {
    href: "/contact",
    summary: [
      "opened contact.css",
      "summary: direct handoff for leadership, architecture, and DevOps conversations.",
    ],
  },
  blog: {
    href: "/blog",
    summary: [
      "opened blog.json",
      "summary: technical field notes and architecture reflections.",
    ],
  },
  settings: {
    href: "/settings",
    summary: [
      "opened settings.json",
      "summary: workspace preferences and theme control.",
    ],
  },
};

function normalizeCommand(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

function tokenizeCommand(value: string) {
  return value.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

function scoreSuggestion(input: string, candidate: string) {
  if (!input) return 0;
  if (candidate.startsWith(input) || input.startsWith(candidate)) return 0.86;

  let matches = 0;
  let cursor = 0;

  for (const char of input) {
    const index = candidate.indexOf(char, cursor);
    if (index >= 0) {
      matches += 1;
      cursor = index + 1;
    }
  }

  return matches / Math.max(input.length, candidate.length);
}

function getSuggestion(input: string, commands: TerminalCommand[]) {
  const candidates = commands.flatMap((command) => [
    command.name,
    ...command.aliases,
  ]);

  return candidates
    .map((candidate) => ({
      candidate,
      score: scoreSuggestion(input, candidate),
    }))
    .filter((item) => item.score >= 0.58)
    .sort((a, b) => b.score - a.score)[0]?.candidate;
}

function getAutocompleteSuggestion(value: string) {
  const normalizedInput = value.trimStart().toLowerCase();

  if (!normalizedInput) return "";
  if (normalizedInput === "git") return "hub";

  const match = autocompleteCandidates.find(
    (candidate) =>
      candidate.startsWith(normalizedInput) && candidate !== normalizedInput
  );

  return match ? match.slice(normalizedInput.length) : "";
}

function getTerminalTimestamp() {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
  const time = [
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
  ].join(":");

  return `${date} ${time}`;
}

function TerminalPrompt({
  activeFileName,
  themeName,
  pathname,
  timestamp,
  children,
}: {
  activeFileName: string;
  themeName: string;
  pathname: string;
  timestamp: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
      <div className="flex max-w-full overflow-hidden rounded-sm text-[11px] leading-5 shadow-sm">
        <span className="bg-(--accent-color) px-2 font-semibold text-(--button-text)">
          shafayet
        </span>
        <span className="bg-[rgba(var(--accent-rgb),0.22)] px-2 text-(--accent-color)">
          {themeName}
        </span>
        <span className="max-w-[180px] truncate bg-(--main-bg) px-2 text-(--text-color) opacity-75">
          {activeFileName}
        </span>
        <span className="bg-[rgba(var(--text-rgb),0.08)] px-2 text-(--text-color) opacity-70">
          {pathname}
        </span>
        <span className="bg-[rgba(var(--text-rgb),0.08)] px-2 text-(--text-color) opacity-70">
          {timestamp}
        </span>
      </div>
      <span className="text-(--accent-color)">❯</span>
      <div className="relative min-w-0 flex-1">
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}

export function TerminalDrawer({
  isOpen,
  onClose,
  profile,
}: TerminalDrawerProps) {
  const [input, setInput] = useState("");
  const [terminalHeight, setTerminalHeight] = useState(360);
  const [timestamp, setTimestamp] = useState(getTerminalTimestamp);
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      type: "output",
      lines: [
        "terminal.ready",
        "Type `help` or press Tab for a suggestion.",
      ],
    },
  ]);
  const [themeName, setThemeName] = useState("github-dark");
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const activeFile = getActiveWorkspaceItem(pathname);
  const shouldReduceMotion = useReducedMotion();
  const autocompleteSuggestion = getAutocompleteSuggestion(input);

  const setTheme = useCallback((themeId: string) => {
    if (themeId) {
      document.documentElement.setAttribute("data-theme", themeId);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    localStorage.setItem("theme", themeId);
    localStorage.setItem("theme:user-set", "true");
    setThemeName(themeId || "github-dark");
    window.dispatchEvent(new Event("portfolio:theme-change"));
  }, []);

  const openRoute = useCallback((target: string) => {
    const route = routeTargets[target];

    if (!route) {
      return [
        `unknown target: ${target || "empty"}`,
        "Try: open projects, open github, open contact, open settings.",
      ];
    }

    router.push(route.href);
    return route.summary;
  }, [router]);

  useEffect(() => {
    const readTheme = () => {
      setThemeName(localStorage.getItem("theme") || "github-dark");
    };

    readTheme();
    window.addEventListener("storage", readTheme);
    window.addEventListener("portfolio:theme-change", readTheme);

    return () => {
      window.removeEventListener("storage", readTheme);
      window.removeEventListener("portfolio:theme-change", readTheme);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimestamp(getTerminalTimestamp());
    }, 15000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 80);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    outputRef.current?.scrollTo({
      top: outputRef.current.scrollHeight,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  }, [history, shouldReduceMotion]);

  const commands = useMemo<TerminalCommand[]>(
    () => [
      {
        name: "help",
        aliases: ["commands", "?"],
        summary: "Show available commands.",
        run: () => [
          "Available commands:",
          "- help",
          "- whoami",
          "- status",
          "- pwd",
          "- open <home|projects|github|contact|settings>",
          "- theme [list|next|set <theme>]",
          "- copy <email|url|path>",
          "- deploy-check",
          "- clear",
        ],
      },
      {
        name: "whoami",
        aliases: ["profile", "identity"],
        summary: "Show Sanity-backed positioning.",
        run: () => [profile.mainName, profile.jobTitle, profile.bio],
      },
      {
        name: "status",
        aliases: ["signals", "health"],
        summary: "Show operating signals.",
        run: () => [
          "review.ready",
          "risk.reduced",
          "delivery.clear",
          `workspace.time: ${timestamp}`,
        ],
      },
      {
        name: "pwd",
        aliases: ["path", "file"],
        summary: "Show the active workspace file.",
        run: () => [`/${activeFile.filename}`, pathname],
      },
      {
        name: "open",
        aliases: ["goto", "cd"],
        summary: "Navigate to a workspace page.",
        usage: "<home|projects|github|contact|settings>",
        run: (args) => openRoute(normalizeCommand(args.join(" "))),
      },
      {
        name: "case-studies",
        aliases: ["projects", "cases", "work"],
        summary: "Navigate to engineering case studies.",
        run: () => {
          router.push("/projects");
          return routeTargets["case-studies"].summary;
        },
      },
      {
        name: "experience",
        aliases: ["timeline", "about"],
        summary: "Navigate to leadership profile and timeline.",
        run: () => {
          router.push("/about");
          return routeTargets.experience.summary;
        },
      },
      {
        name: "github",
        aliases: ["repos", "activity"],
        summary: "Navigate to repository signals.",
        run: () => {
          router.push("/github");
          return routeTargets.github.summary;
        },
      },
      {
        name: "contact",
        aliases: ["conversation", "email"],
        summary: "Navigate to the contact workspace.",
        run: () => {
          router.push("/contact");
          return routeTargets.contact.summary;
        },
      },
      {
        name: "theme",
        aliases: ["settings"],
        summary: "Show or change the active theme.",
        usage: "[list|next|set <theme>]",
        run: (args) => {
          const [action, requestedTheme] = args;

          if (!action) {
            return [
              `theme:${themeName}`,
              "Try: theme list, theme next, theme set dracula.",
            ];
          }

          if (action === "list") {
            return themeOptions.map((theme) => `- ${theme.command}`);
          }

          if (action === "next") {
            const currentIndex = themeOptions.findIndex(
              (theme) => theme.command === themeName
            );
            const nextTheme =
              themeOptions[(currentIndex + 1) % themeOptions.length] ||
              themeOptions[0];
            setTheme(nextTheme.id);
            return [
              `theme.changed -> ${nextTheme.command}`,
              `label: ${nextTheme.label}`,
            ];
          }

          const themeCommand = action === "set" ? requestedTheme : action;
          const nextTheme = themeOptions.find(
            (theme) => theme.command === themeCommand || theme.id === themeCommand
          );

          if (!nextTheme) {
            return [
              `unknown theme: ${themeCommand || "empty"}`,
              "Run `theme list` to inspect available themes.",
            ];
          }

          setTheme(nextTheme.id);
          return [
            `theme.changed -> ${nextTheme.command}`,
            `label: ${nextTheme.label}`,
          ];
        },
      },
      {
        name: "copy",
        aliases: ["clip"],
        summary: "Copy a useful value.",
        usage: "<email|url|path>",
        run: async (args) => {
          const target = normalizeCommand(args[0] || "");
          const values: Record<string, string> = {
            email: "contact@shafayet.dev",
            url: window.location.href,
            path: pathname,
          };
          const value = values[target];

          if (!value) {
            return ["Try: copy email, copy url, copy path."];
          }

          try {
            await navigator.clipboard.writeText(value);
            return [`${target}.copied`, value];
          } catch {
            window.prompt("Copy manually:", value);
            return [`${target}.copy-manual`, value];
          }
        },
      },
      {
        name: "deploy-check",
        aliases: ["ship", "release"],
        summary: "Run a release-readiness check.",
        run: () => [
          "checking architecture signal...",
          "checking delivery confidence...",
          "checking rollback posture...",
          "result: release.ready",
        ],
      },
      {
        name: "clear",
        aliases: ["cls"],
        summary: "Clear terminal history.",
        run: () => "clear",
      },
    ],
    [
      activeFile.filename,
      openRoute,
      pathname,
      profile,
      router,
      setTheme,
      themeName,
      timestamp,
    ]
  );

  const runCommand = async (rawValue: string) => {
    const normalized = normalizeCommand(rawValue);
    const tokens = tokenizeCommand(rawValue);
    const commandName = normalizeCommand(tokens[0] || "");
    const args = tokens.slice(1);

    if (!normalized) return;

    const command = commands.find(
      (item) =>
        item.name === normalized ||
        item.aliases.includes(normalized) ||
        item.name === commandName ||
        item.aliases.includes(commandName)
    );

    if (command) {
      const result = await command.run(args, rawValue);

      if (result === "clear") {
        setHistory([
          {
            type: "output",
            lines: ["terminal.cleared"],
          },
        ]);
      } else {
        setHistory((current) => [
          ...current,
          { type: "input", text: rawValue },
          { type: "output", lines: result },
        ]);
      }

      setInput("");
      return;
    }

    const suggestion = getSuggestion(normalized, commands);

    setHistory((current) => [
      ...current,
      { type: "input", text: rawValue },
      {
        type: "output",
        lines: [
          `oops: command not found: ${rawValue}`,
          suggestion
            ? `Did you mean \`${suggestion}\`?`
            : "Type `help` to inspect available commands.",
        ],
        suggestion,
      },
    ]);
    setInput("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void runCommand(input);
  };

  const acceptAutocomplete = () => {
    if (!autocompleteSuggestion) return false;

    setInput((current) => `${current}${autocompleteSuggestion}`);
    return true;
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Tab") {
      if (acceptAutocomplete()) {
        event.preventDefault();
      }
      return;
    }

    if (
      event.key === "ArrowRight" &&
      autocompleteSuggestion &&
      inputRef.current?.selectionStart === input.length &&
      inputRef.current?.selectionEnd === input.length
    ) {
      event.preventDefault();
      acceptAutocomplete();
    }
  };

  const handleResizePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();

    const startY = event.clientY;
    const startHeight = terminalHeight;
    const maxHeight = Math.round(window.innerHeight * 0.7);

    const handlePointerMove = (moveEvent: globalThis.PointerEvent) => {
      const nextHeight = Math.min(
        maxHeight,
        Math.max(260, startHeight + startY - moveEvent.clientY)
      );

      setTerminalHeight(nextHeight);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.body.style.cursor = "ns-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  if (!isOpen) return null;

  return (
    <motion.section
      role="dialog"
      aria-label="Portfolio terminal"
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end bg-black/35 backdrop-blur-[2px] md:absolute md:inset-x-0 md:bottom-[25px] md:top-auto md:block md:bg-transparent md:backdrop-blur-0"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={
          shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.99 }
        }
        animate={
          shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }
        }
        exit={
          shouldReduceMotion ? undefined : { opacity: 0, y: 20, scale: 0.99 }
        }
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="premium-panel signature-scan relative mx-2 mb-2 flex max-h-[76vh] min-h-[390px] w-full flex-col overflow-hidden rounded-lg border border-(--explorer-border) bg-(--article-bg) text-(--text-color) shadow-2xl md:mx-0 md:mb-0 md:min-h-0 md:max-h-[70vh] md:rounded-none md:border-x-0 md:border-b-0"
        style={{ height: `min(${terminalHeight}px, 70vh)` }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div
          className="absolute left-0 right-0 top-0 z-10 hidden h-2 cursor-ns-resize items-center justify-center md:flex"
          onPointerDown={handleResizePointerDown}
          aria-label="Resize terminal"
          role="separator"
        >
          <span className="h-px w-14 bg-(--text-color) opacity-20 transition-opacity hover:opacity-45" />
        </div>

        <div className="flex items-center justify-between border-b border-(--explorer-border) bg-(--titlebar-bg)/90 px-3 py-2">
          <div className="flex min-w-0 items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-(--accent-color)" />
            <div className="min-w-0">
              <p className="font-mono text-xs text-(--accent-color)">
                terminal.workspace
              </p>
              <p className="truncate font-mono text-[10px] opacity-45">
                {activeFile.filename}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm border border-(--explorer-border) px-2 py-1 font-mono text-[11px] opacity-65 transition-colors hover:border-(--accent-color) hover:text-(--accent-color) hover:opacity-100"
          >
            close
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto bg-(--main-bg)/25 px-3 py-2 scrollbar-hide">
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-normal opacity-35">
            hints
          </span>
          {["help", "theme list", "theme next", "open github", "copy email"].map(
            (command) => (
              <button
                key={command}
                type="button"
                onClick={() => void runCommand(command)}
                className="shrink-0 rounded-sm bg-[rgba(var(--text-rgb),0.06)] px-2 py-0.5 font-mono text-[11px] opacity-65 transition-colors hover:bg-[rgba(var(--accent-rgb),0.16)] hover:text-(--accent-color) hover:opacity-100"
              >
                {command}
              </button>
            )
          )}
        </div>

        <div
          ref={outputRef}
          className="flex-1 cursor-text overflow-y-auto px-4 py-3 font-mono text-[12px] leading-6"
          onMouseDown={(event) => {
            const target = event.target as Element;
            if (!target.closest("button")) {
              inputRef.current?.focus();
            }
          }}
        >
          {history.map((entry, index) =>
            entry.type === "input" ? (
              <div key={`${entry.type}-${index}`} className="text-(--text-color)">
                <TerminalPrompt
                  activeFileName={activeFile.filename}
                  themeName={themeName}
                  pathname={pathname}
                  timestamp={timestamp}
                >
                  <span>{entry.text}</span>
                </TerminalPrompt>
              </div>
            ) : (
              <div
                key={`${entry.type}-${index}`}
                className="mb-3 text-(--text-color) opacity-75"
              >
                {entry.lines.map((line, lineIndex) => (
                  <p key={`${line}-${lineIndex}`}>{line}</p>
                ))}
                {entry.suggestion && (
                  <button
                    type="button"
                    onClick={() => void runCommand(entry.suggestion || "")}
                    className="mt-2 rounded-sm border border-(--explorer-border) px-2 py-1 text-[11px] text-(--accent-color) transition-colors hover:border-(--accent-color)"
                  >
                    run {entry.suggestion}
                  </button>
                )}
              </div>
            )
          )}

          <form onSubmit={handleSubmit} className="mt-1">
            <TerminalPrompt
              activeFileName={activeFile.filename}
              themeName={themeName}
              pathname={pathname}
              timestamp={timestamp}
            >
              <div className="relative">
                {autocompleteSuggestion && (
                  <span
                    className="pointer-events-none absolute top-0 text-(--text-color) opacity-25"
                    style={{ left: `${input.length}ch` }}
                  >
                    {autocompleteSuggestion}
                  </span>
                )}
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  className="relative w-full min-w-0 bg-transparent text-[12px] text-(--text-color) caret-(--accent-color) outline-hidden placeholder:text-[rgba(var(--text-rgb),0.34)]"
                  style={{ outline: "none" }}
                  placeholder="help"
                  aria-label="Terminal command"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>
            </TerminalPrompt>
          </form>
        </div>
      </motion.div>
    </motion.section>
  );
}
