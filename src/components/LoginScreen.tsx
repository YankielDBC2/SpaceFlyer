import React, { useState } from 'react';
import { Player } from '../types';
import { getPlayers, savePlayer, setCurrentPlayer } from '../utils/localStorage';

interface LoginScreenProps {
  onLogin: (player: Player) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    if (playerName.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    const players = getPlayers();
    let player = players.find(p => p.name === playerName.trim());

    if (!player) {
      player = {
        name: playerName.trim(),
        bestScore: 0,
        totalCoins: 0,
        gamesPlayed: 0
      };
      savePlayer(player);
    }

    setCurrentPlayer(player);
    onLogin(player);
  };

  return (
    <div style={styles.container}>
      <div style={styles.stars}></div>
      <div style={styles.loginBox}>
        <h1 style={styles.title}>🚀 SPACE FLYER 🚀</h1>
        <p style={styles.subtitle}>Bienvenido al espacio</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setError('');
            }}
            placeholder="Ingresa tu nombre"
            style={styles.input}
            maxLength={20}
            autoFocus
          />
          
          {error && <p style={styles.error}>{error}</p>}
          
          <button type="submit" style={styles.button}>
            COMENZAR AVENTURA
          </button>
        </form>

        <div style={styles.instructions}>
          <p>🎮 Controles:</p>
          <p>Click o ESPACIO para volar</p>
          <p>🪙 Recoge monedas para puntos extra</p>
          <p>⚠️ Esquiva los asteroides</p>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(to bottom, #0a0a2e 0%, #16213e 50%, #0f3460 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  stars: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundImage: `
      radial-gradient(2px 2px at 20px 30px, white, transparent),
      radial-gradient(2px 2px at 60px 70px, white, transparent),
      radial-gradient(1px 1px at 50px 50px, white, transparent),
      radial-gradient(1px 1px at 130px 80px, white, transparent),
      radial-gradient(2px 2px at 90px 10px, white, transparent)
    `,
    backgroundSize: '200px 200px',
    backgroundRepeat: 'repeat',
    animation: 'moveStars 20s linear infinite',
  },
  loginBox: {
    position: 'relative',
    background: 'rgba(0, 0, 0, 0.8)',
    padding: '40px',
    borderRadius: '20px',
    border: '2px solid #00d4ff',
    textAlign: 'center',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 0 30px rgba(0, 212, 255, 0.5)',
  },
  title: {
    fontSize: '42px',
    color: '#00d4ff',
    textShadow: '0 0 20px #00d4ff',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#ffffff',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '15px',
    fontSize: '18px',
    borderRadius: '10px',
    border: '2px solid #00d4ff',
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    outline: 'none',
    transition: 'all 0.3s',
  },
  error: {
    color: '#ff4444',
    fontSize: '14px',
    margin: '0',
  },
  button: {
    padding: '15px 30px',
    fontSize: '20px',
    background: 'linear-gradient(to bottom, #00d4ff, #0099cc)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'transform 0.2s',
    marginTop: '10px',
  },
  instructions: {
    marginTop: '30px',
    color: '#ffffff',
    fontSize: '14px',
    lineHeight: '1.8',
  },
};

export default LoginScreen;
