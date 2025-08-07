import React, { useState, useEffect, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ArrowLeft } from 'lucide-react';
import { colors, typography, transitions, spacing } from '../../theme/theme';

interface HeaderProps {
  onBack: () => void;
}

export const Header: React.FC<HeaderProps> = memo(({ onBack }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const navItems = useMemo(() => [
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'work', label: 'Work' },
    { id: 'team', label: 'Team' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'contact', label: 'Contact' }
  ], []);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false);
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.id);
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 ${colors.background.overlay.dark} backdrop-blur-md z-50 border-b ${colors.border.dark}`}
      role="banner"
      aria-label="Main navigation"
    >
      <nav className={`container mx-auto ${spacing.container.padding} py-4`} role="navigation" aria-label="Primary navigation">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className={`flex items-center gap-2 ${colors.text.gray[400]} hover:text-white ${transitions.colors} ${typography.tracking.tight}`}
            aria-label="Go back to previous page"
          >
            <ArrowLeft size={20} />
            <span>back</span>
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8" role="menubar">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`${colors.text.gray[400]} hover:text-white ${transitions.colors} ${typography.tracking.tight} ${
                  activeSection === item.id ? 'text-white font-medium' : ''
                }`}
                role="menuitem"
                aria-label={`Navigate to ${item.label} section`}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden ${colors.text.gray[400]} hover:text-white`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <motion.div 
        id="mobile-menu"
        className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        role="menu"
        aria-label="Mobile navigation menu"
      >
        <div className={`px-4 py-3 space-y-3 ${colors.background.dark} border-t ${colors.border.dark}`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`block w-full text-left ${colors.text.gray[400]} hover:text-white ${transitions.colors} ${typography.tracking.tight} ${
                activeSection === item.id ? 'text-white font-medium' : ''
              }`}
              role="menuitem"
              aria-label={`Navigate to ${item.label} section`}
              aria-current={activeSection === item.id ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
        </div>
      </motion.div>
    </header>
  );
});