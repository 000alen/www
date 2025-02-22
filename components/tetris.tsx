"use client"

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTheme } from 'next-themes';

type TetrominoType = {
  [key: string]: { shape: number[][], color: string };
};

interface TetrisProps {
  onClose: () => void;
}

const LIGHT_TETROMINOS: TetrominoType = {
  I: { shape: [[1, 1, 1, 1]], color: '#303030' },
  O: { shape: [[1, 1], [1, 1]], color: '#404040' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#505050' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#606060' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#707070' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#808080' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#909090' },
};

const DARK_TETROMINOS: TetrominoType = {
  I: { shape: [[1, 1, 1, 1]], color: '#909090' },
  O: { shape: [[1, 1], [1, 1]], color: '#808080' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#707070' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#606060' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#505050' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#404040' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#303030' },
};

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0, isMobile: false });

  useEffect(() => {
    function updateSize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= 768
      });
    }

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}

function useKeySequence(targetSequence: string) {
  const [, setSequence] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only track alphabetic keys
      if (!/^[a-zA-Z]$/.test(e.key)) {
        setSequence('');
        return;
      }

      setSequence(prev => {
        const newSequence = (prev + e.key.toLowerCase()).slice(-targetSequence.length);
        if (newSequence === targetSequence) {
          setIsActive(true);
        }
        return newSequence;
      });
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [targetSequence]);

  return { isActive, setIsActive };
}

export function Tetris({ onClose }: TetrisProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const GRID_WIDTH = 10;
  const GRID_HEIGHT = 20;
  const [blockSize, setBlockSize] = useState(20);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { theme } = useTheme();
  const { width, height, isMobile } = useWindowSize();

  const TETROMINOS = useMemo(() =>
    theme === 'dark' ? DARK_TETROMINOS : LIGHT_TETROMINOS,
    [theme]
  );

  const createGrid = useCallback(() =>
    Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0)),
    [GRID_HEIGHT, GRID_WIDTH]
  );

  const randomTetromino = useCallback((tetrominos: TetrominoType) => {
    const keys = Object.keys(tetrominos);
    const randKey = keys[Math.floor(Math.random() * keys.length)];
    return tetrominos[randKey];
  }, []);

  const [grid, setGrid] = useState<(number | string)[][]>(createGrid);
  const [activeTetromino, setActiveTetromino] = useState(() => {
    const rand = randomTetromino(TETROMINOS);
    return {
      shape: rand.shape,
      color: rand.color,
      x: Math.floor(GRID_WIDTH / 2) - Math.floor(rand.shape[0].length / 2),
      y: 0
    };
  });

  const rotate = useCallback((matrix: number[][]) => {
    return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
  }, []);

  const checkCollision = useCallback((x: number, y: number, shape: number[][]) => {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[0].length; col++) {
        if (shape[row][col]) {
          if (
            y + row >= GRID_HEIGHT ||
            x + col < 0 ||
            x + col >= GRID_WIDTH ||
            grid[y + row][x + col] !== 0
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, [grid, GRID_HEIGHT, GRID_WIDTH]);

  const clearRows = useCallback((grid: (number | string)[][]) => {
    let rowsCleared = 0;
    const newGrid = grid.filter((row) => {
      const isRowFull = row.every(cell => typeof cell === 'string');
      if (isRowFull) rowsCleared++;
      return !isRowFull;
    });

    while (newGrid.length < GRID_HEIGHT) {
      newGrid.unshift(Array(GRID_WIDTH).fill(0));
    }

    if (rowsCleared > 0) {
      setScore(prev => prev + (rowsCleared * 100));
    }

    return newGrid;
  }, [GRID_HEIGHT, GRID_WIDTH]);

  const placePiece = useCallback((
    currentGrid: (number | string)[][],
    piece: { shape: number[][], color: string, x: number, y: number }
  ) => {
    const newGrid = currentGrid.map(row => [...row]);
    piece.shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell && piece.y + dy >= 0 && piece.y + dy < GRID_HEIGHT && piece.x + dx >= 0 && piece.x + dx < GRID_WIDTH) {
          newGrid[piece.y + dy][piece.x + dx] = piece.color;
        }
      });
    });
    return clearRows(newGrid);
  }, [GRID_HEIGHT, GRID_WIDTH, clearRows]);

  const handleMove = useCallback((direction: 'left' | 'right' | 'down' | 'rotate') => {
    setActiveTetromino(piece => {
      const newPiece = { ...piece };

      switch (direction) {
        case 'left':
          if (!checkCollision(piece.x - 1, piece.y, piece.shape)) {
            newPiece.x -= 1;
          }
          break;
        case 'right':
          if (!checkCollision(piece.x + 1, piece.y, piece.shape)) {
            newPiece.x += 1;
          }
          break;
        case 'down':
          if (!checkCollision(piece.x, piece.y + 1, piece.shape)) {
            newPiece.y += 1;
          }
          break;
        case 'rotate': {
          const rotatedShape = rotate(piece.shape);
          if (!checkCollision(piece.x, piece.y, rotatedShape)) {
            newPiece.shape = rotatedShape;
          }
          break;
        }
      }

      return newPiece;
    });
  }, [checkCollision, rotate]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
          handleMove('left');
          break;
        case 'ArrowRight':
          handleMove('right');
          break;
        case 'ArrowDown':
          handleMove('down');
          break;
        case 'ArrowUp':
          handleMove('rotate');
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, handleMove, onClose]);

  // Game loop
  useInterval(() => {
    if (gameOver) return;

    setActiveTetromino(piece => {
      if (checkCollision(piece.x, piece.y + 1, piece.shape)) {
        const newGrid = placePiece(grid, piece);
        setGrid(newGrid);

        const newTetromino = randomTetromino(TETROMINOS);
        const newPiece = {
          shape: newTetromino.shape,
          color: newTetromino.color,
          x: Math.floor(GRID_WIDTH / 2) - Math.floor(newTetromino.shape[0].length / 2),
          y: 0
        };

        if (checkCollision(newPiece.x, newPiece.y, newPiece.shape)) {
          setGameOver(true);
          return piece;
        }

        return newPiece;
      }
      return { ...piece, y: piece.y + 1 };
    });
  }, gameOver ? null : 500);

  // Update block size based on window dimensions
  useEffect(() => {
    const widthBasedSize = Math.floor(width / GRID_WIDTH);
    const heightBasedSize = Math.floor(height / GRID_HEIGHT);
    setBlockSize(Math.min(widthBasedSize, heightBasedSize));
  }, [width, height, GRID_WIDTH, GRID_HEIGHT]);

  // Handle canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
          const cell = grid[y][x];
          if (typeof cell === 'string') {
            ctx.fillStyle = cell;
            ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
          }
        }
      }

      // Draw active piece
      if (!gameOver) {
        activeTetromino.shape.forEach((row: number[], dy: number) => {
          row.forEach((cell: number, dx: number) => {
            if (cell) {
              const px = (activeTetromino.x + dx) * blockSize;
              const py = (activeTetromino.y + dy) * blockSize;
              ctx.fillStyle = activeTetromino.color;
              ctx.fillRect(px, py, blockSize, blockSize);
            }
          });
        });
      }
    };

    render();

    // Handle game over reset
    if (gameOver) {
      const timeoutId = setTimeout(() => {
        setGrid(createGrid());
        setScore(0);
        setGameOver(false);
        const newTetromino = randomTetromino(TETROMINOS);
        setActiveTetromino({
          shape: newTetromino.shape,
          color: newTetromino.color,
          x: Math.floor(GRID_WIDTH / 2) - Math.floor(newTetromino.shape[0].length / 2),
          y: 0
        });
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [grid, activeTetromino, score, gameOver, blockSize, GRID_HEIGHT, GRID_WIDTH, createGrid, randomTetromino, TETROMINOS]);

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      height: '100vh',
    }}>
      <canvas
        ref={canvasRef}
        width={GRID_WIDTH * blockSize}
        height={GRID_HEIGHT * blockSize}
        style={{
          pointerEvents: 'none',
        }}
      />

      {isMobile && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            pointerEvents: 'auto',
            zIndex: 10000,
          }}
        >
          <button
            onClick={() => handleMove('rotate')}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: theme === 'dark' ? '#404040' : '#e0e0e0',
              color: theme === 'dark' ? '#ffffff' : '#000000',
              fontSize: '24px',
              cursor: 'pointer',
              opacity: 0.8,
              touchAction: 'manipulation',
            }}
          >
            ↻
          </button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => handleMove('left')}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: theme === 'dark' ? '#404040' : '#e0e0e0',
                color: theme === 'dark' ? '#ffffff' : '#000000',
                fontSize: '24px',
                cursor: 'pointer',
                opacity: 0.8,
                touchAction: 'manipulation',
              }}
            >
              ←
            </button>
            <button
              onClick={() => handleMove('down')}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: theme === 'dark' ? '#404040' : '#e0e0e0',
                color: theme === 'dark' ? '#ffffff' : '#000000',
                fontSize: '24px',
                cursor: 'pointer',
                opacity: 0.8,
                touchAction: 'manipulation',
              }}
            >
              ↓
            </button>
            <button
              onClick={() => handleMove('right')}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: theme === 'dark' ? '#404040' : '#e0e0e0',
                color: theme === 'dark' ? '#ffffff' : '#000000',
                fontSize: '24px',
                cursor: 'pointer',
                opacity: 0.8,
                touchAction: 'manipulation',
              }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function WrappedTetris() {
  const [showTetris, setShowTetris] = useState(true);

  if (!showTetris) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none"
    }}>
      <Tetris onClose={() => setShowTetris(false)} />
    </div>
  )
}

export function TetrisEasterEgg() {
  const { isActive, setIsActive } = useKeySequence('tetris');

  if (!isActive) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none"
    }}>
      <Tetris onClose={() => setIsActive(false)} />
    </div>
  );
}
