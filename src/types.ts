export interface Player {
  name: string;
  bestScore: number;
  totalCoins: number;
  gamesPlayed: number;
}

export interface Rocket {
  x: number;
  y: number;
  width: number;
  height: number;
  velocity: number;
  gravity: number;
  jump: number;
}

export interface Asteroid {
  x: number;
  topHeight: number;
  scored: boolean;
}

export interface Coin {
  x: number;
  y: number;
  collected: boolean;
}

export interface GameState {
  gameStarted: boolean;
  gameRunning: boolean;
  score: number;
  coins: number;
  frameCount: number;
}
