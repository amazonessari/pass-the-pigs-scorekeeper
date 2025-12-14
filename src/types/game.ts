export type OutcomeType =
  | 'sider'
  | 'razorback'
  | 'trotter'
  | 'snouter'
  | 'leaning-jowler'
  | 'double-razorback'
  | 'double-trotter'
  | 'double-snouter'
  | 'double-leaning-jowler'
  | 'pig-out'
  | 'makin-bacon';

export interface Outcome {
  type: OutcomeType;
  label: string;
  points: number;
  isDouble: boolean;
  isPenalty: boolean;
  description: string;
  emoji: string;
}

export interface TurnEvent {
  id: string;
  timestamp: number;
  outcome: OutcomeType;
  points: number;
}

export interface Turn {
  id: string;
  playerId: string;
  events: TurnEvent[];
  turnPoints: number;
  banked: boolean;
  endedByPenalty: boolean;
}

export interface Player {
  id: string;
  name: string;
  totalScore: number;
  turns: Turn[];
  stats: {
    totalTurns: number;
    totalRolls: number;
    doublesCount: number;
    pigOutCount: number;
    makinBaconCount: number;
    highestTurn: number;
  };
}

export interface Game {
  id: string;
  createdAt: number;
  updatedAt: number;
  targetScore: number;
  status: 'setup' | 'active' | 'complete';
  players: Player[];
  currentPlayerIndex: number;
  currentTurn: Turn | null;
  winnerId: string | null;
  history: HistoryEntry[];
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  type: 'roll' | 'bank' | 'penalty' | 'undo';
  playerId: string;
  playerName: string;
  outcome?: OutcomeType;
  points?: number;
  description: string;
}

export const OUTCOMES: Record<OutcomeType, Outcome> = {
  'sider': {
    type: 'sider',
    label: 'Sider',
    points: 1,
    isDouble: false,
    isPenalty: false,
    description: 'Both pigs on same side',
    emoji: '🐷',
  },
  'razorback': {
    type: 'razorback',
    label: 'Razorback',
    points: 5,
    isDouble: false,
    isPenalty: false,
    description: 'Pig on its back',
    emoji: '🔙',
  },
  'trotter': {
    type: 'trotter',
    label: 'Trotter',
    points: 5,
    isDouble: false,
    isPenalty: false,
    description: 'Pig on all fours',
    emoji: '🦵',
  },
  'snouter': {
    type: 'snouter',
    label: 'Snouter',
    points: 10,
    isDouble: false,
    isPenalty: false,
    description: 'Pig on snout',
    emoji: '👃',
  },
  'leaning-jowler': {
    type: 'leaning-jowler',
    label: 'Leaning Jowler',
    points: 15,
    isDouble: false,
    isPenalty: false,
    description: 'Pig on snout & ear',
    emoji: '🎯',
  },
  'double-razorback': {
    type: 'double-razorback',
    label: 'Double Razorback',
    points: 20,
    isDouble: true,
    isPenalty: false,
    description: 'Both pigs on back',
    emoji: '🔙🔙',
  },
  'double-trotter': {
    type: 'double-trotter',
    label: 'Double Trotter',
    points: 20,
    isDouble: true,
    isPenalty: false,
    description: 'Both pigs on all fours',
    emoji: '🦵🦵',
  },
  'double-snouter': {
    type: 'double-snouter',
    label: 'Double Snouter',
    points: 40,
    isDouble: true,
    isPenalty: false,
    description: 'Both pigs on snout',
    emoji: '👃👃',
  },
  'double-leaning-jowler': {
    type: 'double-leaning-jowler',
    label: 'Double Jowler',
    points: 60,
    isDouble: true,
    isPenalty: false,
    description: 'Both pigs on snout & ear',
    emoji: '🎯🎯',
  },
  'pig-out': {
    type: 'pig-out',
    label: 'Pig Out!',
    points: 0,
    isDouble: false,
    isPenalty: true,
    description: 'Opposite sides - lose turn points',
    emoji: '😵',
  },
  'makin-bacon': {
    type: 'makin-bacon',
    label: "Makin' Bacon!",
    points: 0,
    isDouble: false,
    isPenalty: true,
    description: 'Pigs touching - lose all points!',
    emoji: '💔',
  },
};

export const SINGLE_OUTCOMES: OutcomeType[] = [
  'sider',
  'razorback',
  'trotter',
  'snouter',
  'leaning-jowler',
];

export const DOUBLE_OUTCOMES: OutcomeType[] = [
  'double-razorback',
  'double-trotter',
  'double-snouter',
  'double-leaning-jowler',
];

export const PENALTY_OUTCOMES: OutcomeType[] = [
  'pig-out',
  'makin-bacon',
];
