"use client";

const ErrorIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM8 12C7.4 12 7 11.6 7 11C7 10.4 7.4 10 8 10C8.6 10 9 10.4 9 11C9 11.6 8.6 12 8 12ZM9 9H7V4H9V9Z" fill="#F48771" />
  </svg>
);

const WarningIcon = ({ className }: { className?: string }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M7.56 0H8.44L16 15H0L7.56 0ZM8 12.5C7.17 12.5 6.5 13.17 6.5 14C6.5 14.83 7.17 15.5 8 15.5C8.83 15.5 9.5 14.83 9.5 14C9.5 13.17 8.83 12.5 8 12.5ZM7 5V11H9V5H7Z" fill="#CCA700" />
  </svg>
);

const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6C12 4.4087 11.3679 2.88258 10.2426 1.75736C9.11742 0.632141 7.5913 0 6 0C4.4087 0 2.88258 0.632141 1.75736 1.75736C0.632141 2.88258 0 4.4087 0 6C0 11 -2 14 1 15H11C14 14 12 11 12 6Z" fill="currentColor" />
    <path d="M6 16C6.79565 16 7.55871 15.6839 8.12132 15.1213C8.68393 14.5587 9 13.7956 9 13H3C3 13.7956 3.31607 14.5587 3.87868 15.1213C4.44129 15.6839 5.20435 16 6 16Z" fill="currentColor" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.59 9.59L2.72 6.72L1.28 8.16L5.59 12.47L14.31 3.75L12.87 2.31L5.59 9.59Z" fill="currentColor" />
  </svg>
);

const NextjsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1.2C4.23 1.2 1.2 4.23 1.2 8C1.2 11.77 4.23 14.8 8 14.8C9.58 14.8 11.03 14.27 12.18 13.37L6.14 9.04V12.75H5.12V7.6H6.14L13.03 11.86C13.86 10.75 14.35 9.43 14.35 8C14.35 4.23 11.32 1.2 7.55 1.2H8ZM12.32 11.41L6.14 8.62V11.71L11.21 14.08C11.63 13.87 12.02 13.62 12.32 11.41Z" fill="currentColor" />
  </svg>
);

const SourceControlIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M14 7H12.41L8.7 3.29L7.29 4.7L8.59 6H2L1 7V14L2 15H14L15 14V8L14 7ZM13 13H3V8H13V13Z" fill="currentColor" />
  </svg>
);

export default function Bottombar() {
  return (
    <footer className="h-[25px] bg-[--bottombar-bg] text-[--bottombar-text] flex justify-between text-sm border-t border-[--bottombar-border]">
      {/* Left section */}
      <div className="flex items-center">
        <a
          href="https://github.com/shafayet-dev/portfolio"
          target="_blank"
          rel="noreferrer noopener"
          className="px-2 h-full flex items-center hover:bg-[--bottombar-hover-bg] transition-colors group"
        >
          <SourceControlIcon />
          <p className="ml-1 font-medium tracking-tight group-hover:translate-x-0.5 transition-transform">main</p>
        </a>
        
        <div className="h-full px-2 flex items-center hover:bg-[--bottombar-hover-bg] transition-colors">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <ErrorIcon />
              <p className="ml-1 text-[#F48771] font-medium">0</p>
            </div>
            
            <div className="flex items-center">
              <WarningIcon className="mr-1" />
              <p className="text-[#CCA700] font-medium">0</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right section */}
      <div className="flex items-center">
        <div className="h-full px-2 flex items-center hover:bg-[--bottombar-hover-bg] transition-colors group">
          <NextjsIcon />
          <p className="ml-1 group-hover:translate-x-0.5 transition-transform">Next.js + Sanity</p>
        </div>
        
        <div className="h-full px-2 flex items-center hover:bg-[--bottombar-hover-bg] transition-colors group">
          <CheckIcon />
          <p className="ml-1 group-hover:translate-x-0.5 transition-transform">Prettier</p>
        </div>
        
        <div className="h-full px-2 flex items-center hover:bg-[--bottombar-hover-bg] transition-colors">
          <BellIcon />
        </div>
      </div>
    </footer>
  );
} 