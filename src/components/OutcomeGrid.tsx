import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { OUTCOMES, SINGLE_OUTCOMES, DOUBLE_OUTCOMES, PENALTY_OUTCOMES, OutcomeType } from '@/types/game';

// Import all outcome images
import siderImg from '@/assets/sider.png';
import razorbackImg from '@/assets/razorback.png';
import trotterImg from '@/assets/trotter.png';
import snouterImg from '@/assets/snouter.png';
import leaningJowlerImg from '@/assets/leaning-jowler.png';
import doubleRazorbackImg from '@/assets/double-razorback.png';
import doubleTrotterImg from '@/assets/double-trotter.png';
import doubleSnouterImg from '@/assets/double-snouter.png';
import doubleLeaningJowlerImg from '@/assets/double-leaning-jowler.png';
import pigOutImg from '@/assets/pig-out.png';
import makinBaconImg from '@/assets/makin-bacon.png';
const OUTCOME_IMAGES: Record<OutcomeType, string> = {
  'sider': siderImg,
  'razorback': razorbackImg,
  'trotter': trotterImg,
  'snouter': snouterImg,
  'leaning-jowler': leaningJowlerImg,
  'double-razorback': doubleRazorbackImg,
  'double-trotter': doubleTrotterImg,
  'double-snouter': doubleSnouterImg,
  'double-leaning-jowler': doubleLeaningJowlerImg,
  'pig-out': pigOutImg,
  'makin-bacon': makinBaconImg
};
interface OutcomeGridProps {
  onSelect: (outcome: OutcomeType) => void;
}
export const OutcomeGrid = ({
  onSelect
}: OutcomeGridProps) => {
  return <div className="space-y-4 pb-[16px]">
      {/* Single outcomes */}
      <div>
        <div className="text-sm font-display mb-2 px-1 text-secondary-foreground">
          Single Pig 🐖
        </div>
        <div className="grid grid-cols-2 gap-2">
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
                <Button variant="game" size="game-sm" onClick={() => onSelect(type)} className="flex flex-col items-center justify-center gap-1 h-auto w-full px-0 py-2">
                  <img src={OUTCOME_IMAGES[type]} alt={outcome.label} className="w-40 h-40 object-contain" />
                  <span className="text-[10px] font-semibold leading-tight text-center">{outcome.description}</span>
                  <span className="text-[14px] text-muted-foreground">+{outcome.points}</span>
                </Button>
              </motion.div>;
        })}
        </div>
      </div>

      {/* Double outcomes */}
      <div>
        <div className="text-sm font-display mb-2 px-1 text-secondary-foreground">
          Doubles 🐖🐖
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
                <Button variant="game" size="game-sm" onClick={() => onSelect(type)} className="flex flex-col items-center justify-center gap-1 h-auto w-full px-0 py-2">
                  <img src={OUTCOME_IMAGES[type]} alt={outcome.label} className="w-40 h-40 object-contain" />
                  <span className="text-[10px] font-semibold leading-tight text-center text-primary">{outcome.description}</span>
                  <span className="text-[14px] font-display text-muted-foreground">+{outcome.points}</span>
                </Button>
              </motion.div>;
        })}
        </div>
      </div>

      {/* Penalties */}
      <div>
        <div className="text-sm font-display mb-2 px-1 text-secondary-foreground">
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
                <Button variant="game" size="game-sm" onClick={() => onSelect(type)} className="flex flex-col items-center justify-center gap-1 h-auto w-full px-0 py-2">
                  <img src={OUTCOME_IMAGES[type]} alt={outcome.label} className="w-40 h-40 object-contain" />
                  <span className="text-[10px] font-semibold leading-tight text-center">{outcome.description}</span>
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