import { motion } from 'framer-motion';
import { Plus, Clock, Trash2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PigIcon } from '@/components/PigIcon';
import { Game } from '@/types/game';
import { cn } from '@/lib/utils';
interface HomeScreenProps {
  recentGames: Game[];
  onNewGame: () => void;
  onLoadGame: (gameId: string) => void;
  onDeleteGame: (gameId: string) => void;
  onResumeGame: () => void;
  hasActiveGame: boolean;
}
export const HomeScreen = ({
  recentGames,
  onNewGame,
  onLoadGame,
  onDeleteGame,
  onResumeGame,
  hasActiveGame
}: HomeScreenProps) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };
  const getWinnerName = (game: Game) => {
    if (!game.winnerId) return null;
    return game.players.find(p => p.id === game.winnerId)?.name;
  };
  return <div className="min-h-screen flex flex-col px-4 py-8 safe-top safe-bottom">
      {/* Header with pig mascot */}
      <motion.div initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="text-center mb-8">
        <motion.div initial={{
        scale: 0
      }} animate={{
        scale: 1
      }} transition={{
        type: 'spring',
        stiffness: 200,
        delay: 0.2
      }} className="inline-block mb-4">
          <PigIcon size="xl" animate />
        </motion.div>
        <h1 className="text-4xl font-display mb-2 text-primary">
          Pass the Pigs
        </h1>
        <p className="text-lg text-secondary-foreground">
          Score Keeper
        </p>
      </motion.div>

      {/* Main actions */}
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.3
    }} className="space-y-3 mb-8">
        <Button variant="hero" size="xl" className="w-full" onClick={onNewGame}>
          <Plus className="w-6 h-6" />
          New Game
        </Button>

        {hasActiveGame && <Button variant="success" size="lg" className="w-full" onClick={onResumeGame}>
            <Play className="w-5 h-5" />
            Resume Game
          </Button>}
      </motion.div>

      {/* Recent games */}
      {recentGames.length > 0 && <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 0.4
    }} className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-display text-secondary-foreground">Recent Games</h2>
          </div>

          <div className="space-y-3">
            {recentGames.map((game, index) => {
          const winner = getWinnerName(game);
          return <motion.div key={game.id} initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.5 + index * 0.1
          }} className={cn("bg-card rounded-2xl p-4 shadow-soft border border-border", "flex items-center justify-between gap-3")}>
                  <button onClick={() => onLoadGame(game.id)} className="flex-1 text-left">
                    <div className="flex items-center gap-3">
                      <div className="">
                        <span className="text-xl">
                          {game.status === 'complete' ? '🏆' : '🎲'}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-card-foreground">
                          {game.players.map(p => p.name).join(' vs ')}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <span>{formatDate(game.updatedAt)}</span>
                          {winner && <>
                              <span>•</span>
                              <span className="text-green-700">{winner} won!</span>
                            </>}
                          {game.status === 'active' && <>
                              <span>•</span>
                              <span className="text-orange-600">In progress</span>
                            </>}
                        </div>
                      </div>
                    </div>
                  </button>
                  
                  <Button variant="ghost" size="icon-sm" onClick={e => {
              e.stopPropagation();
              onDeleteGame(game.id);
            }} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>;
        })}
          </div>
        </motion.div>}

      {/* Empty state */}
      {recentGames.length === 0 && <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 0.5
    }} className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="text-4xl mb-3">🎲</div>
            <p>No games yet. Start a new one!</p>
          </div>
        </motion.div>}
    </div>;
};