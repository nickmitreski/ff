import useSound from 'use-sound';

export interface SoundEffects {
  playMaximize: () => void;
  playMinimize: () => void;
  playShutdown: () => void;
  playStartup: () => void;
  playError: () => void;
}

/**
 * Custom hook to manage sound effects for the Windows 95 interface
 */
export function useSoundEffects(): SoundEffects {
  const [playMaximize] = useSound('/sounds/windows95-maximize.mp3');
  const [playMinimize] = useSound('/sounds/windows95-minimize.mp3');
  const [playShutdown] = useSound('/sounds/windows95-shutdown.mp3');
  const [playStartup] = useSound('/sounds/windows95-startup.mp3');
  const [playError] = useSound('/sounds/windows95-error.mp3');

  return {
    playMaximize,
    playMinimize,
    playShutdown,
    playStartup,
    playError
  };
}