import React, { useState, useEffect } from 'react';
import { Player } from './types';
import { getCurrentPlayer, clearCurrentPlayer, getLeaderboard } from './utils/localStorage';
import LoginScreen from './components/LoginScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';
import Leaderboard from './components/Leaderboard';

type AppScreen = 'login' | 'game' | 'gameOver' | 'leaderboard';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login');
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [lastScore, setLastScore] = useState(0);
  const [lastCoins, setLastCoins] = useState(0);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);

  useEffect(() => {
    const player = getCurrentPlayer();
    if (player) {
      setCurrentPlayer(player);
      setCurrentScreen('game');
    }
  }, []);

  const handleLogin = (player: Player) => {
    setCurrentPlayer(player);
    setCurrentScreen('game');
  };

  const handleGameOver = (score: number, coins: number) => {
    setLastScore(score);
    setLastCoins(coins);
    
    // Actualizar el jugador actual con los nuevos stats
    if (currentPlayer) {
      const updatedPlayer: Player = {
        ...currentPlayer,
        bestScore: Math.max(currentPlayer.bestScore, score),
        totalCoins: currentPlayer.totalCoins + coins,
        gamesPlayed: currentPlayer.gamesPlayed + 1,
      };
      setCurrentPlayer(updatedPlayer);
    }
    
    setCurrentScreen('gameOver');
  };

  const handleRestart = () => {
    setCurrentScreen('game');
  };

  const handleShowLeaderboard = () => {
    setLeaderboard(getLeaderboard());
    setCurrentScreen('leaderboard');
  };

  const handleCloseLeaderboard = () => {
    setCurrentScreen('gameOver');
  };

  const handleChangePlayer = () => {
    clearCurrentPlayer();
    setCurrentPlayer(null);
    setCurrentScreen('login');
  };

  return (
    <div style={styles.app}>
      {currentScreen === 'login' && <LoginScreen onLogin={handleLogin} />}
      
      {currentScreen === 'game' && currentPlayer && (
        <Game player={currentPlayer} onGameOver={handleGameOver} />
      )}
      
      {currentScreen === 'gameOver' && currentPlayer && (
        <GameOver
          score={lastScore}
          coins={lastCoins}
          player={currentPlayer}
          onRestart={handleRestart}
          onShowLeaderboard={handleShowLeaderboard}
          onChangePlayer={handleChangePlayer}
        />
      )}
      
      {currentScreen === 'leaderboard' && (
        <Leaderboard
          players={leaderboard}
          currentPlayer={currentPlayer}
          onClose={handleCloseLeaderboard}
        />
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    margin: 0,
    padding: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
  },
};

export default App;
