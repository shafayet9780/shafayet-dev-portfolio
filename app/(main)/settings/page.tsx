"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Theme {
  name: string;
  icon: string;
  publisher: string;
  theme: string;
  description: string;
}

export default function SettingsPage() {
  const [activeTheme, setActiveTheme] = useState<string>("");
  
  const themes: Theme[] = [
    {
      name: "GitHub Dark",
      icon: "/github-dark.png",
      publisher: "GitHub",
      theme: "",
      description: "GitHub theme for VS Code"
    },
    {
      name: "Dracula",
      icon: "/dracula.png",
      publisher: "Dracula Theme",
      theme: "dracula",
      description: "Official Dracula Theme. A dark theme for many editors, shells, and more."
    },
    {
      name: "Nord",
      icon: "/nord.png",
      publisher: "Arctic Ice Studio",
      theme: "nord",
      description: "An arctic, north-bluish clean and elegant Visual Studio Code theme."
    },
    {
      name: "Night Owl",
      icon: "/night-owl.png",
      publisher: "Sarah Drasner",
      theme: "night-owl",
      description: "A VS Code theme for the night owls out there."
    }
  ];
  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "";
    setActiveTheme(savedTheme);
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, []);
  
  const setTheme = (theme: string) => {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", theme);
    localStorage.setItem("theme:user-set", "true");
    setActiveTheme(theme);
    window.dispatchEvent(new Event("portfolio:theme-change"));
  };

  return (
    <div className="py-4">
      <h1 className="text-4xl font-bold mb-8">Settings</h1>
      
      <h2 className="text-2xl font-semibold mb-4">Manage Themes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <div 
            key={theme.theme}
            className={`bg-(--article-bg) rounded-md p-4 flex flex-col items-center text-center transition-shadow ${
              activeTheme === theme.theme ? "ring-2 ring-(--accent-color)" : ""
            }`}
          >
            <div className="w-24 h-24 relative mb-4">
              <Image 
                src={theme.icon} 
                alt={theme.name}
                fill
                sizes="96px"
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg">{theme.name}</h3>
              <h5 className="text-sm opacity-80 mb-2">{theme.publisher}</h5>
              <p className="text-xs mb-4 opacity-70">{theme.description}</p>
              <button 
                onClick={() => setTheme(theme.theme)}
                className={`px-3 py-1 rounded-xs text-sm ${
                  activeTheme === theme.theme 
                    ? "bg-(--accent-color) text-(--main-bg)" 
                    : "bg-(--button-bg) text-(--button-text)"
                }`}
              >
                {activeTheme === theme.theme ? "Active" : "Set Color Theme"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
