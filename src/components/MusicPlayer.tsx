import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "NEON DREAMS",
    artist: "CYBER_GEN_01",
    url: "https://cdn.pixabay.com/audio/2022/03/10/audio_c3702a0342.mp3", // Cyberpunk type beat
    color: "var(--color-neon-cyan)"
  },
  {
    id: 2,
    title: "GLITCH IN THE SHELL",
    artist: "AI_VOID",
    url: "https://cdn.pixabay.com/audio/2023/10/25/audio_2e0220c81c.mp3", // Dark techno
    color: "var(--color-neon-magenta)"
  },
  {
    id: 3,
    title: "SYNTH WAVE 2099",
    artist: "ROBOT_SOUL",
    url: "https://cdn.pixabay.com/audio/2022/01/21/audio_31742c5144.mp3", // Retrowave
    color: "var(--color-neon-yellow)"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const onEnded = () => {
    nextTrack();
  };

  return (
    <div className="border-4 border-neon-cyan/50 bg-black p-6 w-full max-w-md relative overflow-hidden group shadow-[0_0_20px_rgba(0,243,255,0.2)]">
      <div className="absolute inset-0 pointer-events-none static-noise mix-blend-screen opacity-20 bg-neon-cyan" />
      
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      />

      <div className="flex items-center gap-4 relative z-10">
        <motion.div 
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 flex items-center justify-center bg-black"
          style={{ borderColor: currentTrack.color }}
        >
          <Music className="w-8 h-8" style={{ color: currentTrack.color }} />
        </motion.div>

        <div className="flex-1 overflow-hidden">
          <h3 
            className="text-3xl truncate glitch-text text-white drop-shadow-[2px_2px_0_rgba(255,0,255,1)]" 
            data-text={currentTrack.title}
          >
            {currentTrack.title}
          </h3>
          <p className="text-lg opacity-60 tracking-widest uppercase text-neon-cyan">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="mt-6 relative h-2 bg-black border border-white/20 overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          style={{ backgroundColor: currentTrack.color }}
        />
      </div>

      <div className="mt-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={prevTrack}
            className="p-2 hover:text-cyan-400 transition-colors text-white"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 flex items-center justify-center bg-neon-cyan text-black hover:bg-neon-magenta hover:text-white transition-colors border-2 border-black"
          >
            {isPlaying ? <Pause className="fill-current w-6 h-6" /> : <Play className="fill-current w-6 h-6 translate-x-0.5" />}
          </button>

          <button 
            onClick={nextTrack}
            className="p-2 hover:text-cyan-400 transition-colors text-white"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-2 opacity-80 text-neon-cyan">
          <Volume2 className="w-5 h-5" />
          <div className="w-16 h-2 bg-black border border-neon-cyan/40">
            <div className="w-3/4 h-full bg-neon-cyan" />
          </div>
        </div>
      </div>

      {/* Background Visualizer Bars */}
      <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-around px-4 gap-1 opacity-20 pointer-events-none mix-blend-screen mix-blend-additive">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-full"
            style={{ backgroundColor: currentTrack.color }}
            animate={{ 
              height: isPlaying ? [Math.random() * 80, Math.random() * 80, Math.random() * 80] : 2 
            }}
            transition={{ 
              duration: 0.2, 
              repeat: Infinity, 
              repeatType: "mirror",
              delay: i * 0.05 
            }}
          />
        ))}
      </div>
    </div>
  );
}
