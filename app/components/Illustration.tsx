"use client";

import React, { useEffect, useRef, useState } from 'react';

// Fixed particle positions for initial server-side rendering to avoid hydration mismatch
const initialParticles = [
  { cx: 190, cy: 120, r: 1.5, opacity: 0.6 },
  { cx: 300, cy: 200, r: 2, opacity: 0.5 },
  { cx: 400, cy: 150, r: 1.8, opacity: 0.7 },
  { cx: 250, cy: 300, r: 1.2, opacity: 0.8 },
  { cx: 150, cy: 250, r: 2.5, opacity: 0.4 },
  { cx: 350, cy: 350, r: 1.7, opacity: 0.6 },
  { cx: 450, cy: 250, r: 2.2, opacity: 0.5 },
  { cx: 100, cy: 350, r: 1.9, opacity: 0.7 },
  { cx: 380, cy: 420, r: 1.5, opacity: 0.6 },
  { cx: 280, cy: 150, r: 2.3, opacity: 0.5 },
  { cx: 210, cy: 420, r: 1.6, opacity: 0.7 },
  { cx: 450, cy: 380, r: 2.1, opacity: 0.4 },
];

export default function Illustration(props: React.SVGProps<SVGSVGElement>) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts in the browser
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!svgRef.current || !isClient) return;
    
    // Get all animated elements
    const circle1 = svgRef.current.querySelector('.circle-1');
    const circle2 = svgRef.current.querySelector('.circle-2');
    const circle3 = svgRef.current.querySelector('.circle-3');
    const shape1 = svgRef.current.querySelector('.shape-1');
    const shape2 = svgRef.current.querySelector('.shape-2');
    const grid = svgRef.current.querySelector('.grid-pattern');
    
    // Add subtle pulse animation to circles
    [circle1, circle2, circle3].forEach((circle, index) => {
      if (!circle) return;
      
      // Initial random scale
      const scale = 0.95 + Math.random() * 0.1;
      circle.setAttribute('transform', `scale(${scale})`);
      
      // Animation
      const animate = () => {
        const delay = index * 400; // Stagger animations
        setTimeout(() => {
          // Random pulsation
          const duration = 2000 + Math.random() * 2000;
          const newScale = 0.97 + Math.random() * 0.06;
          
          // Apply animation with CSS
          circle.animate([
            { transform: `scale(${scale})` },
            { transform: `scale(${newScale})` },
            { transform: `scale(${scale})` }
          ], {
            duration,
            easing: 'ease-in-out',
            iterations: 1
          }).onfinish = animate;
        }, delay);
      };
      
      animate();
    });
    
    // Subtle rotation of main shapes
    [shape1, shape2].forEach((shape, index) => {
      if (!shape) return;
      
      const animate = () => {
        const duration = 20000 + Math.random() * 10000;
        const direction = index % 2 === 0 ? 1 : -1;
        
        shape.animate([
          { transform: 'rotate(0deg)' },
          { transform: `rotate(${direction * 5}deg)` },
          { transform: 'rotate(0deg)' },
        ], {
          duration,
          easing: 'ease-in-out',
          iterations: 1
        }).onfinish = animate;
      };
      
      animate();
    });
    
    // Subtle opacity change for grid
    if (grid) {
      const animate = () => {
        const duration = 8000;
        
        grid.animate([
          { opacity: 0.3 },
          { opacity: 0.6 },
          { opacity: 0.3 }
        ], {
          duration,
          easing: 'ease-in-out',
          iterations: 1
        }).onfinish = animate;
      };
      
      animate();
    }
  }, [isClient]);

  return (
    <svg
      ref={svgRef}
      width={600}
      height={600}
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Grid pattern for tech feel */}
      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse" className="grid-pattern">
        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.5" />
      </pattern>
      <rect width="600" height="600" fill="url(#grid)" fillOpacity="0.3" />
      
      {/* Main circles */}
      <circle className="circle-1" cx={190} cy={120} r={70} fill="var(--accent-color)" fillOpacity="0.7" />
      <circle className="circle-2" cx={90} cy={250} r={40} fill="currentColor" fillOpacity="0.9" />
      <circle className="circle-3" cx={420} cy={180} r={25} fill="#D7F484" fillOpacity="0.8" />
      
      {/* Decorative elements */}
      <path 
        className="shape-1"
        d="M520 300c0 55.23-44.77 100-100 100s-100-44.77-100-100 44.77-100 100-100 100 44.77 100 100z" 
        fill="currentColor" 
        fillOpacity="0.08" 
      />
      <path 
        className="shape-2"
        d="M340 420c0 66.27-53.73 120-120 120s-120-53.73-120-120 53.73-120 120-120 120 53.73 120 120z" 
        fill="currentColor" 
        fillOpacity="0.12" 
      />
      
      {/* Main shape with depth */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M486 144.469c-38.145-31.86-87.255-51.033-140.842-51.033-121.415 0-219.842 98.427-219.842 219.842 0 14.167 1.34 28.02 3.9 41.441 47.414-86.154 91.678-142.17 146.717-170.767 56.069-29.132 121.816-29.08 210.067-6.68v-32.803zm0 48.288v289.33c-38.145 31.86-87.255 51.033-140.842 51.033-100.321 0-184.947-67.197-211.325-159.037l1.502.805c49.937-93.22 94.046-149.844 147.514-177.625 52.014-27.025 114.411-27.498 203.151-4.506z"
        fill="currentColor"
      />
      
      {/* Code-like elements */}
      <g className="code-elements" opacity="0.7">
        <rect x="250" y="30" width="120" height="8" rx="4" fill="currentColor" fillOpacity="0.4" />
        <rect x="270" y="50" width="80" height="8" rx="4" fill="currentColor" fillOpacity="0.3" />
        <rect x="290" y="70" width="40" height="8" rx="4" fill="currentColor" fillOpacity="0.2" />
      </g>
      
      {/* Particles - use fixed values for server rendering, apply random values in client only */}
      {initialParticles.map((particle, i) => (
        <circle 
          key={i}
          cx={isClient ? 100 + Math.random() * 400 : particle.cx}
          cy={isClient ? 100 + Math.random() * 400 : particle.cy}
          r={isClient ? 1 + Math.random() * 2 : particle.r}
          fill="currentColor"
          fillOpacity={isClient ? 0.4 + Math.random() * 0.6 : particle.opacity}
          className="particle"
        />
      ))}
    </svg>
  );
} 