import {
  WindowManagerState,
  WindowManagerContextType,
  WindowConfig,
  Window,
  Position,
  Size,
  WindowState
} from '../types/window';

// Initial state
export const initialState: WindowManagerState = {
  windows: [],
  activeWindowId: null,
  minimizedWindows: [],
  nextZIndex: 1000
};

// Action types
export type WindowManagerActionType =
  | { type: 'CREATE_WINDOW'; payload: WindowConfig }
  | { type: 'CLOSE_WINDOW'; payload: string }
  | { type: 'MINIMIZE_WINDOW'; payload: string }
  | { type: 'MAXIMIZE_WINDOW'; payload: string }
  | { type: 'RESTORE_WINDOW'; payload: string }
  | { type: 'FOCUS_WINDOW'; payload: string }
  | { type: 'MOVE_WINDOW'; payload: { id: string; position: Position } }
  | { type: 'RESIZE_WINDOW'; payload: { id: string; size: Size } }
  | { type: 'BRING_TO_FRONT'; payload: string };

// Re-export types for convenience
export type {
  WindowManagerState,
  WindowManagerContextType,
  WindowConfig,
  Window,
  Position,
  Size,
  WindowState
}; 