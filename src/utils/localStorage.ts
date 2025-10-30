import { Player } from '../types';

const PLAYERS_KEY = 'spaceFlyer_players';
const CURRENT_PLAYER_KEY = 'spaceFlyer_currentPlayer';

export const getPlayers = (): Player[] => {
  const playersJson = localStorage.getItem(PLAYERS_KEY);
  return playersJson ? JSON.parse(playersJson) : [];
};

export const savePlayer = (player: Player): void => {
  const players = getPlayers();
  const existingPlayerIndex = players.findIndex(p => p.name === player.name);
  
  if (existingPlayerIndex >= 0) {
    players[existingPlayerIndex] = player;
  } else {
    players.push(player);
  }
  
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
};

export const getCurrentPlayer = (): Player | null => {
  const playerJson = localStorage.getItem(CURRENT_PLAYER_KEY);
  return playerJson ? JSON.parse(playerJson) : null;
};

export const setCurrentPlayer = (player: Player): void => {
  localStorage.setItem(CURRENT_PLAYER_KEY, JSON.stringify(player));
};

export const clearCurrentPlayer = (): void => {
  localStorage.removeItem(CURRENT_PLAYER_KEY);
};

export const updatePlayerStats = (name: string, score: number, coins: number): void => {
  const players = getPlayers();
  const player = players.find(p => p.name === name);
  
  if (player) {
    if (score > player.bestScore) {
      player.bestScore = score;
    }
    player.totalCoins += coins;
    player.gamesPlayed += 1;
    savePlayer(player);
    setCurrentPlayer(player);
  }
};

export const getLeaderboard = (): Player[] => {
  const players = getPlayers();
  return players.sort((a, b) => b.bestScore - a.bestScore).slice(0, 10);
};
