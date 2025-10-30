import React from 'react';
import { Player } from '../types';

interface LeaderboardProps {
  players: Player[];
  currentPlayer: Player | null;
  onClose: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players, currentPlayer, onClose }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <h2 style={styles.title}>🏆 RANKING ESPACIAL 🏆</h2>
        
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Jugador</th>
                <th style={styles.th}>Mejor</th>
                <th style={styles.th}>🪙</th>
                <th style={styles.th}>Partidas</th>
              </tr>
            </thead>
            <tbody>
              {players.length === 0 ? (
                <tr>
                  <td colSpan={5} style={styles.noData}>
                    No hay jugadores registrados aún
                  </td>
                </tr>
              ) : (
                players.map((player, index) => (
                  <tr
                    key={player.name}
                    style={{
                      ...styles.row,
                      ...(currentPlayer?.name === player.name ? styles.currentPlayerRow : {}),
                    }}
                  >
                    <td style={styles.td}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </td>
                    <td style={styles.td}>
                      {player.name}
                      {currentPlayer?.name === player.name && ' (Tú)'}
                    </td>
                    <td style={styles.td}>{player.bestScore}</td>
                    <td style={styles.td}>{player.totalCoins}</td>
                    <td style={styles.td}>{player.gamesPlayed}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <button onClick={onClose} style={styles.closeButton}>
          CERRAR
        </button>
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
    zIndex: 200,
  },
  container: {
    background: 'rgba(10, 10, 46, 0.95)',
    padding: '30px',
    borderRadius: '20px',
    border: '2px solid #00d4ff',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: '0 0 40px rgba(0, 212, 255, 0.6)',
  },
  title: {
    color: '#00d4ff',
    textAlign: 'center',
    fontSize: '32px',
    marginBottom: '20px',
    textShadow: '0 0 10px #00d4ff',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  headerRow: {
    background: 'rgba(0, 212, 255, 0.2)',
  },
  th: {
    padding: '12px',
    color: '#00d4ff',
    fontWeight: 'bold',
    borderBottom: '2px solid #00d4ff',
    textAlign: 'center',
  },
  row: {
    transition: 'background 0.3s',
  },
  currentPlayerRow: {
    background: 'rgba(0, 212, 255, 0.15)',
    fontWeight: 'bold',
  },
  td: {
    padding: '10px',
    color: '#ffffff',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
  },
  noData: {
    padding: '30px',
    color: '#999',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: '20px',
    padding: '12px 30px',
    fontSize: '18px',
    background: 'linear-gradient(to bottom, #00d4ff, #0099cc)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '100%',
    transition: 'transform 0.2s',
  },
};

export default Leaderboard;
