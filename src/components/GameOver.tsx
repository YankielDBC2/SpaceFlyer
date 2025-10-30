import React from 'react';
import { Player } from '../types';

interface GameOverProps {
  score: number;
  coins: number;
  player: Player;
  onRestart: () => void;
  onShowLeaderboard: () => void;
  onChangePlayer: () => void;
}

const GameOver: React.FC<GameOverProps> = ({
  score,
  coins,
  player,
  onRestart,
  onShowLeaderboard,
  onChangePlayer,
}) => {
  const isNewRecord = score > player.bestScore;

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <h2 style={styles.title}>💥 GAME OVER 💥</h2>
        
        {isNewRecord && score > 0 && (
          <div style={styles.newRecord}>
            🎉 ¡NUEVO RÉCORD PERSONAL! 🎉
          </div>
        )}
        
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Puntuación:</span>
            <span style={styles.statValue}>{score}</span>
          </div>
          
          <div style={styles.statItem}>
            <span style={styles.statLabel}>🪙 Monedas:</span>
            <span style={{...styles.statValue, color: '#ffd700'}}>{coins}</span>
          </div>
          
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Mejor puntuación:</span>
            <span style={styles.statValue}>{player.bestScore}</span>
          </div>
          
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Total de monedas:</span>
            <span style={{...styles.statValue, color: '#ffd700'}}>{player.totalCoins}</span>
          </div>
          
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Partidas jugadas:</span>
            <span style={styles.statValue}>{player.gamesPlayed}</span>
          </div>
        </div>

        <div style={styles.buttonContainer}>
          <button onClick={onRestart} style={styles.primaryButton}>
            🚀 JUGAR DE NUEVO
          </button>
          
          <button onClick={onShowLeaderboard} style={styles.secondaryButton}>
            🏆 VER RANKING
          </button>
          
          <button onClick={onChangePlayer} style={styles.secondaryButton}>
            👤 CAMBIAR JUGADOR
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  container: {
    background: 'rgba(0, 0, 0, 0.9)',
    padding: '30px',
    borderRadius: '15px',
    border: '2px solid #00d4ff',
    maxWidth: '500px',
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 0 40px rgba(0, 212, 255, 0.6)',
  },
  title: {
    color: '#ff4444',
    fontSize: '32px',
    marginBottom: '20px',
    textShadow: '0 0 10px #ff4444',
  },
  newRecord: {
    color: '#ffd700',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textShadow: '0 0 10px #ffd700',
    animation: 'pulse 1s infinite',
  },
  stats: {
    margin: '20px 0',
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 20px',
    margin: '5px 0',
    background: 'rgba(0, 212, 255, 0.1)',
    borderRadius: '8px',
  },
  statLabel: {
    color: '#ffffff',
    fontSize: '18px',
  },
  statValue: {
    color: '#00d4ff',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '20px',
  },
  primaryButton: {
    padding: '15px 30px',
    fontSize: '18px',
    background: 'linear-gradient(to bottom, #00d4ff, #0099cc)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'transform 0.2s',
  },
  secondaryButton: {
    padding: '12px 30px',
    fontSize: '16px',
    background: 'rgba(0, 212, 255, 0.2)',
    color: '#00d4ff',
    border: '2px solid #00d4ff',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s',
  },
};

export default GameOver;
