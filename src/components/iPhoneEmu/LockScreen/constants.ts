// Lock Screen Dimensions
export const LOCK_SCREEN_CONSTANTS = {
  SLIDER_WIDTH: 260,
  SLIDER_HEIGHT: 44,
  BUTTON_SIZE: 40,
  TIME_DISPLAY_WIDTH: 300,
  TIME_DISPLAY_HEIGHT: 100,
  TIME_DISPLAY_INNER_HEIGHT: 90,
} as const;

// Lock Screen Colors
export const LOCK_SCREEN_COLORS = {
  WHITE: '#ffffff',
  WHITE_OPACITY_25: 'rgba(255, 255, 255, 0.25)',
  WHITE_OPACITY_30: 'rgba(255, 255, 255, 0.30)',
  WHITE_OPACITY_90: 'rgba(255, 255, 255, 0.90)',
  BLACK_OPACITY_40: 'rgba(0, 0, 0, 0.40)',
  BLACK_OPACITY_25: 'rgba(0, 0, 0, 0.25)',
  GRAY_888: '#888888',
  GRAY_400: '#9ca3af',
  GRAY_700: '#374151',
  GRAY_900: '#111827',
  GREEN_MESSAGES: '#34C759',
} as const;

// Lock Screen Gradients
export const LOCK_SCREEN_GRADIENTS = {
  BUTTON: 'linear-gradient(135deg, #f8f8f8 60%, #e0e0e0 100%)',
  SHINE: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.10) 60%, rgba(255,255,255,0.01) 100%)',
  SHIMMER: 'linear-gradient(90deg, #fff 0%, #e0e0e0 40%, #fff 60%, #e0e0e0 100%)',
} as const;

// Lock Screen Shadows
export const LOCK_SCREEN_SHADOWS = {
  BUTTON_DEFAULT: '0 2px 8px rgba(0,0,0,0.10)',
  BUTTON_ACTIVE: '0 2px 8px rgba(0,0,0,0.18)',
  BUTTON_BASE: '0 2px 8px rgba(0,0,0,0.15)',
  TIME_DISPLAY: '0 1px 4px rgba(0,0,0,0.25)',
} as const;

// Lock Screen Typography
export const LOCK_SCREEN_TYPOGRAPHY = {
  FONT_FAMILY: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  TIME_SIZE: '64px',
  DATE_SIZE: '18px',
  SHIMMER_SIZE: '15px',
  LETTER_SPACING_TIME: '-2px',
  LETTER_SPACING_DATE: '0.5px',
  LETTER_SPACING_SHIMMER: 'wide',
} as const;

// Lock Screen Animations
export const LOCK_SCREEN_ANIMATIONS = {
  SHIMMER_DURATION: '2.2s',
  UNLOCK_DELAY: 200,
  TIME_UPDATE_INTERVAL: 60000,
} as const;

// Lock Screen Positions
export const LOCK_SCREEN_POSITIONS = {
  TIME_TOP: 'top-20',
  SLIDER_BOTTOM: 'bottom-32',
} as const; 