import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Rocket, Asteroid, Coin, GameState, Player } from '../types';
import { updatePlayerStats } from '../utils/localStorage';

interface GameProps {
  player: Player;
  onGameOver: (score: number, coins: number) => void;
}

const Game: React.FC<GameProps> = ({ player, onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    gameStarted: false,
    gameRunning: false,
    score: 0,
    coins: 0,
    frameCount: 0,
  });

  const rocketRef = useRef<Rocket>({
    x: 100,
    y: 0,
    width: 40,
    height: 50,
    velocity: 0,
    gravity: 0.12,
    jump: -6,
  });

  const asteroidsRef = useRef<Asteroid[]>([]);
  const coinsRef = useRef<Coin[]>([]);
  const animationRef = useRef<number>();

  // Referencias para las imágenes
  const rocketUpImgRef = useRef<HTMLImageElement | null>(null);
  const rocketDownImgRef = useRef<HTMLImageElement | null>(null);
  const coinImgRef = useRef<HTMLImageElement | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const ASTEROID_GAP = 300;
  const ASTEROID_WIDTH = 60;
  const COIN_RADIUS = 20;

  // Cargar imágenes
  useEffect(() => {
    const rocketUp = new Image();
    const rocketDown = new Image();
    const coin = new Image();

    let loadedCount = 0;
    const totalImages = 3;

    const onImageLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        setImagesLoaded(true);
      }
    };

    rocketUp.onload = onImageLoad;
    rocketDown.onload = onImageLoad;
    coin.onload = onImageLoad;

    rocketUp.src = '/subiendo.png';
    rocketDown.src = '/cayendo.png';
    coin.src = '/hcash.png';

    rocketUpImgRef.current = rocketUp;
    rocketDownImgRef.current = rocketDown;
    coinImgRef.current = coin;
  }, []);

  const drawRocket = useCallback((ctx: CanvasRenderingContext2D, rocket: Rocket) => {
    ctx.save();

    // Seleccionar imagen según la velocidad
    const rocketImg = rocket.velocity < 0 ? rocketUpImgRef.current : rocketDownImgRef.current;

    if (rocketImg && rocketImg.complete) {
      ctx.drawImage(rocketImg, rocket.x, rocket.y, rocket.width, rocket.height);
    }

    ctx.restore();
  }, []);

  const drawCoin = useCallback((ctx: CanvasRenderingContext2D, coin: Coin) => {
    ctx.save();

    const coinImg = coinImgRef.current;
    const size = COIN_RADIUS * 2;

    if (coinImg && coinImg.complete) {
      ctx.drawImage(coinImg, coin.x - COIN_RADIUS, coin.y - COIN_RADIUS, size, size);
    }

    ctx.restore();
  }, [COIN_RADIUS]);

  const drawAsteroid = useCallback((ctx: CanvasRenderingContext2D, asteroid: Asteroid, canvasHeight: number) => {
    ctx.save();

    ctx.fillStyle = '#8b4513';
    ctx.fillRect(asteroid.x, 0, ASTEROID_WIDTH, asteroid.topHeight);

    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.arc(asteroid.x + 20, asteroid.topHeight - 30, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(asteroid.x + 40, asteroid.topHeight - 15, 6, 0, Math.PI * 2);
    ctx.fill();

    const bottomStart = asteroid.topHeight + ASTEROID_GAP;
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(asteroid.x, bottomStart, ASTEROID_WIDTH, canvasHeight - bottomStart);

    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.arc(asteroid.x + 25, bottomStart + 20, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(asteroid.x + 45, bottomStart + 35, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }, [ASTEROID_GAP, ASTEROID_WIDTH]);

  const createAsteroid = useCallback((canvasWidth: number, canvasHeight: number) => {
    const minHeight = 120;
    const maxHeight = canvasHeight - ASTEROID_GAP - 120;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    asteroidsRef.current.push({
      x: canvasWidth,
      topHeight,
      scored: false,
    });
  }, [ASTEROID_GAP]);

  const createCoin = useCallback((canvasWidth: number, canvasHeight: number) => {
    const minY = 80;
    const maxY = canvasHeight - 80;
    const y = Math.random() * (maxY - minY) + minY;

    coinsRef.current.push({
      x: canvasWidth + 50,
      y,
      collected: false,
    });
  }, []);

  const endGame = useCallback(() => {
    setGameState(prev => ({ ...prev, gameRunning: false }));
    updatePlayerStats(player.name, gameState.score, gameState.coins);
    onGameOver(gameState.score, gameState.coins);
  }, [player.name, gameState.score, gameState.coins, onGameOver]);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameState.gameRunning) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const rocket = rocketRef.current;
    rocket.velocity += rocket.gravity;
    rocket.y += rocket.velocity;

    drawRocket(ctx, rocket);

    const newFrameCount = gameState.frameCount + 1;

    if (newFrameCount % 100 === 0) {
      createAsteroid(canvas.width, canvas.height);
    }

    if (newFrameCount % 80 === 0) {
      createCoin(canvas.width, canvas.height);
    }

    let newScore = gameState.score;
    let newCoins = gameState.coins;

    // Actualizar monedas
    for (let i = coinsRef.current.length - 1; i >= 0; i--) {
      const coin = coinsRef.current[i];

      if (!coin.collected) {
        coin.x -= 2.5;
        drawCoin(ctx, coin);

        const rocketCenterX = rocket.x + rocket.width / 2;
        const rocketCenterY = rocket.y + rocket.height / 2;
        const distance = Math.sqrt(
          Math.pow(coin.x - rocketCenterX, 2) + Math.pow(coin.y - rocketCenterY, 2)
        );

        if (distance < COIN_RADIUS + 20) {
          coin.collected = true;
          newCoins++;
          newScore += 5;
        }
      }

      if (coin.x + COIN_RADIUS < 0) {
        coinsRef.current.splice(i, 1);
      }
    }

    // Actualizar asteroides
    for (let i = asteroidsRef.current.length - 1; i >= 0; i--) {
      const asteroid = asteroidsRef.current[i];
      asteroid.x -= 2.5;

      drawAsteroid(ctx, asteroid, canvas.height);

      if (!asteroid.scored && asteroid.x + ASTEROID_WIDTH < rocket.x) {
        newScore++;
        asteroid.scored = true;
      }

      if (asteroid.x + ASTEROID_WIDTH < 0) {
        asteroidsRef.current.splice(i, 1);
      }

      const margin = 8;
      const rocketLeft = rocket.x + margin;
      const rocketRight = rocket.x + rocket.width - margin;
      const rocketTop = rocket.y + margin;
      const rocketBottom = rocket.y + rocket.height - margin;

      const asteroidLeft = asteroid.x;
      const asteroidRight = asteroid.x + ASTEROID_WIDTH;
      const topObstacleBottom = asteroid.topHeight;
      const bottomObstacleTop = asteroid.topHeight + ASTEROID_GAP;

      if (rocketRight > asteroidLeft && rocketLeft < asteroidRight) {
        if (rocketTop < topObstacleBottom || rocketBottom > bottomObstacleTop) {
          endGame();
          return;
        }
      }
    }

    if (rocket.y + rocket.height > canvas.height || rocket.y < 0) {
      endGame();
      return;
    }

    setGameState(prev => ({
      ...prev,
      score: newScore,
      coins: newCoins,
      frameCount: newFrameCount,
    }));

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [
    gameState,
    drawRocket,
    drawCoin,
    drawAsteroid,
    createAsteroid,
    createCoin,
    endGame,
    ASTEROID_GAP,
    ASTEROID_WIDTH,
    COIN_RADIUS,
  ]);

  useEffect(() => {
    if (gameState.gameRunning) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.gameRunning, gameLoop]);

  const jump = useCallback(() => {
    if (gameState.gameRunning) {
      rocketRef.current.velocity = rocketRef.current.jump;
    }
  }, [gameState.gameRunning]);

  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imagesLoaded) return;

    rocketRef.current.y = canvas.height / 2;
    rocketRef.current.velocity = 0;
    asteroidsRef.current = [];
    coinsRef.current = [];

    setGameState({
      gameStarted: true,
      gameRunning: true,
      score: 0,
      coins: 0,
      frameCount: 0,
    });
  }, [imagesLoaded]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleClick = () => {
      if (!gameState.gameStarted && imagesLoaded) {
        startGame();
      } else if (gameState.gameStarted) {
        jump();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!gameState.gameStarted && imagesLoaded) {
          startGame();
        } else if (gameState.gameStarted) {
          jump();
        }
      }
    };

    canvas.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      canvas.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState.gameStarted, imagesLoaded, startGame, jump]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.stars}></div>
      <canvas ref={canvasRef} style={styles.canvas} />

      <div style={styles.scoreBoard}>
        <div style={styles.score}>🏆 {gameState.score}</div>
        <div style={styles.coins}>🪙 {gameState.coins}</div>
      </div>

      <div style={styles.playerInfo}>
        👨‍🚀 {player.name}
      </div>

      {!gameState.gameStarted && (
        <div style={styles.startScreen}>
          {!imagesLoaded ? (
            <h1 style={styles.startTitle}>Cargando recursos... 🚀</h1>
          ) : (
            <>
              <h1 style={styles.startTitle}>¡Listo para despegar, {player.name}!</h1>
              <p style={styles.startText}>Haz clic o presiona ESPACIO para comenzar</p>
              <p style={styles.startText}>🪙 Recoge monedas (+5 puntos)</p>
              <p style={styles.startText}>⚠️ Esquiva los asteroides</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(to bottom, #0a0a2e 0%, #16213e 50%, #0f3460 100%)',
    overflow: 'hidden',
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
      radial-gradient(2px 2px at 90px 10px, white, transparent),
      radial-gradient(1px 1px at 200px 90px, white, transparent),
      radial-gradient(2px 2px at 300px 40px, white, transparent)
    `,
    backgroundSize: '200px 200px',
    backgroundRepeat: 'repeat',
    animation: 'moveStars 20s linear infinite',
  },
  canvas: {
    position: 'relative',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  scoreBoard: {
    position: 'absolute',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '30px',
    zIndex: 10,
  },
  score: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#00d4ff',
    textShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff',
  },
  coins: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#ffd700',
    textShadow: '0 0 10px #ffd700, 0 0 20px #ffd700',
  },
  playerInfo: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#ffffff',
    textShadow: '0 0 10px rgba(0, 212, 255, 0.8)',
    zIndex: 10,
  },
  startScreen: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    zIndex: 100,
    color: 'white',
  },
  startTitle: {
    fontSize: '36px',
    color: '#00d4ff',
    textShadow: '0 0 20px #00d4ff',
    marginBottom: '20px',
  },
  startText: {
    fontSize: '18px',
    margin: '10px 0',
    color: '#ffffff',
  },
};

export default Game;