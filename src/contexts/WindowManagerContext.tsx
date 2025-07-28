                                                                                                                                                                                                                                                                                                                                                                                                            import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  WindowManagerState,
  WindowManagerContextType,
  WindowConfig,
  Window,
  Position,
  Size,
  WindowState,
  WindowManagerActionType,
  initialState
} from './windowManagerTypes';

// Reducer
function windowManagerReducer(state: WindowManagerState, action: WindowManagerActionType): WindowManagerState {
  switch (action.type) {
    case 'CREATE_WINDOW': {
      console.log(`[WINAMP DEBUG] CREATE_WINDOW action for:`, action.payload.id, action.payload);
      const existing = state.windows.find(w => w.id === action.payload.id);
      if (existing) {
        console.log(`[WINAMP DEBUG] Window ${action.payload.id} already exists, handling existing window`);
        // If minimized, restore it
        if (existing.state === 'minimized') {
          console.log(`[WINAMP DEBUG] Restoring minimized window ${action.payload.id}`);
          return {
            ...state,
            windows: state.windows.map(w =>
              w.id === action.payload.id
                ? { ...w, state: 'normal', isActive: true, zIndex: state.nextZIndex }
                : { ...w, isActive: false }
            ),
            activeWindowId: existing.id,
            nextZIndex: state.nextZIndex + 1,
          };
        }
        // If already open, bring to front
        console.log(`[WINAMP DEBUG] Bringing window ${action.payload.id} to front`);
        return {
          ...state,
          windows: state.windows.map(w =>
            w.id === action.payload.id
              ? { ...w, isActive: true, zIndex: state.nextZIndex }
              : { ...w, isActive: false }
          ),
          activeWindowId: existing.id,
          nextZIndex: state.nextZIndex + 1,
        };
      }
      // Otherwise, create new window
      console.log(`[WINAMP DEBUG] Creating new window ${action.payload.id}`);
      const newWindow: Window = {
        ...action.payload,
        state: 'normal',
        position: action.payload.position || { x: 100, y: 100 },
        size: action.payload.size || { width: 400, height: 300 },
        styles: {
          isResizable: true,
          isMovable: true,
          isClosable: true,
          isMinimizable: true,
          isMaximizable: true,
          alwaysOnTop: false,
          ...action.payload.styles
        },
        zIndex: state.nextZIndex,
        isActive: true
      };
      console.log(`[WINAMP DEBUG] New window created:`, newWindow);
      return {
        ...state,
        windows: [...state.windows.map(w => ({ ...w, isActive: false })), newWindow],
        activeWindowId: newWindow.id,
        nextZIndex: state.nextZIndex + 1
      };
    }

    case 'CLOSE_WINDOW':
      return {
        ...state,
        windows: state.windows.filter(w => w.id !== action.payload),
        activeWindowId: state.windows.length > 1 
          ? state.windows[state.windows.length - 2].id 
          : null,
        minimizedWindows: state.minimizedWindows.filter(id => id !== action.payload)
      };

    case 'MINIMIZE_WINDOW': {
      const windowToMinimize = state.windows.find(w => w.id === action.payload);
      if (!windowToMinimize) return state;

      return {
        ...state,
        windows: state.windows.map(w => 
          w.id === action.payload
            ? { ...w, state: 'minimized' as WindowState, minimizedPosition: { ...w.position } }
            : w
        ),
        minimizedWindows: [...state.minimizedWindows, action.payload],
        activeWindowId: state.windows.length > 1 
          ? state.windows[state.windows.length - 2].id 
          : null
      };
    }

    case 'MAXIMIZE_WINDOW': {
      const windowToMaximize = state.windows.find(w => w.id === action.payload);
      if (!windowToMaximize) return state;

      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload
            ? {
                ...w,
                state: 'maximized',
                restorePosition: { ...w.position },
                restoreSize: { ...w.size },
                position: { x: 0, y: 0 },
                size: { width: window.innerWidth, height: window.innerHeight - 30 } // Account for taskbar
              }
            : w
        )
      };
    }

    case 'RESTORE_WINDOW': {
      const windowToRestore = state.windows.find(w => w.id === action.payload);
      if (!windowToRestore) return state;

      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload
            ? {
                ...w,
                state: 'normal',
                position: w.restorePosition || w.position,
                size: w.restoreSize || w.size
              }
            : w
        ),
        minimizedWindows: state.minimizedWindows.filter(id => id !== action.payload)
      };
    }

    case 'FOCUS_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w => ({
          ...w,
          isActive: w.id === action.payload,
          zIndex: w.id === action.payload ? state.nextZIndex : w.zIndex
        })),
        activeWindowId: action.payload,
        nextZIndex: state.nextZIndex + 1
      };

    case 'MOVE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.id
            ? { ...w, position: action.payload.position }
            : w
        )
      };

    case 'RESIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.id
            ? { ...w, size: action.payload.size }
            : w
        )
      };

    case 'BRING_TO_FRONT':
      return {
        ...state,
        windows: state.windows.map(w => ({
          ...w,
          isActive: w.id === action.payload,
          zIndex: w.id === action.payload ? state.nextZIndex : w.zIndex
        })),
        activeWindowId: action.payload,
        nextZIndex: state.nextZIndex + 1
      };

    default:
      return state;
  }
}

// Context
const WindowManagerContext = createContext<WindowManagerContextType | null>(null);

// Provider
export function WindowManagerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(windowManagerReducer, initialState);

  const createWindow = useCallback((config: WindowConfig) => {
    dispatch({ type: 'CREATE_WINDOW', payload: config });
  }, []);

  const closeWindow = useCallback((id: string) => {
    dispatch({ type: 'CLOSE_WINDOW', payload: id });
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    dispatch({ type: 'MINIMIZE_WINDOW', payload: id });
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    dispatch({ type: 'MAXIMIZE_WINDOW', payload: id });
  }, []);

  const restoreWindow = useCallback((id: string) => {
    dispatch({ type: 'RESTORE_WINDOW', payload: id });
  }, []);

  const focusWindow = useCallback((id: string) => {
    dispatch({ type: 'FOCUS_WINDOW', payload: id });
  }, []);

  const moveWindow = useCallback((id: string, position: Position) => {
    dispatch({ type: 'MOVE_WINDOW', payload: { id, position } });
  }, []);

  const resizeWindow = useCallback((id: string, size: Size) => {
    dispatch({ type: 'RESIZE_WINDOW', payload: { id, size } });
  }, []);

  const bringToFront = useCallback((id: string) => {
    dispatch({ type: 'BRING_TO_FRONT', payload: id });
  }, []);

  const value: WindowManagerContextType = {
    ...state,
    createWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    moveWindow,
    resizeWindow,
    bringToFront
  };

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
}

// Hook
export function useWindowManager() {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error('useWindowManager must be used within a WindowManagerProvider');
  }
  return context;
} 