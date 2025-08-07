import { useCallback } from 'react';

interface UseLockScreenProps {
  onUnlock: () => void;
}

interface UseLockScreenReturn {
  handleUnlock: () => void;
  isUnlocking: boolean;
}

export const useLockScreen = ({ onUnlock }: UseLockScreenProps): UseLockScreenReturn => {
  const handleUnlock = useCallback(() => {
    // Add any additional unlock logic here if needed
    // For example, analytics, sound effects, etc.
    onUnlock();
  }, [onUnlock]);

  // For now, we'll keep this simple
  // In the future, this could manage global lock screen state
  const isUnlocking = false;

  return {
    handleUnlock,
    isUnlocking,
  };
}; 