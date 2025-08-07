import { useCallback } from 'react';

/**
 * Custom hook to generate window positions centered on the screen
 * with a small random offset to prevent stacking.
 *
 * @param varianceX - Maximum X position variance (default 30)
 * @param varianceY - Maximum Y position variance (default 30)
 * @returns Function that generates a centered position with random offset
 */
export const useCenteredWindowPosition = (
  varianceX: number = 30,
  varianceY: number = 30
) => {
  const generatePosition = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const bottomMargin = 40;
    // Centered base position
    const baseX = Math.floor((width - 500) / 2); // 500 is a typical folder width
    const baseY = Math.floor((height - 400) / 2); // 400 is a typical folder height
    // Random offset
    const offsetX = Math.floor(Math.random() * varianceX * 2) - varianceX;
    const offsetY = Math.floor(Math.random() * varianceY * 2) - varianceY;
    const x = Math.max(10, baseX + offsetX);
    const y = Math.max(10, Math.min(baseY + offsetY, height - 400 - bottomMargin));
    return { x, y };
  }, [varianceX, varianceY]);
  return generatePosition;
};

/**
 * Custom hook to generate window positions with different base positions for each folder type
 * to prevent folders from opening in the same spot
 *
 * @param folderType - Type of folder to get a unique base position
 * @param varianceX - Maximum X position variance (default 120)
 * @param varianceY - Maximum Y position variance (default 120)
 * @returns Function that generates a position with random offset
 */
export const useFolderPosition = (
  folderType: string,
  varianceX: number = 120,
  varianceY: number = 120
) => {
  const generatePosition = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const bottomMargin = 40;
    
    // Different base positions for different folder types
    const basePositions: { [key: string]: { x: number; y: number } } = {
      'media': { x: Math.floor((width - 500) / 2) - 150, y: Math.floor((height - 400) / 2) - 100 },
      'games': { x: Math.floor((width - 500) / 2), y: Math.floor((height - 400) / 2) - 100 },
      'ai': { x: Math.floor((width - 500) / 2) - 150, y: Math.floor((height - 400) / 2) + 100 },
      'flashforward': { x: Math.floor((width - 500) / 2) + 150, y: Math.floor((height - 400) / 2) + 100 },
      'documents': { x: Math.floor((width - 500) / 2), y: Math.floor((height - 400) / 2) - 150 },
      'computer': { x: Math.floor((width - 500) / 2), y: Math.floor((height - 400) / 2) + 150 },
      'recyclebin': { x: Math.floor((width - 500) / 2) + 150, y: Math.floor((height - 400) / 2) - 150 },
      'default': { x: Math.floor((width - 500) / 2), y: Math.floor((height - 400) / 2) }
    };
    
    const basePosition = basePositions[folderType.toLowerCase()] || basePositions.default;
    
    // Random offset with larger variance to prevent overlapping
    const offsetX = Math.floor(Math.random() * varianceX * 2) - varianceX;
    const offsetY = Math.floor(Math.random() * varianceY * 2) - varianceY;
    
    // Add additional random offset to prevent items from opening in the same spot
    const additionalOffsetX = Math.floor(Math.random() * 200) - 100;
    const additionalOffsetY = Math.floor(Math.random() * 200) - 100;
    
    // Clamp Y to keep window away from the very bottom and closer to center
    const minY = Math.floor(height * 0.15);
    const maxY = Math.floor(height * 0.7) - bottomMargin;
    const unclampedY = basePosition.y + offsetY + additionalOffsetY;
    const y = Math.max(minY, Math.min(unclampedY, maxY));
    const x = Math.max(10, basePosition.x + offsetX + additionalOffsetX);
    
    return { x, y };
  }, [folderType, varianceX, varianceY]);
  
  return generatePosition;
};

/**
 * Custom hook to generate truly unique window positions for each window opening
 * Uses timestamp and random values to ensure no two windows open in the same spot
 *
 * @param appId - Optional app ID to add to the uniqueness calculation
 * @returns Function that generates a unique position
 */
export const useUniqueWindowPosition = (appId?: string) => {
  const generatePosition = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const bottomMargin = 40;
    
    // Use timestamp for base uniqueness
    const timestamp = Date.now();
    const timeOffsetX = (timestamp % 300) - 150; // -150 to +150
    const timeOffsetY = ((timestamp >> 8) % 300) - 150; // -150 to +150
    
    // Add app-specific offset if provided
    const appOffsetX = appId ? (appId.charCodeAt(0) % 200) - 100 : 0;
    const appOffsetY = appId ? (appId.charCodeAt(appId.length - 1) % 200) - 100 : 0;
    
    // Random offset for additional variance
    const randomOffsetX = Math.floor(Math.random() * 400) - 200;
    const randomOffsetY = Math.floor(Math.random() * 400) - 200;
    
    // Calculate final position
    // Shift base X more to the left, base Y lower
    const baseX = Math.floor((width - 500) / 2) - 80;
    const baseY = Math.floor((height - 400) / 2) + 80;
    
    const x = Math.max(10, Math.min(width - 510, baseX + timeOffsetX + appOffsetX + randomOffsetX));
    const y = Math.max(60, Math.min(height - 410 - bottomMargin, baseY + timeOffsetY + appOffsetY + randomOffsetY));
    
    return { x, y };
  }, [appId]);
  
  return generatePosition;
};

/**
 * Custom hook to generate window positions with random offsets
 * to prevent windows from stacking exactly on top of each other
 * 
 * @param baseX - Base X position for the window
 * @param baseY - Base Y position for the window
 * @param varianceX - Maximum X position variance
 * @param varianceY - Maximum Y position variance
 * @returns Function that generates a position with random offset
 */
export const useWindowPosition = (
  baseX: number = 100,
  baseY: number = 100,
  varianceX: number = 50,
  varianceY: number = 50
) => {
  const generatePosition = useCallback(() => {
    const bottomMargin = 40;
    // Generate random offsets within the variance range
    const offsetX = Math.floor(Math.random() * varianceX * 2) - varianceX;
    const offsetY = Math.floor(Math.random() * varianceY * 2) - varianceY;
    
    // Calculate final position with offsets
    const x = Math.max(10, baseX + offsetX);
    const y = Math.max(10, Math.min(baseY + offsetY, window.innerHeight - bottomMargin));
    
    return { x, y };
  }, [baseX, baseY, varianceX, varianceY]);

  return generatePosition;
};