import React, { useEffect, memo } from 'react';
import InteractiveHero from './InteractiveHero';
import { Header } from './modern-site/Header';
import { AboutSection } from './modern-site/AboutSection';
import { BreakSection } from './modern-site/BreakSection';
import { ServicesSection } from './modern-site/ServicesSection';
import { WorkSection } from './modern-site/WorkSection';
import { TeamSection } from './modern-site/TeamSection';
import { PricingSection } from './modern-site/PricingSection';
import { ContactSection } from './modern-site/ContactSection';
import { Footer } from './modern-site/Footer';
import { BrandCarouselSection } from './modern-site/BrandCarouselSection';
import { StatsSection } from './modern-site/StatsSection';
import { QuoteSection } from './modern-site/QuoteSection';
import { TestimonialCarouselSection } from './modern-site/TestimonialCarouselSection';
import { ExaggeratedStatsSection } from './modern-site/ExaggeratedStatsSection';
import { EvenAnotherQuoteSection } from './modern-site/EvenAnotherQuoteSection';
import { ModernSiteProps } from '../types/index';
import AITools from './modern-site/ai';
import { posthog } from '../lib/posthog';

const ModernSite: React.FC<ModernSiteProps> = memo(({ onBack, setCurrentView }) => {
  useEffect(() => {
    // Track page view with PostHog
    posthog.capture('page_view', { page: 'modern_site' });
    
    // Preload critical images for better performance
    const preloadImages = [
      '/bg1.png',
      '/bg2.png', 
      '/bg3.png',
      '/bg4.png'
    ];
    
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
    
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-gray-300 overflow-x-hidden font-light tracking-tight">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      {/* Header */}
      <Header onBack={onBack} />

      {/* Main Content */}
      <main id="main-content" className="relative" role="main" tabIndex={-1}>
        {/* Hero Section */}
        <section aria-label="Hero section">
          <InteractiveHero />
        </section>

        {/* Break Section with Brand Carousel */}
        <section aria-label="Brand showcase">
          <BreakSection backgroundImage="/bg1.png" reducedPadding>
            <BrandCarouselSection />
          </BreakSection>
        </section>

        {/* About Section */}
        <AboutSection />

        {/* Break Section with Stats */}
        <section aria-label="Statistics">
          <BreakSection backgroundImage="/bg2.png" reducedPadding>
            <StatsSection />
          </BreakSection>
        </section>

        {/* Services Section */}
        <ServicesSection />

        {/* Break Section with Quote */}
        <section aria-label="Client testimonial">
          <BreakSection backgroundImage="/bg3.png" reducedPadding>
            <QuoteSection />
          </BreakSection>
        </section>

        {/* Our Work Section */}
        <WorkSection />

        {/* Break Section with Testimonials */}
        <section aria-label="Client testimonials">
          <BreakSection backgroundImage="/bg4.png" reducedPadding>
            <TestimonialCarouselSection />
          </BreakSection>
        </section>

        {/* Team Section */}
        <TeamSection />

        {/* Break Section with Exaggerated Stats */}
        <section aria-label="Performance statistics">
          <BreakSection backgroundImage="/bg1.png" reducedPadding>
            <ExaggeratedStatsSection />
          </BreakSection>
        </section>

        {/* Pricing Section */}
        <PricingSection />

        {/* Break Section with Even Another Quote */}
        <section aria-label="Additional testimonial">
          <BreakSection backgroundImage="/bg2.png">
            <EvenAnotherQuoteSection />
          </BreakSection>
        </section>

        {/* Contact Section */}
        <ContactSection />

      </main>

      {/* AI Tools */}
      <AITools />

      {/* Footer */}
      <Footer onAdminClick={() => {
        posthog.capture('admin_click');
        setCurrentView('admin');
      }} />
    </div>
  );
});

export default ModernSite;