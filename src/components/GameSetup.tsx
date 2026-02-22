import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, X, Users, Target, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PigIcon } from '@/components/PigIcon';
import { cn } from '@/lib/utils';

interface GameSetupProps {
  onStart: (players: string[], targetScore: number) => void;
  onBack: () => void;
}

const DEFAULT_PLAYERS = ['', ''];
const TARGET_SCORES = [50, 100, 150, 200];

export const GameSetup = ({ onStart, onBack }: GameSetupProps) => {
  const [players, setPlayers] = useState<string[]>(DEFAULT_PLAYERS);
  const [targetScore, setTargetScore] = useState(100);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addPlayer = () => {
    if (players.length < 20) {
      setPlayers([...players, '']);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 2) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  const canStart = players.length >= 2 && players.every(p => p.trim().length > 0);

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 safe-top safe-bottom">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-display text-foreground">New Game</h1>
          <p className="text-sm text-muted-foreground">Set up your players</p>
        </div>
        <PigIcon size="md" />
      </motion.div>

      {/* Players section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-display text-foreground">Players</h2>
          <span className="text-sm text-muted-foreground">({players.length}/20)</span>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {players.map((player, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={cn(
                  "bg-card rounded-xl p-3 shadow-soft border-2",
                  editingIndex === index ? "border-primary" : "border-border"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-display text-lg",
                    "bg-primary/10 text-primary"
                  )}>
                    {index + 1}
                  </div>
                  <Input
                    value={player}
                    onChange={(e) => updatePlayerName(index, e.target.value)}
                    onFocus={() => setEditingIndex(index)}
                    onBlur={() => setEditingIndex(null)}
                    placeholder="Player name"
                    className="flex-1 border-0 bg-transparent text-lg font-semibold p-0 h-auto focus-visible:ring-0"
                  />
                  {players.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removePlayer(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {players.length < 20 && (
            <motion.div layout>
              <Button
                variant="outline"
                size="lg"
                className="w-full border-dashed"
                onClick={addPlayer}
              >
                <Plus className="w-5 h-5" />
                Add Player
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Target score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-display text-foreground">Target Score</h2>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {TARGET_SCORES.map((score) => (
            <Button
              key={score}
              variant={targetScore === score ? "game-active" : "game"}
              size="lg"
              onClick={() => setTargetScore(score)}
              className="text-xl font-display"
            >
              {score}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Start button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Button
          variant="hero"
          size="xl"
          className="w-full"
          disabled={!canStart}
          onClick={() => onStart(players, targetScore)}
        >
          <Play className="w-6 h-6" />
          Start Game
        </Button>
      </motion.div>
    </div>
  );
};
