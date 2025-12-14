import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { OUTCOMES, SINGLE_OUTCOMES, DOUBLE_OUTCOMES, PENALTY_OUTCOMES, OutcomeType } from '@/types/game';
import { cn } from '@/lib/utils';
interface OutcomeGridProps {
  onSelect: (outcome: OutcomeType) => void;
}
export const OutcomeGrid = ({
  onSelect
}: OutcomeGridProps) => {
  return <div className="space-y-4">
      {/* Single outcomes */}
      <div>
        <div className="text-sm font-display text-muted-foreground mb-2 px-1">
          Single Pig
        </div>
        <div className="grid grid-cols-3 gap-2">
          {SINGLE_OUTCOMES.map((type, index) => {
          const outcome = OUTCOMES[type];
          return <motion.div key={type} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.05
          }}>
                <Button variant="game" size="game-sm" onClick={() => onSelect(type)} className="flex flex-col items-center justify-center gap-1 h-20">
                  <span className="text-2xl">{outcome.emoji}</span>
                  <span className="text-xs font-semibold">{outcome.label}</span>
                  <span className="text-xs text-muted-foreground">+{outcome.points}</span>
                </Button>
              </motion.div>;
        })}
        </div>
      </div>

      {/* Double outcomes */}
      <div>
        <div className="text-sm font-display text-muted-foreground mb-2 px-1">
          Doubles ⭐
        </div>
        <div className="grid grid-cols-2 gap-2">
          {DOUBLE_OUTCOMES.map((type, index) => {
          const outcome = OUTCOMES[type];
          return <motion.div key={type} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.25 + index * 0.05
          }}>
                <Button variant="game-double" size="game-sm" onClick={() => onSelect(type)} className="flex flex-col items-center justify-center gap-1 h-20">
                  <span className="text-xl">{outcome.emoji}</span>
                  <span className="text-xs font-semibold text-primary">{outcome.label}</span>
                  <span className="text-xs font-display text-accent">+{outcome.points}</span>
                </Button>
              </motion.div>;
        })}
        </div>
      </div>

      {/* Penalties */}
      <div>
        <div className="text-sm font-display text-muted-foreground mb-2 px-1">
          Risk Outcomes 💀
        </div>
        <div className="grid grid-cols-2 gap-2">
          {PENALTY_OUTCOMES.map((type, index) => {
          const outcome = OUTCOMES[type];
          return <motion.div key={type} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.45 + index * 0.05
          }}>
                <Button variant="game-penalty" size="game-sm" onClick={() => onSelect(type)} className="flex flex-col items-center justify-center gap-1 h-20">
                  <span className="text-xl">{outcome.emoji}</span>
                  <span className="text-xs font-semibold">{outcome.label}</span>
                  <span className="text-xs text-destructive">
                    {type === 'pig-out' ? 'Lose turn' : 'Lose all!'}
                  </span>
                </Button>
              </motion.div>;
        })}
        </div>
      </div>
    </div>;
};