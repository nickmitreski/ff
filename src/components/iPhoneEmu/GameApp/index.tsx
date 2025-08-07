import React from 'react';
import { motion } from 'framer-motion';

interface GameInfo {
  name: string;
  color: string;
  emoji: string;
  hasGame?: boolean;
}

interface GameAppProps {
  gameId: string;
  onClose: () => void;
}

// Inline GameHeader component to avoid import issues
const GameHeader: React.FC<{ gameName: string }> = ({ gameName }) => (
  <div className="iphone-header relative h-12 flex items-center justify-center bg-gradient-to-b from-[#6d83a1] to-[#b4bfce] border-b border-blue-700 shadow-inner">
    <span className="text-white font-bold text-base tracking-tight drop-shadow-sm">{gameName}</span>
  </div>
);

const GameApp: React.FC<GameAppProps> = ({ gameId, onClose }) => {
  const gameInfo: Record<string, GameInfo> = {
    'doodle-jump': { name: 'Doodle Jump', color: 'bg-yellow-500', emoji: '🦘', hasGame: true },
    'paper-toss': { name: 'Paper Toss', color: 'bg-blue-400', emoji: '🗑️', hasGame: true },
    'flappy-bird': { name: 'Flappy Bird', color: 'bg-green-600', emoji: '🐦', hasGame: true },
    'taptap-revolution': { name: 'Tap Tap Revolution', color: 'bg-blue-600', emoji: '🎵', hasGame: true },
    'tetris': { name: 'Tetris', color: 'bg-purple-600', emoji: '🧩', hasGame: true },
    'angry-birds': { name: 'Angry Birds', color: 'bg-red-600', emoji: '🐦', hasGame: true },
    'space-invaders': { name: 'Space Invaders', color: 'bg-blue-700', emoji: '👾' },
    'breakout': { name: 'Breakout', color: 'bg-red-600', emoji: '🧱' },
    'asteroids': { name: 'Asteroids', color: 'bg-gray-600', emoji: '☄️' },
  };

  const game = gameInfo[gameId] || { name: 'Game', color: 'bg-gray-600', emoji: '🎮' };
  
  // If this game has an actual implementation, show the iframe
  if (game.hasGame) {
    let gameSrc = '';
    let gameTitle = '';
    
    switch (gameId) {
      case 'flappy-bird':
        gameSrc = '/Iphone_Games/Flappy-Bird-HTML5-gh-pages/index.html';
        gameTitle = 'Flappy Bird Game';
        break;
      case 'paper-toss':
        gameSrc = '/Iphone_Games/Paper-Toss2-main/index.html';
        gameTitle = 'Paper Toss Game';
        break;
      case 'doodle-jump':
        gameSrc = '/Iphone_Games/doodle-jump-master/index.html';
        gameTitle = 'Doodle Jump Game';
        break;
      case 'taptap-revolution':
        gameSrc = '/Iphone_Games/TapTapRevolution/index.html';
        gameTitle = 'Tap Tap Revolution Game';
        break;
      case 'tetris':
        gameSrc = '/Iphone_Games/Tetris-master/TetrisGame_NoIntro_Final.htm';
        gameTitle = 'Tetris Game';
        break;
      case 'angry-birds':
        gameSrc = '/Iphone_Games/AngryBirds-main/AngryBirdsGame.htm';
        gameTitle = 'Angry Birds Game';
        break;
      default:
        break;
    }
    
    if (gameSrc) {
      // Special handling for Angry Birds - auto-rotate to landscape full screen mode
      if (gameId === 'angry-birds') {
        return (
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full h-full bg-black overflow-hidden relative flex flex-col"
          >
            {/* Close button positioned for landscape mode */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 z-50 px-2 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-medium shadow-md border border-red-500 transition-colors"
            >
              ✕
            </button>
            {/* Auto-rotated landscape game container */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: 'rotate(90deg)',
                transformOrigin: 'center center',
                width: '100vh',
                height: '100vw',
                left: '50%',
                top: '50%',
                marginLeft: '-50vh',
                marginTop: '-50vw'
              }}
            >
              <iframe 
                src={gameSrc}
                className="w-full h-full border-0"
                title={gameTitle}
                style={{ 
                  background: '#000000'
                }}
                allow="accelerometer; gyroscope; gamepad; fullscreen"
              />
            </div>
          </motion.div>
        );
      }
      
      // Regular game layout for other games
      return (
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full h-full bg-black flex flex-col"
        >
          <GameHeader gameName={game.name} />
          
          <div className="flex-1 relative">
            <iframe 
              src={gameSrc}
              className="w-full h-full border-0"
              title={gameTitle}
              style={{ 
                background: gameId === '2048' ? '#faf8ef' : 
                           gameId === 'doodle-jump' ? '#87CEEB' : 
                           gameId === 'tetris' ? '#000000' : '#000' 
              }}
            />
          </div>
        </motion.div>
      );
    }
  }

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full h-full bg-black flex flex-col"
    >
      <GameHeader gameName={game.name} />
      
      <div className={`flex-1 ${game.color} flex flex-col items-center justify-center p-6`}>
        {/* Game Icon */}
        <div className="text-8xl mb-6">{game.emoji}</div>
        
        {/* Game Title */}
        <h1 className="text-white text-2xl font-bold mb-4 text-center">{game.name}</h1>
        
        {/* Play Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold text-lg mb-6 border border-white/30"
        >
          ▶ Play Game
        </motion.button>
        
        {/* Game Description */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 max-w-sm">
          <p className="text-white/90 text-center text-sm leading-relaxed">
            This is a demo version of {game.name}. In a real iPhone, this would launch the actual game!
          </p>
        </div>
        
        {/* Score Display */}
        <div className="mt-6 flex gap-4">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-white text-lg font-bold">1,234</div>
            <div className="text-white/70 text-xs">High Score</div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-white text-lg font-bold">Level 5</div>
            <div className="text-white/70 text-xs">Current</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameApp; 