import { motion } from 'framer-motion';
import { Undo2, PiggyBank } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
interface TurnTrayProps {
  totalScore: number;
  canBank: boolean;
  canUndo: boolean;
  onBank: () => void;
  onUndo: () => void;
}
export const TurnTray = ({
  totalScore,
  canBank,
  canUndo,
  onBank,
  onUndo
}: TurnTrayProps) => {
  return <motion.div initial={{
    y: 100
  }} animate={{
    y: 0
  }} className="fixed bottom-0 left-0 right-0 backdrop-blur-lg border-t border-border safe-bottom" style={{ background: 'var(--gradient-warm)' }}>
      <div className="container max-w-lg mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          {/* Undo button */}
          <Button variant="ghost" size="icon-lg" onClick={onUndo} disabled={!canUndo} className="shrink-0">
            <Undo2 className="w-6 h-6" />
          </Button>

          {/* Total score display */}
          <div className="flex-1 text-center">
            <div className="text-sm font-medium text-secondary-foreground">
              Total Score
            </div>
            <motion.div key={totalScore} initial={{
            scale: 1.2
          }} animate={{
            scale: 1
          }} className={cn("text-4xl font-display", totalScore > 0 ? "text-primary" : "text-muted-foreground")}>
              {totalScore}
            </motion.div>
          </div>

          {/* Bank button */}
          <Button variant="success" size="lg" onClick={onBank} disabled={!canBank} className="shrink-0 px-6">
            <PiggyBank className="w-5 h-5 mr-2" />
            Bank
          </Button>
        </div>
      </div>
    </motion.div>;
};