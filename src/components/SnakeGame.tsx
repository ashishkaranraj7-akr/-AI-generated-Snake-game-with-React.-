import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw, Trophy, Skull } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150;

type Point = { x: number, y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const update = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check collision with food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      switch (key) {
        case 'arrowup':
        case 'w': 
          if (direction.y === 0) setDirection({ x: 0, y: -1 }); 
          break;
        case 'arrowdown':
        case 's': 
          if (direction.y === 0) setDirection({ x: 0, y: 1 }); 
          break;
        case 'arrowleft':
        case 'a': 
          if (direction.x === 0) setDirection({ x: -1, y: 0 }); 
          break;
        case 'arrowright':
        case 'd': 
          if (direction.x === 0) setDirection({ x: 1, y: 0 }); 
          break;
        case ' ': 
          setIsPaused(p => !p); 
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const blockSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#0a0a0b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * blockSize, 0);
      ctx.lineTo(i * blockSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * blockSize);
      ctx.lineTo(canvas.width, i * blockSize);
      ctx.stroke();
    }

    // Draw food
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.fillStyle = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * blockSize + blockSize / 2,
      food.y * blockSize + blockSize / 2,
      blockSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw snake
    ctx.shadowColor = '#00f3ff';
    snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? '#00f3ff' : 'rgba(0, 243, 255, 0.6)';
      ctx.fillRect(
        segment.x * blockSize + 1,
        segment.y * blockSize + 1,
        blockSize - 2,
        blockSize - 2
      );
      
      if (i === 0) {
        // Eyes
        ctx.fillStyle = '#000';
        const eyeSize = 2;
        ctx.fillRect(segment.x * blockSize + 4, segment.y * blockSize + 4, eyeSize, eyeSize);
        ctx.fillRect(segment.x * blockSize + blockSize - 6, segment.y * blockSize + 4, eyeSize, eyeSize);
      }
    });
    ctx.shadowBlur = 0;
  }, [food, snake]);

  const gameLoop = useCallback((time: number) => {
    if (time - lastUpdateRef.current > (BASE_SPEED - Math.min(score / 5, 100))) {
      update();
      lastUpdateRef.current = time;
    }
    draw();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [update, draw, score]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameLoop]);

  return (
    <div className="flex flex-col items-center gap-6 w-full h-full justify-center relative">
      <div className="flex justify-between w-full max-w-[400px] mb-2 px-2">
        <div className="flex flex-col">
          <span className="text-sm tracking-widest opacity-80 uppercase text-neon-cyan drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]">BIOMASS / SCORE</span>
          <span className="text-6xl font-digital glitch-text" data-text={score.toString().padStart(4, '0')}>
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm tracking-widest opacity-80 uppercase text-neon-magenta drop-shadow-[0_0_5px_rgba(255,0,255,0.8)]">MAXIMUM YIELD</span>
          <span className="text-6xl font-digital text-neon-magenta glitch-text" data-text={highScore.toString().padStart(4, '0')}>
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div className="relative neo-bordered p-1 bg-black group overflow-hidden">
        <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none static-noise" />
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="max-w-full h-auto aspect-square border-2 border-dashed border-neon-cyan/20"
          onClick={() => isPaused && setIsPaused(false)}
        />

        <AnimatePresence>
          {isPaused && !isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer shadow-[inset_0_0_50px_rgba(0,243,255,0.2)] screen-tear"
              onClick={() => setIsPaused(false)}
            >
              <div className="absolute inset-0 static-noise pointer-events-none" />
              <h2 className="text-5xl font-glitch glitch-text tracking-widest mb-6 text-neon-cyan" data-text="SYSTEM_PAUSED">
                SYSTEM_PAUSED
              </h2>
              <p className="text-xl opacity-80 animate-pulse text-white bg-black px-4 py-2 border-2 border-white/20 uppercase tracking-[0.2em] relative z-10">
                &gt; AWAITING_INPUT... (SPACE / CLICK)
              </p>
            </motion.div>
          )}

          {isGameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center border-4 border-red-500 shadow-[inset_0_0_100px_rgba(255,0,0,0.4)] screen-tear"
            >
              <div className="absolute inset-0 static-noise pointer-events-none mix-blend-screen opacity-50 bg-[radial-gradient(ellipse_at_center,rgba(255,0,0,0.2)_0%,transparent_100%)]" />
              <Skull className="w-20 h-20 text-red-500 mb-6 drop-shadow-[0_0_20px_red] animate-pulse relative z-10" />
              <h2 className="text-6xl font-glitch glitch-text mb-4 text-red-500 relative z-10" data-text="CRITICAL_FAILURE">
                CRITICAL_FAILURE
              </h2>
              <div className="flex flex-col gap-2 mb-8 opacity-90 relative z-10 bg-black/50 p-4 border-2 border-red-500/50">
                <p className="text-lg uppercase text-red-400">TOTAL_BIOMASS_CONSUMED: {score}</p>
                <p className="text-lg uppercase text-red-600 animate-pulse">SYSTEM_STABILITY: 0%</p>
              </div>
              <button 
                onClick={resetGame}
                className="neo-bordered-magenta px-8 py-4 bg-magenta-500/10 hover:bg-magenta-500/30 hover:shadow-[0_0_30px_rgba(255,0,255,0.8)] transition-all flex items-center gap-3 group relative z-10"
              >
                <RefreshCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500 text-neon-cyan" />
                <span className="text-xl font-bold tracking-widest text-[#fff] group-hover:text-neon-cyan transition-colors">INIT_REBOOT_SEQ</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
