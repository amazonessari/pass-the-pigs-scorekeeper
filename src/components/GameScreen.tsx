import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, History, Trophy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OutcomeGrid } from '@/components/OutcomeGrid';
import { TurnTray } from '@/components/TurnTray';
import { Leaderboard } from '@/components/Leaderboard';
import { Game, OutcomeType, OUTCOMES } from '@/types/game';
import { cn } from '@/lib/utils';

interface GameScreenProps {
  game: Game;
  canUndo: boolean;
  onRecordOutcome: (outcome: OutcomeType) => void;
  onBank: () => void;
  onUndo: () => void;
  onHome: () => void;
  onLeaderboard: () => void;
}

export const GameScreen = ({
  game,
  canUndo,
  onRecordOutcome,
  onBank,
  onUndo,
  onHome,
  onLeaderboard
}: GameScreenProps) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showTurnLeaderboard, setShowTurnLeaderboard] = useState(false);
  const prevPlayerIndexRef = useRef(game.currentPlayerIndex);

  // Show leaderboard when last player's turn ends (wraps back to player 0) and scroll to top
  useEffect(() => {
    if (prevPlayerIndexRef.current !== game.currentPlayerIndex) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (game.currentPlayerIndex === 0 && prevPlayerIndexRef.current === game.players.length - 1) {
        setShowTurnLeaderboard(true);
      }
      prevPlayerIndexRef.current = game.currentPlayerIndex;
    }
  }, [game.currentPlayerIndex, game.players.length]);
  const currentPlayer = game.players[game.currentPlayerIndex];
  const turnPoints = game.currentTurn?.turnPoints || 0;

  // Calculate current turn number (completed turns + 1 for current)
  const currentTurnNumber = currentPlayer.turns.length + 1;
  const getOrdinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  return <div className="min-h-screen flex flex-col pb-28 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border safe-top">
        <div className="container max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between relative">
            <Button variant="ghost" size="icon" onClick={onHome}>
              <Home className="w-5 h-5" />
            </Button>
            <div className="absolute left-1/2 -translate-x-1/2">
              <div className="text-sm font-display text-foreground">
                {currentPlayer.name}'s {getOrdinal(currentTurnNumber)} turn
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={onLeaderboard}>
                <Trophy className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowHistory(true)}>
                <History className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Current turn info */}
      <motion.div key={currentPlayer.id} initial={{
      opacity: 0,
      y: -10
    }} animate={{
      opacity: 1,
      y: 0
    }} className="container max-w-lg mx-auto px-4 py-4">
        <div className="p-4 border-border text-center bg-[#fdfcfc]/0 rounded-none shadow-none border-0">
          <div className="text-sm text-muted-foreground mb-2">Race to {game.targetScore}</div>
          {game.currentTurn && game.currentTurn.events.length > 0 && <div className="flex flex-wrap justify-center gap-2">
              {game.currentTurn.events.map((event, index) => {
                // Calculate running total up to this point
                const runningTotal = game.currentTurn!.events.slice(0, index + 1).reduce((sum, e) => sum + e.points, 0);
                return (
                  <motion.div key={event.id} initial={{
                    scale: 0
                  }} animate={{
                    scale: 1
                  }} className={cn("px-3 py-1 rounded-full text-sm font-medium", "bg-primary/10 text-primary")}>
                    +{event.points} <span className="text-muted-foreground">({runningTotal})</span>
                  </motion.div>
                );
              })}
            </div>}
        </div>
      </motion.div>

      {/* Outcome grid */}
      <div className="container max-w-lg mx-auto px-4 flex-1">
        <OutcomeGrid onSelect={onRecordOutcome} />
      </div>

      {/* Turn tray */}
      <TurnTray totalScore={currentPlayer.totalScore + turnPoints} canBank={turnPoints > 0} canUndo={canUndo} onBank={onBank} onUndo={onUndo} />

      {/* History drawer */}
      <AnimatePresence>
        {showHistory && <>
            <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40" onClick={() => setShowHistory(false)} />
            <motion.div initial={{
          x: '100%'
        }} animate={{
          x: 0
        }} exit={{
          x: '100%'
        }} transition={{
          type: 'spring',
          damping: 25,
          stiffness: 300
        }} className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-card shadow-lifted z-50 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-display">Game History</h2>
                <Button variant="ghost" size="icon-sm" onClick={() => setShowHistory(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {game.history.slice().reverse().map(entry => <div key={entry.id} className={cn("p-3 rounded-xl text-sm", entry.type === 'penalty' && "bg-destructive/10 text-destructive", entry.type === 'bank' && "bg-success/10 text-success", entry.type === 'roll' && "bg-muted")}>
                    <div className="font-medium">{entry.description}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </div>
                  </div>)}
                {game.history.length === 0 && <div className="text-center text-muted-foreground py-8">
                    No rolls yet. Make your first roll!
                  </div>}
              </div>
            </motion.div>
          </>}
      </AnimatePresence>

      {/* Turn End Leaderboard Modal */}
      <AnimatePresence>
        {showTurnLeaderboard && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50"
              onClick={() => setShowTurnLeaderboard(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-lg mx-auto"
            >
              <div className="bg-card rounded-2xl shadow-lifted p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-display">Standings</h2>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowTurnLeaderboard(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <Leaderboard
                  players={game.players}
                  currentPlayerId=""
                  targetScore={game.targetScore}
                />
                <Button
                  className="w-full mt-4"
                  onClick={() => setShowTurnLeaderboard(false)}
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>;
};