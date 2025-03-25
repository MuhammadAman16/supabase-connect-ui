
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12",
      "backdrop-blur-md bg-white/70 dark:bg-black/30 border-b border-black/5",
      "transition-all duration-500 ease-apple",
      className
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-supabase to-supabase/80 animate-float"></div>
          <span className="font-medium text-lg">SupaIntegrate</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/docs">Documentation</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/about">About</Link>
          </Button>
          <Button className="bg-black text-white hover:bg-black/90 rounded-full px-5">
            Log In
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
