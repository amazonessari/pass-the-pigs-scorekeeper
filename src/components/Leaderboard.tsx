import { motion } from 'framer-motion';
import { Player } from '@/types/game';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  players: Player[];
  currentPlayerId: string;
  targetScore: number;
}

export const Leaderboard = ({ players, currentPlayerId, targetScore }: LeaderboardProps) => {
  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-4 -mx-4">
      {sortedPlayers.map((player, index) => {
        const isActive = player.id === currentPlayerId;
        const progress = Math.min((player.totalScore / targetScore) * 100, 100);
        
        return (
          <motion.div
            key={player.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "flex-shrink-0 w-28 rounded-2xl p-3 transition-all",
              isActive
                ? "bg-primary text-primary-foreground shadow-medium animate-pulse-glow"
                : "bg-card border-2 border-border shadow-soft"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={cn(
                "text-sm font-display",
                isActive ? "text-primary-foreground/80" : "text-muted-foreground"
              )}>
                {index === 0 ? '👑' : `#${index + 1}`}
              </span>
            </div>
            
            <div className={cn(
              "font-semibold text-sm truncate mb-1",
              isActive ? "text-primary-foreground" : "text-foreground"
            )}>
              {player.name}
            </div>
            
            <div className={cn(
              "text-2xl font-display",
              isActive ? "text-primary-foreground" : "text-foreground"
            )}>
              {player.totalScore}
            </div>

            {/* Progress bar */}
            <div className={cn(
              "h-1.5 rounded-full mt-2 overflow-hidden",
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
          </motion.div>
        );
      })}
    </div>
  );
};
