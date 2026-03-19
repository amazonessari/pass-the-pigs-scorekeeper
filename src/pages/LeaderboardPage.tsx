import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Game, Player } from '@/types/game';
import { cn } from '@/lib/utils';

interface LeaderboardPageProps {
  game: Game;
  onBack: () => void;
}

export const LeaderboardPage = ({ game, onBack }: LeaderboardPageProps) => {
  const sortedPlayers = [...game.players].sort((a, b) => b.totalScore - a.totalScore);
  const currentPlayer = game.players[game.currentPlayerIndex];

  return (
    <div className="min-h-screen safe-top safe-bottom" style={{ background: 'var(--gradient-warm)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-display">Leaderboard</h1>
              <p className="text-sm text-muted-foreground">First to {game.targetScore}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="container max-w-lg mx-auto px-4 py-6">
        <div className="space-y-3">
          {sortedPlayers.map((player, index) => {
            const isActive = player.id === currentPlayer.id;
            const progress = Math.min((player.totalScore / game.targetScore) * 100, 100);
            
            return (
              <motion.div
                key={player.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "rounded-2xl p-4 transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-medium"
                    : "bg-card border-2 border-border shadow-soft"
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-lg font-display",
                    isActive ? "bg-primary-foreground/20" : "bg-muted"
                  )}>
                    {index === 0 ? '👑' : `#${index + 1}`}
                  </div>

                  {/* Player info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "font-semibold truncate",
                        isActive ? "text-primary-foreground" : "text-foreground"
                      )}>
                        {player.name}
                      </span>
                      {isActive && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary-foreground/20">
                          Current
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className={cn(
                      "h-2 rounded-full mt-2 overflow-hidden",
                      isActive ? "bg-primary-foreground/30" : "bg-muted"
                    )}>
                      <motion.div
                        className={cn(
                          "h-full rounded-full",
                          isActive ? "bg-primary-foreground" : "bg-primary"
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Score */}
                  <div className={cn(
                    "text-3xl font-display",
                    isActive ? "text-primary-foreground" : "text-foreground"
                  )}>
                    {player.totalScore}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
