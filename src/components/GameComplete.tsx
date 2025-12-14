import { motion } from 'framer-motion';
import { Trophy, Home, RotateCcw, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Game, Player } from '@/types/game';
import { cn } from '@/lib/utils';

interface GameCompleteProps {
  game: Game;
  onHome: () => void;
  onNewGame: () => void;
}

export const GameComplete = ({ game, onHome, onNewGame }: GameCompleteProps) => {
  const winner = game.players.find(p => p.id === game.winnerId);
  const sortedPlayers = [...game.players].sort((a, b) => b.totalScore - a.totalScore);

  const handleShare = async () => {
    const text = `🐷 Pass the Pigs Results!\n\n${sortedPlayers.map((p, i) => 
      `${i === 0 ? '🏆' : `#${i + 1}`} ${p.name}: ${p.totalScore} pts`
    ).join('\n')}\n\n${winner?.name} wins! 🎉`;

    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (e) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-8 safe-top safe-bottom">
      {/* Confetti effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              y: -20, 
              x: Math.random() * window.innerWidth,
              rotate: 0,
              opacity: 1 
            }}
            animate={{ 
              y: window.innerHeight + 20,
              rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
              opacity: 0 
            }}
            transition={{ 
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 0.5,
              ease: 'easeIn'
            }}
            className={cn(
              "absolute w-4 h-4 rounded-sm",
              i % 4 === 0 && "bg-primary",
              i % 4 === 1 && "bg-accent",
              i % 4 === 2 && "bg-success",
              i % 4 === 3 && "bg-pig-pink"
            )}
          />
        ))}
      </div>

      {/* Winner announcement */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="text-center mb-8"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="inline-block text-8xl mb-4"
        >
          🏆
        </motion.div>
        <h1 className="text-3xl font-display text-foreground mb-2">
          {winner?.name} Wins!
        </h1>
        <p className="text-xl text-primary font-display">
          {winner?.totalScore} points
        </p>
      </motion.div>

      {/* Podium */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex-1"
      >
        <div className="space-y-3">
          {sortedPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className={cn(
                "rounded-2xl p-4",
                index === 0 
                  ? "bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20 border-2 border-amber-300 dark:border-amber-700 shadow-medium"
                  : "bg-card border border-border shadow-soft"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-display",
                  index === 0 && "bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200",
                  index === 1 && "bg-gray-200 dark:bg-gray-700",
                  index === 2 && "bg-amber-700/20 text-amber-700 dark:text-amber-400",
                  index > 2 && "bg-muted text-muted-foreground"
                )}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>
                <div className="flex-1">
                  <div className="font-display text-lg text-foreground">
                    {player.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {player.stats.totalTurns} turns • {player.stats.totalRolls} rolls
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-display text-foreground">
                    {player.totalScore}
                  </div>
                  <div className="text-xs text-muted-foreground">points</div>
                </div>
              </div>

              {/* Player stats */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border/50">
                <div className="text-center">
                  <div className="text-lg font-display text-foreground">
                    {player.stats.highestTurn}
                  </div>
                  <div className="text-xs text-muted-foreground">Best Turn</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-display text-foreground">
                    {player.stats.doublesCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Doubles</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-display text-destructive">
                    {player.stats.pigOutCount + player.stats.makinBaconCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Penalties</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-3 mt-8"
      >
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="lg" onClick={handleShare}>
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
          <Button variant="success" size="lg" onClick={onNewGame}>
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </Button>
        </div>
        <Button variant="ghost" size="lg" className="w-full" onClick={onHome}>
          <Home className="w-5 h-5 mr-2" />
          Home
        </Button>
      </motion.div>
    </div>
  );
};
