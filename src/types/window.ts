export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type WindowState = 'normal' | 'minimized' | 'maximized';
export type WindowType = 'application' | 'folder' | 'dialog' | 'system';

export interface WindowStyles {
  isResizable?: boolean;
  isMovable?: boolean;
  isClosable?: boolean;
  isMinimizable?: boolean;
  isMaximizable?: boolean;
  alwaysOnTop?: boolean;
}

export interface Window {
  id: string;
  title: string;
  type: WindowType;
  state: WindowState;
  position: Position;
  size: Size;
  content: React.ReactNode;
  icon?: string;
  styles: WindowStyles;
  zIndex: number;
  isActive: boolean;
  minimizedPosition?: Position;
  restorePosition?: Position;
  restoreSize?: Size;
}

export interface WindowConfig {
  id: string;
  title: string;
  type: WindowType;
  content: React.ReactNode;
  position?: Position;
  size?: Size;
  icon?: string;
  styles?: Partial<WindowStyles>;
}

export interface WindowManagerState {
  windows: Window[];
  activeWindowId: string | null;
  minimizedWindows: string[];
  nextZIndex: number;
}

export interface WindowManagerActions {
  createWindow: (config: WindowConfig) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  moveWindow: (id: string, position: Position) => void;
  resizeWindow: (id: string, size: Size) => void;
  bringToFront: (id: string) => void;
}

export type WindowManagerContextType = WindowManagerState & WindowManagerActions;

export interface WindowProps {
  id: string;
  title: string;
  initialPosition: Position;
  initialSize: Size;
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
  content: React.ReactNode;
  type?: WindowType;
  isResizable?: boolean;
  isAlwaysOnTop?: boolean;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onVolumeChange?: (volume: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  className?: string;
}

export interface WindowsContextType {
  bringToFront: (id: string) => void;
  zIndexes: Record<string, number>;
  setWindowState: (id: string, state: Partial<WindowState>) => void;
  getWindowState: (id: string) => WindowState | undefined;
  setAlwaysOnTop: (id: string, isAlwaysOnTop: boolean) => void;
  onBack?: () => void;
}

export interface MediaControls {
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
}