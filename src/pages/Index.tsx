import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HomeScreen } from '@/components/HomeScreen';
import { GameSetup } from '@/components/GameSetup';
import { GameScreen } from '@/components/GameScreen';
import { GameComplete } from '@/components/GameComplete';
import { useGame } from '@/hooks/useGame';

type Screen = 'home' | 'setup' | 'game' | 'complete';

const Index = () => {
  const {
    game,
    recentGames,
    canUndo,
    startNewGame,
    loadGame,
    recordOutcome,
    bankPoints,
    undo,
    clearCurrentGame,
    deleteGame,
  } = useGame();

  const [screen, setScreen] = useState<Screen>('home');

  // Determine screen based on game state
  useEffect(() => {
    if (game) {
      if (game.status === 'complete') {
        setScreen('complete');
      } else if (game.status === 'active') {
        setScreen('game');
      }
    }
  }, [game]);

  const handleNewGame = () => setScreen('setup');
  
  const handleStartGame = (players: string[], targetScore: number) => {
    startNewGame(players, targetScore);
    setScreen('game');
  };

  const handleLoadGame = (gameId: string) => {
    const loaded = loadGame(gameId);
    if (loaded) {
      if (loaded.status === 'complete') {
        setScreen('complete');
      } else {
        setScreen('game');
      }
    }
  };

  const handleHome = () => {
    setScreen('home');
  };

  const handleResume = () => {
    if (game?.status === 'active') {
      setScreen('game');
    }
  };

  const handlePlayAgain = () => {
    if (game) {
      const playerNames = game.players.map(p => p.name);
      startNewGame(playerNames, game.targetScore);
      setScreen('game');
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh]">
      <AnimatePresence mode="wait">
        {screen === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HomeScreen
              recentGames={recentGames}
              onNewGame={handleNewGame}
              onLoadGame={handleLoadGame}
              onDeleteGame={deleteGame}
              onResumeGame={handleResume}
              hasActiveGame={game?.status === 'active'}
            />
          </motion.div>
        )}

        {screen === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <GameSetup
              onStart={handleStartGame}
              onBack={handleHome}
            />
          </motion.div>
        )}

        {screen === 'game' && game && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GameScreen
              game={game}
              canUndo={canUndo}
              onRecordOutcome={recordOutcome}
              onBank={bankPoints}
              onUndo={undo}
              onHome={handleHome}
            />
          </motion.div>
        )}

        {screen === 'complete' && game && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <GameComplete
              game={game}
              onHome={handleHome}
              onNewGame={handlePlayAgain}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
