// Centralized config for all folder popups

export const FOLDER_POPUP_DEFAULT_SIZE = { width: 500, height: 400 };

export function getCenteredPosition(width = FOLDER_POPUP_DEFAULT_SIZE.width, height = FOLDER_POPUP_DEFAULT_SIZE.height) {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  // Center, but offset slightly for realism
  const offsetX = Math.floor(Math.random() * 41) - 20; // -20 to +20
  const offsetY = Math.floor(Math.random() * 41) - 20; // -20 to +20
  return {
    x: Math.max(0, Math.floor((screenWidth - width) / 2) + offsetX),
    y: Math.max(0, Math.floor((screenHeight - height) / 2) + offsetY),
  };
} 