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

export const TurnTray = ({ totalScore, canBank, canUndo, events, onBank, onUndo }: TurnTrayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [startIndex, setStartIndex] = useState(0);

  // Reset to show all chips when events count changes
  useLayoutEffect(() => {
    setStartIndex(0);
  }, [events.length]);

  // After render, detect overflow and hide oldest chips
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || events.length === 0) return;
    if (container.scrollWidth <= container.clientWidth) return;

    const chips = Array.from(container.querySelectorAll<HTMLElement>('[data-chip]'));
    if (chips.length === 0) return;

    const ELLIPSIS_WIDTH = 28; // "…" width + gap
    const containerWidth = container.clientWidth;

    let used = ELLIPSIS_WIDTH;
    let visible = 0;
    for (let i = chips.length - 1; i >= 0; i--) {
      const chipWidth = chips[i].offsetWidth + 8; // +gap
      if (used + chipWidth <= containerWidth) {
        used += chipWidth;
        visible++;
      } else {
        break;
      }
    }

    setStartIndex(events.length - visible);
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
          <Button variant="ghost" size="icon-lg" onClick={onUndo} disabled={!canUndo} className="shrink-0">
            <Undo2 className="w-6 h-6" />
          </Button>

          <div ref={containerRef} className="flex-1 flex items-center justify-center gap-2 overflow-hidden min-w-0">
            {showEllipsis && (
              <span className="text-sm text-muted-foreground shrink-0">…</span>
            )}
            {visibleEvents.map((event, i) => {
              const globalIndex = startIndex + i;
              const runningTotal = events.slice(0, globalIndex + 1).reduce((sum, e) => sum + e.points, 0);
              return (
                <motion.div
                  data-chip
                  key={event.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={cn("px-3 py-1 rounded-full text-sm font-medium shrink-0", "bg-primary/10 text-primary")}
                >
                  +{event.points} <span className="text-muted-foreground">({runningTotal})</span>
                </motion.div>
              );
            })}
          </div>

          <Button variant="success" size="lg" onClick={onBank} disabled={!canBank} className="shrink-0 px-6">
            <PiggyBank className="w-5 h-5 mr-2" />
            Bank
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
