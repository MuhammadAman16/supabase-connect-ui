
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface HeroProps {
  className?: string;
  onConnect: () => void;
}

const Hero: React.FC<HeroProps> = ({ className, onConnect }) => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mouse movement effect for the hero section
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const rect = heroRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xPercentage = x / rect.width;
      const yPercentage = y / rect.height;
      
      const moveX = (xPercentage - 0.5) * 20;
      const moveY = (yPercentage - 0.5) * 20;
      
      const elements = heroRef.current.querySelectorAll('.parallax-element');
      elements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const strength = parseFloat(htmlEl.dataset.strength || '1');
        
        htmlEl.style.transform = `translate(${moveX * strength}px, ${moveY * strength}px)`;
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={heroRef}
      className={cn(
        "min-h-[90vh] flex flex-col items-center justify-center relative px-6",
        "overflow-hidden",
        className
      )}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-supabase/5 opacity-70 z-0"></div>
      
      {/* Floating elements */}
      <div 
        className="absolute w-60 h-60 rounded-full bg-supabase/5 blur-3xl top-1/3 -right-20 parallax-element" 
        data-strength="1.5"
      ></div>
      <div 
        className="absolute w-80 h-80 rounded-full bg-blue-500/5 blur-3xl bottom-1/4 -left-40 parallax-element" 
        data-strength="2"
      ></div>
      
      {/* Small floating pill decoration */}
      <div className="absolute top-1/4 right-1/3 glass-panel py-2 px-4 rounded-full text-xs font-medium animate-float parallax-element" data-strength="3">
        Seamless Integration
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-block bg-black/5 dark:bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-fade-in">
          The simplest way to connect with Supabase
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          Connect your app to <span className="text-supabase">Supabase</span> in minutes
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          Seamlessly integrate Supabase authentication, database, and storage into your applications with our intuitive OAuth2 flow.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <Button 
            className="supabase-button group h-12 min-w-[180px]"
            onClick={onConnect}
          >
            Connect Supabase
            <svg 
              className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
          <Button variant="outline" className="glass-button h-12 min-w-[180px]">
            Read Documentation
          </Button>
        </div>
      </div>
      
      {/* Wave decoration at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
    </div>
  );
};

export default Hero;
