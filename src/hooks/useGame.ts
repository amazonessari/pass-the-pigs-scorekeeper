import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Game, Player, Turn, TurnEvent, OutcomeType, OUTCOMES, HistoryEntry } from '@/types/game';

const STORAGE_KEY = 'pass-the-pigs-games';
const CURRENT_GAME_KEY = 'pass-the-pigs-current';

const createPlayer = (name: string): Player => ({
  id: uuidv4(),
  name,
  totalScore: 0,
  turns: [],
  stats: {
    totalTurns: 0,
    totalRolls: 0,
    doublesCount: 0,
    pigOutCount: 0,
    makinBaconCount: 0,
    highestTurn: 0,
  },
});

const createTurn = (playerId: string): Turn => ({
  id: uuidv4(),
  playerId,
  events: [],
  turnPoints: 0,
  banked: false,
  endedByPenalty: false,
});

const createGame = (playerNames: string[], targetScore: number): Game => {
  const players = playerNames.map(createPlayer);
  return {
    id: uuidv4(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    targetScore,
    status: 'active',
    players,
    currentPlayerIndex: 0,
    currentTurn: createTurn(players[0].id),
    winnerId: null,
    history: [],
  };
};

export const useGame = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [undoStack, setUndoStack] = useState<Game[]>([]);

  // Load games from storage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const games = JSON.parse(stored) as Game[];
        setRecentGames(games.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 10));
      } catch (e) {
        console.error('Failed to load games:', e);
      }
    }

    const currentStored = localStorage.getItem(CURRENT_GAME_KEY);
    if (currentStored) {
      try {
        setGame(JSON.parse(currentStored));
      } catch (e) {
        console.error('Failed to load current game:', e);
      }
    }
  }, []);

  // Save current game
  useEffect(() => {
    if (game) {
      localStorage.setItem(CURRENT_GAME_KEY, JSON.stringify(game));
      
      // Update recent games
      const stored = localStorage.getItem(STORAGE_KEY);
      let games: Game[] = stored ? JSON.parse(stored) : [];
      games = games.filter(g => g.id !== game.id);
      games.unshift(game);
      games = games.slice(0, 20);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
      setRecentGames(games.slice(0, 10));
    }
  }, [game]);

  const startNewGame = useCallback((playerNames: string[], targetScore: number = 100) => {
    const newGame = createGame(playerNames, targetScore);
    setGame(newGame);
    setUndoStack([]);
    return newGame;
  }, []);

  const loadGame = useCallback((gameId: string) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const games = JSON.parse(stored) as Game[];
      const found = games.find(g => g.id === gameId);
      if (found) {
        setGame(found);
        setUndoStack([]);
        return found;
      }
    }
    return null;
  }, []);

  const getCurrentPlayer = useCallback(() => {
    if (!game) return null;
    return game.players[game.currentPlayerIndex];
  }, [game]);

  const recordOutcome = useCallback((outcomeType: OutcomeType) => {
    if (!game || !game.currentTurn || game.status !== 'active') return;

    // Save state for undo
    setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(game))]);

    const outcome = OUTCOMES[outcomeType];
    const currentPlayer = game.players[game.currentPlayerIndex];
    
    const event: TurnEvent = {
      id: uuidv4(),
      timestamp: Date.now(),
      outcome: outcomeType,
      points: outcome.points,
    };

    const historyEntry: HistoryEntry = {
      id: uuidv4(),
      timestamp: Date.now(),
      type: outcome.isPenalty ? 'penalty' : 'roll',
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      outcome: outcomeType,
      points: outcome.points,
      description: outcome.isPenalty 
        ? `${currentPlayer.name} got ${outcome.label}!`
        : `${currentPlayer.name} scored ${outcome.points} with ${outcome.label}`,
    };

    setGame(prev => {
      if (!prev || !prev.currentTurn) return prev;

      const newTurn = { ...prev.currentTurn };
      newTurn.events = [...newTurn.events, event];
      
      const newPlayers = [...prev.players];
      const playerIndex = prev.currentPlayerIndex;
      const player = { ...newPlayers[playerIndex] };
      
      // Update player stats
      player.stats = {
        ...player.stats,
        totalRolls: player.stats.totalRolls + 1,
        doublesCount: player.stats.doublesCount + (outcome.isDouble ? 1 : 0),
        pigOutCount: player.stats.pigOutCount + (outcomeType === 'pig-out' ? 1 : 0),
        makinBaconCount: player.stats.makinBaconCount + (outcomeType === 'makin-bacon' ? 1 : 0),
      };

      if (outcome.isPenalty) {
        // Handle penalties
        if (outcomeType === 'makin-bacon') {
          // Lose all points
          player.totalScore = 0;
        }
        // Turn ends with penalty
        newTurn.turnPoints = 0;
        newTurn.endedByPenalty = true;
        newTurn.banked = false;
        player.stats.totalTurns++;
        player.turns = [...player.turns, newTurn];
        newPlayers[playerIndex] = player;

        // Move to next player
        const nextPlayerIndex = (playerIndex + 1) % prev.players.length;
        
        return {
          ...prev,
          players: newPlayers,
          currentPlayerIndex: nextPlayerIndex,
          currentTurn: createTurn(prev.players[nextPlayerIndex].id),
          history: [...prev.history, historyEntry],
          updatedAt: Date.now(),
        };
      } else {
        // Add points to current turn
        newTurn.turnPoints += outcome.points;
        newPlayers[playerIndex] = player;

        return {
          ...prev,
          players: newPlayers,
          currentTurn: newTurn,
          history: [...prev.history, historyEntry],
          updatedAt: Date.now(),
        };
      }
    });

    // Trigger haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(outcome.isPenalty ? [100, 50, 100] : 30);
    }
  }, [game]);

  const bankPoints = useCallback(() => {
    if (!game || !game.currentTurn || game.status !== 'active') return;
    if (game.currentTurn.turnPoints === 0) return;

    // Save state for undo
    setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(game))]);

    setGame(prev => {
      if (!prev || !prev.currentTurn) return prev;

      const newPlayers = [...prev.players];
      const playerIndex = prev.currentPlayerIndex;
      const player = { ...newPlayers[playerIndex] };
      
      const turnPoints = prev.currentTurn.turnPoints;
      player.totalScore += turnPoints;
      player.stats.totalTurns++;
      player.stats.highestTurn = Math.max(player.stats.highestTurn, turnPoints);
      
      const completedTurn = { ...prev.currentTurn, banked: true };
      player.turns = [...player.turns, completedTurn];
      newPlayers[playerIndex] = player;

      const historyEntry: HistoryEntry = {
        id: uuidv4(),
        timestamp: Date.now(),
        type: 'bank',
        playerId: player.id,
        playerName: player.name,
        points: turnPoints,
        description: `${player.name} banked ${turnPoints} points (Total: ${player.totalScore})`,
      };

      // Check for winner
      if (player.totalScore >= prev.targetScore) {
        return {
          ...prev,
          players: newPlayers,
          currentTurn: null,
          status: 'complete',
          winnerId: player.id,
          history: [...prev.history, historyEntry],
          updatedAt: Date.now(),
        };
      }

      // Move to next player
      const nextPlayerIndex = (playerIndex + 1) % prev.players.length;
      
      return {
        ...prev,
        players: newPlayers,
        currentPlayerIndex: nextPlayerIndex,
        currentTurn: createTurn(prev.players[nextPlayerIndex].id),
        history: [...prev.history, historyEntry],
        updatedAt: Date.now(),
      };
    });

    // Success haptic
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
  }, [game]);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;

    const previousState = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setGame(previousState);

    if (navigator.vibrate) {
      navigator.vibrate(20);
    }
  }, [undoStack]);

  const clearCurrentGame = useCallback(() => {
    setGame(null);
    setUndoStack([]);
    localStorage.removeItem(CURRENT_GAME_KEY);
  }, []);

  const deleteGame = useCallback((gameId: string) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const games = JSON.parse(stored) as Game[];
      const filtered = games.filter(g => g.id !== gameId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      setRecentGames(filtered.slice(0, 10));
    }
    if (game?.id === gameId) {
      clearCurrentGame();
    }
  }, [game, clearCurrentGame]);

  return {
    game,
    recentGames,
    canUndo: undoStack.length > 0,
    startNewGame,
    loadGame,
    getCurrentPlayer,
    recordOutcome,
    bankPoints,
    undo,
    clearCurrentGame,
    deleteGame,
  };
};
