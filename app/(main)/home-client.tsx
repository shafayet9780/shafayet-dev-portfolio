"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Illustration from "../components/Illustration";
import Image from "next/image";

// Types for data
interface SiteSettings {
  mainName?: string;
  jobTitle?: string;
  headerText?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  bio?: string;
}

interface Project {
  title: string;
  slug?: { current: string };
  description?: string;
  imageUrl?: string;
  tags?: string[];
}

interface Post {
  title: string;
  slug?: { current: string };
  excerpt?: string;
  imageUrl?: string;
  publishedAt?: string;
}

interface SectionRefs {
  [key: string]: HTMLElement | null;
}

// Animated typing component
function TypedEffect({ text, speed = 70, startDelay = 500 }: { text?: string, speed?: number, startDelay?: number }) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const textRef = useRef(text);

  // Reset effect when text changes
  useEffect(() => {
    textRef.current = text;
    setDisplayText("");
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (!textRef.current) return;
    
    // Start with initial delay
    const initialDelay = setTimeout(() => {
      const interval = setInterval(() => {
        if (isPaused) return;
        
        setCurrentIndex(prevIndex => {
          if (prevIndex < (textRef.current?.length || 0)) {
            // Get the current character
            const newChar = textRef.current?.[prevIndex] || '';
            // Set the display text directly, not by appending to previous text
            setDisplayText(textRef.current?.substring(0, prevIndex + 1) || '');
            return prevIndex + 1;
          } else {
            clearInterval(interval);
            return prevIndex;
          }
        });
      }, speed);
      
      return () => clearInterval(interval);
    }, startDelay);
    
    return () => clearTimeout(initialDelay);
  }, [speed, startDelay, isPaused]);

  return (
    <span className="font-mono inline-flex items-center">
      {displayText}
      <span className="h-5 w-[1px] animate-cursor bg-[--accent-color] inline-block" />
    </span>
  );
}

// Moving particles background
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!isClient) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const particles: Particle[] = [];
    
    // Resize handler
    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Create particles
    class Particle {
      x: number = 0;
      y: number = 0;
      size: number = 1;
      speedX: number = 0;
      speedY: number = 0;
      color: string = '';
      
      constructor() {
        if (!canvas) return;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
      }
      
      update() {
        if (!canvas) return;
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const createParticles = () => {
      const particleCount = Math.min(100, Math.floor(window.innerWidth / 20));
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    
    createParticles();
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (const particle of particles) {
        particle.update();
        particle.draw();
      }
      
      // Draw connections
      connectParticles();
      
      requestAnimationFrame(animate);
    };
    
    const connectParticles = () => {
      const maxDistance = 100;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(var(--text-rgb), ${0.05 * (1 - distance / maxDistance)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isClient]);
  
  if (!isClient) {
    return null; // Return nothing on server side to prevent hydration mismatch
  }
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 opacity-30" 
    />
  );
}

// Code snippet component
function CodeSnippet({ language = "javascript", code, className = "" }: { language?: string, code: string, className?: string }) {
  return (
    <div className={`bg-[--editor-bg] rounded-md shadow-xl overflow-hidden ${className}`}>
      <div className="flex items-center px-4 py-2 bg-[--titlebar-bg] border-b border-[--titlebar-border]">
        <div className="flex space-x-2 mr-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28ca41]"></div>
        </div>
        <div className="text-xs text-[--text-color] opacity-70">
          {language === "javascript" ? "script.js" : language === "jsx" ? "component.jsx" : "code.txt"}
        </div>
      </div>
      <pre className="p-4 text-sm font-mono text-[--text-color] overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Custom project card component with hover effects
function ProjectPreview({ project, index }: { project: Project, index: number }) {
  return (
    <div 
      className="group bg-[--editor-bg] rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border border-[--explorer-border] hover:border-[--accent-color]"
      style={{ animationDelay: `${index * 200}ms` }}
    >
      <div className="relative h-48 overflow-hidden">
        {project.imageUrl ? (
          <Image 
            src={project.imageUrl} 
            alt={project.title} 
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[--editor-bg] to-transparent opacity-60" />
        
        {/* Tags overlay */}
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
          {project.tags?.map((tag, i) => (
            <span 
              key={i} 
              className="text-xs px-2 py-1 rounded-full bg-[--accent-color] bg-opacity-30 text-[--text-color]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-[--text-color] group-hover:text-[--accent-color]">
          {project.title}
        </h3>
        <p className="text-sm text-[--text-color] opacity-70 line-clamp-2">
          {project.description}
        </p>
      </div>
      
      <div className="border-t border-[--explorer-border] p-3 flex justify-end">
        <Link 
          href={`/projects/${project.slug?.current || '#'}`}
          className="text-sm text-[--accent-color] hover:underline flex items-center group-hover:translate-x-1 transition-transform"
        >
          View Project
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

// Home page client component - receives data from server component
export default function HomePage({ 
  siteSettings = {}, 
  projects = [], 
  posts = [] 
}: {
  siteSettings?: SiteSettings;
  projects?: Project[];
  posts?: Post[];
}) {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const sectionsRef = useRef<SectionRefs>({});
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true on mount to handle client-side only code
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Default values in case settings aren't found
  const {
    mainName = "Shafayet Ahmmed",
    jobTitle = "Full Stack Web Developer",
    headerText = "I BUILD WEBSITES",
    ctaText = "View Work",
    ctaLink = "/projects",
    secondaryCtaText = "Contact Me",
    secondaryCtaLink = "/contact",
    bio = "I'm a passionate developer creating modern web experiences with React, Next.js, and more."
  } = siteSettings || {};

  useEffect(() => {
    if (!isClient) return;
    
    const handleScroll = () => {
      const mainRef = document.querySelector('main');
      if (!mainRef) return;
      setScrollY(mainRef.scrollTop);
      
      // Update active section based on scroll position
      const scrollPosition = mainRef.scrollTop + 100;
      Object.entries(sectionsRef.current).forEach(([key, ref]) => {
        if (ref && scrollPosition >= ref.offsetTop && scrollPosition < ref.offsetTop + ref.offsetHeight) {
          setActiveSection(key);
        }
      });
    };
    
    const mainElement = document.querySelector('main');
    
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
    }
    
    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isClient]);

  // Sample code snippets
  const introCodeSnippet = `const developer = {
  name: "${mainName}",
  title: "${jobTitle}",
  skills: ["JavaScript", "React", "Next.js", "Node.js"],
  passion: "Building beautiful web experiences"
};

// Let's create something amazing together!
function connect() {
  return developer.openToWork 
    ? "Let's collaborate!" 
    : "Check out my projects";
}`;

  // Easter egg console message
  useEffect(() => {
    if (!isClient) return;
    
    console.log(
      "%cWelcome to my portfolio! 👋",
      "color: #3b82f6; font-size: 24px; font-weight: bold;"
    );
    console.log(
      "%cFeel free to explore the code. I'm always open to opportunities and collaborations!",
      "font-size: 14px;"
    );
  }, [isClient]);

  // Transformations are client-side only to prevent hydration mismatches
  const getTransform = (scrollPos: number, threshold: number) => {
    if (!isClient) return {};
    return {
      transform: `translateY(${Math.min(0, (scrollPos - threshold) * 0.1)}px)`,
      opacity: Math.min(1, Math.max(0, (scrollPos - (threshold - 200)) / 400))
    };
  };

  return (
    <>
      {/* Particle background - client-side only */}
      {isClient && <ParticleBackground />}
      
      {/* Hero section */}
      <section 
        ref={(el: HTMLElement | null) => { sectionsRef.current.hero = el; }}
        className="min-h-[calc(100vh-150px)] flex flex-col justify-center relative"
      >
        <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[--bg-text] opacity-[0.03] whitespace-nowrap">
          <h1 className="text-8xl md:text-[200px] font-bold tracking-tighter">
            {headerText}
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center z-10">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="space-y-6">
              <div className="flex space-x-3 items-center">
                <div className="h-1 w-12 bg-[--accent-color]"></div>
                <span className="text-[--accent-color] font-mono tracking-wide">Hello World</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-[--text-color] leading-tight">
                I'm <span className="text-[--accent-color]">{mainName}</span>.
                <br />
                <span className="text-2xl md:text-3xl">
                  {isClient && <TypedEffect text={jobTitle} />}
                  {!isClient && <span className="font-mono">{jobTitle}</span>}
                </span>
              </h1>
              
              <p className="text-lg text-[--text-color] opacity-70 max-w-2xl">
                {bio}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href={ctaLink || '#'}>
                  <button className="px-6 py-3 bg-[--accent-color] text-white rounded-md hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl hover:translate-y-[-2px] flex items-center">
                    <span>{ctaText}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </Link>
                <Link href={secondaryCtaLink || '#'}>
                  <button className="px-6 py-3 border border-[--accent-color] text-[--accent-color] rounded-md hover:bg-[--accent-color] hover:bg-opacity-10 transition-all">
                    {secondaryCtaText}
                  </button>
                </Link>
              </div>
              
              <div className="flex space-x-4 pt-6">
                <a href="https://github.com/shafayet-dev" target="_blank" rel="noopener noreferrer" className="text-[--text-color] opacity-70 hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C20.565 21.795 24 17.295 24 12C24 5.37 18.63 0 12 0Z" />
                  </svg>
                </a>
                <a href="https://linkedin.com/in/shafayet-dev" target="_blank" rel="noopener noreferrer" className="text-[--text-color] opacity-70 hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0H5C2.239 0 0 2.239 0 5V19C0 21.761 2.239 24 5 24H19C21.761 24 24 21.761 24 19V5C24 2.239 21.761 0 19 0ZM8 19H5V8H8V19ZM6.5 6.732C5.534 6.732 4.75 5.942 4.75 4.968C4.75 3.994 5.534 3.204 6.5 3.204C7.466 3.204 8.25 3.994 8.25 4.968C8.25 5.942 7.467 6.732 6.5 6.732ZM20 19H17V13.396C17 10.028 13 10.283 13 13.396V19H10V8H13V9.765C14.396 7.179 20 6.988 20 12.241V19Z" />
                  </svg>
                </a>
                <a href="https://twitter.com/shafayet_dev" target="_blank" rel="noopener noreferrer" className="text-[--text-color] opacity-70 hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 order-1 lg:order-2 flex justify-center relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full bg-gradient-to-r from-[--accent-color] to-purple-600 opacity-5 blur-2xl animate-pulse"></div>
            <div className="relative z-10">
              {/* Render illustration on client-side only to prevent hydration mismatch with SVG */}
              {isClient ? (
                <Illustration className="w-full max-w-lg text-[--accent-color]" />
              ) : (
                <div className="w-full max-w-lg h-80 bg-[--editor-bg] rounded-lg opacity-30"></div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Interactive Code section - only apply transformations on client side */}
      <section 
        ref={(el: HTMLElement | null) => { sectionsRef.current.code = el; }}
        className="my-24 relative" 
        style={isClient ? getTransform(scrollY, 400) : {}}
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex space-x-3 items-center mb-8">
            <div className="h-1 w-12 bg-[--accent-color]"></div>
            <span className="text-[--accent-color] font-mono tracking-wide">Developer.introduce()</span>
          </div>
          
          <CodeSnippet code={introCodeSnippet} className="shadow-2xl transform hover:-rotate-1 transition-transform" />
        </div>
      </section>
      
      {/* Featured Projects section - only apply transformations on client side */}
      <section 
        ref={(el: HTMLElement | null) => { sectionsRef.current.projects = el; }}
        className="my-24 relative"
        style={isClient ? getTransform(scrollY, 800) : {}}
      >
        <div className="mb-12">
          <div className="flex space-x-3 items-center mb-6">
            <div className="h-1 w-12 bg-[--accent-color]"></div>
            <span className="text-[--accent-color] font-mono tracking-wide">Featured Works</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-[--text-color]">Recent Projects</h2>
          <p className="text-[--text-color] opacity-70 mt-4 max-w-2xl">Check out some of my latest works and creative experiments.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects?.map((project, index) => (
            <ProjectPreview key={project.slug?.current || index} project={project} index={index} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/projects">
            <button className="px-6 py-3 border border-[--accent-color] text-[--accent-color] rounded-md hover:bg-[--accent-color] hover:bg-opacity-10 transition-all inline-flex items-center">
              <span>View All Projects</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </Link>
        </div>
      </section>
    </>
  );
} 