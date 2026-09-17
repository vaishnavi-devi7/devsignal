import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Activity } from 'lucide-react';
import GithubBrandIcon from '../ui/GithubBrandIcon';
import Button from '../ui/Button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-md border-b border-border/50 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Left: Wordmark */}
        <Link to="/" className="flex items-center gap-2 group z-50">
          <Activity size={18} className="text-accent group-hover:opacity-80 transition-opacity" />
          <span className="font-semibold tracking-tight text-lg">DevSignal</span>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-secondary">
          <Link to="#product" className="hover:text-primary transition-colors">Product</Link>
          <Link to="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link to="#how-it-works" className="hover:text-primary transition-colors">How it works</Link>
        </nav>

        {/* Right: Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="https://github.com" target="_blank" rel="noreferrer" className="text-secondary hover:text-primary transition-colors">
            <GithubBrandIcon size={18} />
          </Link>
          <div className="h-4 w-px bg-border/50 mx-1"></div>
          <Link to="/login" className="text-sm font-medium text-secondary hover:text-primary transition-colors">Sign in</Link>
          <Link to="/register">
            <Button variant="primary" size="sm" className="h-8 rounded-full px-4 ">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden z-50 text-secondary hover:text-primary focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-background/95 backdrop-blur-xl z-40 transition-all duration-300 flex flex-col pt-24 px-6 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <nav className="flex flex-col gap-6 text-xl font-medium tracking-tight mb-8">
          <Link to="#product" onClick={() => setIsMobileMenuOpen(false)} className="text-primary hover:text-accent transition-colors">Product</Link>
          <Link to="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-primary hover:text-accent transition-colors">Features</Link>
          <Link to="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-primary hover:text-accent transition-colors">How it works</Link>
          <Link to="https://github.com" target="_blank" rel="noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="text-primary hover:text-accent transition-colors flex items-center gap-2">
            GitHub
          </Link>
        </nav>
        
        <div className="flex flex-col gap-4 mt-auto mb-12">
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="secondary" className="w-full h-12 text-base rounded-full">Sign in</Button>
          </Link>
          <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="primary" className="w-full h-12 text-base rounded-full ">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
