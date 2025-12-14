import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PigIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

export const PigIcon = ({ className, size = 'md', animate = false }: PigIconProps) => {
  const Component = animate ? motion.div : 'div';
  const animationProps = animate ? {
    animate: { rotate: [0, -5, 5, -5, 0] },
    transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 }
  } : {};

  return (
    <Component
      className={cn(sizes[size], 'relative', className)}
      {...animationProps}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Body */}
        <ellipse
          cx="50"
          cy="55"
          rx="35"
          ry="30"
          className="fill-pig-pink"
        />
        
        {/* Head */}
        <circle
          cx="50"
          cy="35"
          r="22"
          className="fill-pig-pink"
        />
        
        {/* Snout */}
        <ellipse
          cx="50"
          cy="42"
          rx="12"
          ry="10"
          className="fill-pig-snout"
        />
        
        {/* Nostrils */}
        <ellipse cx="45" cy="43" rx="3" ry="2" className="fill-foreground/30" />
        <ellipse cx="55" cy="43" rx="3" ry="2" className="fill-foreground/30" />
        
        {/* Eyes */}
        <circle cx="40" cy="30" r="4" className="fill-foreground" />
        <circle cx="60" cy="30" r="4" className="fill-foreground" />
        <circle cx="41" cy="29" r="1.5" className="fill-background" />
        <circle cx="61" cy="29" r="1.5" className="fill-background" />
        
        {/* Ears */}
        <ellipse
          cx="32"
          cy="20"
          rx="8"
          ry="12"
          className="fill-pig-pink"
          transform="rotate(-20 32 20)"
        />
        <ellipse
          cx="68"
          cy="20"
          rx="8"
          ry="12"
          className="fill-pig-pink"
          transform="rotate(20 68 20)"
        />
        <ellipse
          cx="32"
          cy="20"
          rx="4"
          ry="6"
          className="fill-pig-snout"
          transform="rotate(-20 32 20)"
        />
        <ellipse
          cx="68"
          cy="20"
          rx="4"
          ry="6"
          className="fill-pig-snout"
          transform="rotate(20 68 20)"
        />
        
        {/* Legs */}
        <rect x="25" y="75" width="10" height="15" rx="4" className="fill-pig-pink" />
        <rect x="40" y="75" width="10" height="15" rx="4" className="fill-pig-pink" />
        <rect x="50" y="75" width="10" height="15" rx="4" className="fill-pig-pink" />
        <rect x="65" y="75" width="10" height="15" rx="4" className="fill-pig-pink" />
        
        {/* Tail */}
        <path
          d="M 85 55 Q 95 45 90 55 Q 85 65 95 60"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          className="stroke-pig-pink"
        />
      </svg>
    </Component>
  );
};
