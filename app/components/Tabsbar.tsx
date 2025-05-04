"use client";

import Tab from './Tab';

export default function Tabsbar() {
  return (
    <div className="flex h-[40px] bg-[--tabs-bg] border-b border-[--explorer-border] overflow-x-auto scrollbar-hide">
      <Tab icon="/react_icon.svg" filename="home.jsx" path="/" />
      <Tab icon="/html_icon.svg" filename="about.html" path="/about" />
      <Tab icon="/css_icon.svg" filename="contact.css" path="/contact" />
      <Tab icon="/js_icon.svg" filename="projects.js" path="/projects" />
      <Tab icon="/json_icon.svg" filename="blog.json" path="/blog" />
      <Tab icon="/markdown_icon.svg" filename="github.md" path="/github" />
    </div>
  );
} 