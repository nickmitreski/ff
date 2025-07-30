import { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { Frame } from './components/ChoiceAnimation/Frame';
import { ViewType } from './types/index';
import './styles/global.css';
import { posthog } from './lib/posthog';
import { analytics, trackPageView, trackFeatureUsage } from './lib/analytics-new';
import { WindowManagerProvider } from './contexts/WindowManagerContext';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load large components for performance
const Windows95Desktop = lazy(() => import('./components/Windows95/Desktop'));
const ModernSite = lazy(() => import('./components/ModernSite'));
const AdminPage = lazy(() => import('./components/AdminPage'));
const IPhone = lazy(() => import('./components/iPhoneEmu'));

// Preload functions for each component to improve perceived speed
const preloadWindows95 = () => import('./components/Windows95/Desktop');
const preloadModernSite = () => import('./components/ModernSite');
const preloadIPhone = () => import('./components/iPhoneEmu');

// Preload queue to track loading status and avoid duplicate loads
const preloadQueue = new Map<string, Promise<unknown>>();

// Enhanced preload function with caching to prevent redundant requests
const preloadComponent = (key: string, preloadFn: () => Promise<unknown>) => {
  if (!preloadQueue.has(key)) {
    preloadQueue.set(key, preloadFn());
  }
  return preloadQueue.get(key);
};

// Custom hook to detect mobile view using media query
function useIsMobile() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 768px)').matches;
}

function App(): JSX.Element {
  // Track which view is currently active (landing, 1996, 2025, admin)
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const isMobile = useIsMobile();

  // Preload components when user hovers over a year option
  const handleYearHover = useCallback((year: '1996' | '2025') => {
    if (year === '1996') {
      if (isMobile) {
        preloadComponent('iphone', preloadIPhone);
      } else {
        preloadComponent('windows95', preloadWindows95);
      }
    } else if (year === '2025') {
      preloadComponent('modernsite', preloadModernSite);
    }
  }, [isMobile]);

  // Handle year selection, preload, and switch view
  const handleYearSelect = useCallback(async (year: '1996' | '2025') => {
    posthog.capture('year_selected', { year });
    trackFeatureUsage('year_selection', 'selected', { year, is_mobile: isMobile });
    try {
      // Ensure component is preloaded before navigation
      if (year === '1996') {
        if (isMobile) {
          await preloadComponent('iphone', preloadIPhone);
        } else {
          await preloadComponent('windows95', preloadWindows95);
        }
      } else if (year === '2025') {
        await preloadComponent('modernsite', preloadModernSite);
      }
      // Navigate immediately after preload
      setCurrentView(year);
    } catch (error) {
      console.error('Preload failed:', error);
      // Still navigate even if preload fails
      setCurrentView(year);
    }
  }, [isMobile]);

  // Track view changes with enhanced analytics
  useEffect(() => {
    posthog.capture('view_changed', { view: currentView });
    trackPageView(currentView, { view_type: currentView });
    
    // Track user journey progress
    if (currentView === 'landing') {
      analytics.trackUserJourney('landing_page_view');
    } else if (currentView === '1996') {
      analytics.trackUserJourney('feature_exploration', { feature: 'retro_emulator' });
    } else if (currentView === '2025') {
      analytics.trackUserJourney('feature_exploration', { feature: 'modern_site' });
    } else if (currentView === 'admin') {
      analytics.trackUserJourney('admin_access');
    }
  }, [currentView]);

  // Preload likely next components on mount for better UX
  useEffect(() => {
    if (isMobile) {
      preloadComponent('iphone', preloadIPhone);
    } else {
      preloadComponent('windows95', preloadWindows95);
    }
    preloadComponent('modernsite', preloadModernSite);
  }, [isMobile]);

  return (
    <ErrorBoundary>
      <div className="app-container">
        {/* Landing screen with year selection */}
        {currentView === 'landing' && (
          <Frame 
            onYearSelect={handleYearSelect}
            onYearHover={handleYearHover}
          />
        )}
        {/* 1996 experience: Windows 95 or iPhone emulation */}
        {currentView === '1996' && (
          isMobile ? (
            <Suspense fallback={null}>
              <ErrorBoundary>
                <IPhone setCurrentView={setCurrentView} />
              </ErrorBoundary>
            </Suspense>
          ) : (
            <Suspense fallback={null}>
              <ErrorBoundary>
                <WindowManagerProvider>
                  <Windows95Desktop onBack={() => setCurrentView('2025')} setCurrentView={setCurrentView} />
                </WindowManagerProvider>
              </ErrorBoundary>
            </Suspense>
          )
        )}
        {/* 2025 experience: Modern site */}
        {currentView === '2025' && (
          <Suspense fallback={null}>
            <ErrorBoundary>
              <ModernSite onBack={() => setCurrentView('landing')} setCurrentView={setCurrentView} />
            </ErrorBoundary>
          </Suspense>
        )}
        {/* Admin view */}
        {currentView === 'admin' && (
          <Suspense fallback={null}>
            <ErrorBoundary>
              <AdminPage />
            </ErrorBoundary>
          </Suspense>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;