# Project Documentation

## 📋 Overview

This is a comprehensive web application that recreates nostalgic computing experiences from the 90s and early 2000s. The project features multiple UI layers including Windows 95, iPhone emulator, and modern interfaces, with AI-powered features, games, and interactive elements.

## 🛠 Tech Stack

### **Frontend Framework**
- **React 18** with TypeScript
- **Vite** for build tooling and development server
- **Tailwind CSS** for styling with custom theme configuration

### **Backend & Database**
- **Supabase** for:
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - Edge Functions (serverless)
  - Storage
- **Vercel** for hosting and deployment

### **AI & External APIs**
- **OpenAI GPT-3.5-turbo** (primary LLM)
- **Mistral AI** (secondary LLM for messaging)
- **Replicate** for AI image generation
- **Google APIs**: Maps, YouTube, PageSpeed Insights
- **SerpAPI** for SEO audit functionality

### **Analytics & Monitoring**
- **PostHog** for user analytics and feature flags
- **Custom error boundaries** for error handling

### **Development Tools**
- **ESLint** for code linting
- **TypeScript** for type safety
- **Framer Motion** for animations
- **React Router** for navigation

## 📁 Directory Structure

```
├── public/                          # Static assets and games
│   ├── games/                       # Retro game emulators
│   │   ├── diablo/                  # Diablo game files
│   │   ├── donkeykongbananza/       # Donkey Kong game
│   │   ├── doom/                    # Doom game
│   │   ├── mario-master-2/          # Mario game
│   │   ├── pacman/                  # Pac-Man game
│   │   └── ...                      # Other games
│   ├── Iphone_Games/                # Mobile-style games
│   ├── jspaint-main/                # MS Paint clone
│   ├── fonts/                       # Custom fonts
│   ├── sounds/                      # Audio files
│   └── [various assets]             # Images, icons, etc.
├── src/
│   ├── components/                  # React components
│   │   ├── admin/                   # Admin panel components
│   │   ├── iPhoneEmu/               # iPhone emulator UI
│   │   ├── modern-site/             # Modern UI components
│   │   ├── Windows95/               # Windows 95 UI components
│   │   └── ui/                      # Shared UI components
│   ├── contexts/                    # React contexts
│   │   ├── WindowManagerContext.tsx # Window management
│   │   └── WindowsContext.tsx       # Windows state
│   ├── data/                        # Static data and configurations
│   ├── hooks/                       # Custom React hooks
│   ├── lib/                         # Utility libraries
│   │   ├── analytics.ts             # Analytics utilities
│   │   ├── llm.ts                   # AI/LLM integration
│   │   ├── posthog.ts               # PostHog configuration
│   │   └── supabase.ts              # Supabase client
│   ├── styles/                      # CSS files
│   ├── theme/                       # Theme configuration
│   └── types/                       # TypeScript type definitions
├── supabase/                        # Supabase configuration
│   ├── functions/                   # Edge functions
│   │   ├── generate-image/          # Image generation
│   │   ├── poll-replicate/          # Replicate polling
│   │   └── seo-audit/               # SEO audit functionality
│   └── migrations/                  # Database migrations
└── [config files]                   # Various configuration files
```

## 🔐 Supabase Integration

### **Database Schema**

The project uses several key tables:

```sql
-- API Keys Management
api_keys (
  id, provider, api_key, is_active, 
  usage_count, created_by, created_at
)

-- SEO Audit Requests
seo_audit_requests (
  id, website_url, email, notes, 
  audit_status, contact_status, created_at
)

-- SEO Audits
seo_audits (
  id, website_url, recommendations, 
  keyword_rankings, created_at
)

-- Contact Submissions
contact_submissions (
  id, name, email, message, timestamp
)

-- Replicate Generations
replicate_generations (
  id, prompt, status, output, error
)
```

### **Authentication**
- Uses Supabase Auth with email/password
- JWT tokens for session management
- Row Level Security (RLS) policies for data protection

### **Edge Functions**
- **`generate-image`**: Handles AI image generation via Replicate
- **`poll-replicate`**: Polls Replicate API for generation status
- **`seo-audit`**: Performs SEO audits using Google PageSpeed and SerpAPI

### **Real-time Features**
- Live updates for admin panels
- Real-time chat functionality
- Dynamic content updates

## 📊 PostHog Integration

### **Configuration**
```typescript
// src/lib/posthog.ts
- Automatic pageview tracking
- Event capture for user interactions
- Feature flag support
- Mock implementation for development
- Graceful fallback when API key is missing
```

### **Tracked Events**
- User interactions with AI features
- Game launches and completions
- UI layer switches
- Error occurrences
- Feature usage analytics

### **Feature Flags**
- A/B testing capabilities
- Gradual feature rollouts
- User segmentation

## 🎮 Games & Emulators

### **Retro Games (public/games/)**
- **Diablo**: Full Diablo game emulation
- **Doom**: Classic Doom game
- **Mario**: Super Mario Bros emulation
- **Pac-Man**: Classic Pac-Man game
- **Donkey Kong**: Donkey Kong arcade game
- **Prince of Persia**: Prince of Persia game
- **Sonic**: Sonic the Hedgehog collection
- **Solitaire/Minesweeper**: Classic Windows games

### **Mobile Games (public/Iphone_Games/)**
- **2048**: Number puzzle game
- **Angry Birds**: Physics-based game
- **Doodle Jump**: Endless runner
- **Flappy Bird**: Classic mobile game
- **Paper Toss**: Physics game
- **Tap Tap Revolution**: Music rhythm game
- **Tetris**: Classic block puzzle

### **Tools & Applications**
- **jspaint-main**: MS Paint clone with full functionality
- **Various utilities**: Calculators, maps, messaging apps

## 🎨 UI Layers & Themes

### **Windows 95 Interface**
- **Location**: `src/components/Windows95/`
- **Features**:
  - Classic Windows 95 desktop
  - Start menu and taskbar
  - Window management system
  - File explorer
  - Classic applications (Notepad, Calculator, etc.)
  - AI-powered applications (Chat, Image Generator)

### **iPhone Emulator**
- **Location**: `src/components/iPhoneEmu/`
- **Features**:
  - iOS-style interface
  - App grid layout
  - Native iOS apps (Messages, Maps, YouTube, etc.)
  - Touch interactions
  - Status bar and navigation

### **Modern Interface**
- **Location**: `src/components/modern-site/`
- **Features**:
  - Contemporary design
  - Responsive layout
  - Modern animations
  - Professional styling

## 🔄 State Management

### **React Contexts**
```typescript
// WindowManagerContext.tsx
- Manages window states (open, closed, minimized)
- Handles window positioning and z-index
- Provides window operations (open, close, minimize, maximize)

// WindowsContext.tsx
- Manages overall application state
- Handles theme switching
- Manages global settings
```

### **Custom Hooks**
```typescript
// useWindowManager.ts
- Window management operations
- Window state persistence

// useWindowPosition.ts
- Window positioning logic
- Drag and drop functionality

// useSoundEffects.ts
- Audio feedback for interactions
- Sound effect management
```

### **Local State**
- Component-level state using React hooks
- Form state management
- UI interaction states

## 🎯 Global Providers & Shared Components

### **Providers**
- **WindowManagerProvider**: Window management context
- **WindowsProvider**: Global application state
- **ErrorBoundary**: Global error handling

### **Shared Components**
- **ErrorBoundary**: Error catching and display
- **ComingSoonPopup**: Reusable popup component
- **ChoiceAnimation**: Animation components
- **UI components**: Buttons, inputs, modals

## 🔧 Known Issues & Workarounds

### **API Key Management**
- **Issue**: Hardcoded API keys in previous versions
- **Solution**: Environment variables with proper validation
- **Status**: ✅ Resolved

### **PostHog Integration**
- **Issue**: Errors when API key is missing
- **Solution**: Mock implementation with graceful fallback
- **Status**: ✅ Resolved

### **Window Management**
- **Issue**: Complex z-index management
- **Solution**: Centralized window manager with proper state
- **Status**: ✅ Implemented

### **Performance Considerations**
- **Issue**: Large number of games and assets
- **Solution**: Lazy loading and code splitting
- **Status**: ⚠️ Ongoing optimization

### **Mobile Responsiveness**
- **Issue**: Complex UI layers on mobile
- **Solution**: Responsive design with mobile-specific layouts
- **Status**: ⚠️ Needs testing

## 🚀 Deployment & Environment

### **Environment Variables**
```bash
# Required for production
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_OPENAI_API_KEY
VITE_MISTRAL_API_KEY
VITE_GOOGLE_MAPS_API_KEY
VITE_YOUTUBE_API_KEY

# Optional
VITE_POSTHOG_KEY
VITE_POSTHOG_HOST

# Server-side (Supabase Edge Functions)
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
REPLICATE_API_KEY
OPENAI_API_KEY
GOOGLE_PAGESPEED_API_KEY
SERPAPI_API_KEY
```

### **Build Process**
1. **Development**: `npm run dev` (Vite dev server)
2. **Build**: `npm run build` (Production build)
3. **Preview**: `npm run preview` (Local preview)
4. **Deploy**: Automatic via Vercel

### **Performance Optimizations**
- Code splitting for large components
- Lazy loading for games and heavy assets
- Image optimization
- Bundle size monitoring

## 🔮 Future Enhancements

### **Planned Features**
- More retro games and emulators
- Enhanced AI capabilities
- Social features and multiplayer
- Mobile app version
- More UI themes (Mac OS 9, Linux, etc.)

### **Technical Improvements**
- PWA capabilities
- Offline support
- Enhanced performance monitoring
- Better accessibility features
- Internationalization support

## 📝 Development Guidelines

### **Code Style**
- TypeScript for all new code
- ESLint configuration enforced
- Component-based architecture
- Proper error handling
- Comprehensive documentation

### **Testing Strategy**
- Unit tests for utilities
- Integration tests for API calls
- E2E tests for critical user flows
- Performance testing for games

### **Security Considerations**
- Environment variable validation
- API key rotation
- Input sanitization
- CORS configuration
- Rate limiting

## 🤝 Contributing

### **Setup Instructions**
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start development server: `npm run dev`
5. Set up Supabase local development

### **Development Workflow**
1. Create feature branch
2. Implement changes
3. Add tests if applicable
4. Update documentation
5. Submit pull request

This documentation provides a comprehensive overview of the project's architecture, implementation details, and development guidelines. The project successfully combines nostalgic computing experiences with modern web technologies and AI capabilities. 