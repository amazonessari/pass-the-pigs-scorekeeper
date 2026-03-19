import { useRef, useLayoutEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Undo2, PiggyBank } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TurnEvent } from '@/types/game';

interface TurnTrayProps {
  totalScore: number;
  canBank: boolean;
  canUndo: boolean;
  events: TurnEvent[];
  onBank: () => void;
  onUndo: () => void;
}

// Max height for 2 rows of chips (py-1 + text-sm ≈ 28px per row, gap-2 = 8px between rows)
const MAX_ROWS_HEIGHT = 28 * 2 + 8;

export const TurnTray = ({ totalScore, canBank, canUndo, events, onBank, onUndo }: TurnTrayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [startIndex, setStartIndex] = useState(0);

  // Reset to show all chips when events count changes
  useLayoutEffect(() => {
    setStartIndex(0);
  }, [events.length]);

  // After render, detect height overflow and hide oldest chips
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || events.length === 0) return;
    if (container.scrollHeight <= MAX_ROWS_HEIGHT + 2) return; // fits within 2 rows

    // Too many chips — remove from the front one by one until it fits
    const chips = Array.from(container.querySelectorAll<HTMLElement>('[data-chip]'));
    if (chips.length === 0) return;

    // Find how many chips from the end fit within 2 rows
    // Binary search: try removing 1, 2, 3... until it fits
    const currentVisible = events.length - startIndex;
    setStartIndex(startIndex + Math.ceil(currentVisible * 0.3 || 1));
  }, [events, startIndex]);

  const showEllipsis = startIndex > 0;
  const visibleEvents = events.slice(startIndex);

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 backdrop-blur-lg border-t border-border safe-bottom"
      style={{ background: 'var(--gradient-warm)' }}
    >
      <div className="container max-w-lg mx-auto px-4 py-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-lg" onClick={onUndo} disabled={!canUndo} className="shrink-0 self-center">
            <Undo2 className="w-6 h-6" />
          </Button>

          <div
            ref={containerRef}
            className="flex-1 flex flex-wrap items-center justify-center gap-2 overflow-hidden min-w-0"
            style={{ maxHeight: MAX_ROWS_HEIGHT }}
          >
            {showEllipsis && (
              <span className="text-sm text-muted-foreground shrink-0">…</span>
            )}
            {visibleEvents.map((event) => {
              return (
                <motion.div
                  data-chip
                  key={event.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={cn("px-3 py-1 rounded-full text-sm font-medium shrink-0", "bg-primary/10 text-primary")}
                >
                  +{event.points}
                </motion.div>
              );
            })}
          </div>

          <Button variant="success" size="lg" onClick={onBank} disabled={!canBank} className="shrink-0 self-center px-6">
            <PiggyBank className="w-5 h-5 mr-2" />
            Bank
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
