import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal, Database, Activity, Cpu } from 'lucide-react';

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden flex flex-col font-digital selection:bg-neon-cyan selection:text-black">
      {/* Background Grid & FX */}
      <div className="absolute inset-0 bg-[#050505] pointer-events-none static-noise" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,243,255,0.05)_0%,transparent_100%)] pointer-events-none" />
      <div className="scanline" />
      
      {/* HUD Header */}
      <header className="relative z-20 border-b-4 border-neon-cyan/40 bg-black/80 px-6 py-4 flex items-center justify-between screen-tear">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black neo-bordered flex items-center justify-center">
            <Cpu className="w-8 h-8 text-neon-cyan animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-3xl font-glitch tracking-tighter text-neon-cyan drop-shadow-[2px_2px_0px_#ff00ff] glitch-text" data-text="NEON_SURVIVOR_v2.0">
              NEON_SURVIVOR_v2.0
            </h1>
            <div className="flex items-center gap-3 text-sm uppercase tracking-widest text-neon-cyan/70">
              <span className="flex items-center gap-1"><Terminal className="w-4 h-4" /> SYS: ACTIVE</span>
              <span className="flex items-center gap-1 text-neon-magenta"><Database className="w-4 h-4" /> BUFFER: 88%</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-sm opacity-50 uppercase tracking-widest text-[#00f3ff]">NETWORK_LOAD</span>
            <div className="flex gap-2 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`w-3 h-2 ${i < 3 ? 'bg-neon-cyan' : 'bg-white/10'}`} />
              ))}
            </div>
          </div>
          <div className="h-8 w-1 bg-neon-cyan/40" />
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-neon-magenta animate-pulse" />
            <span className="text-2xl text-neon-cyan tracking-widest">144_FPS</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 p-6 lg:p-12 overflow-hidden screen-tear">
        
        {/* Game Center */}
        <div className="flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-full flex items-center justify-center drop-shadow-[0_0_30px_rgba(0,243,255,0.2)]"
          >
            <SnakeGame />
          </motion.div>
        </div>

        {/* Info/Controls Sidebar */}
        <aside className="flex flex-col gap-8 justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            {/* Music Player */}
            <section className="screen-tear">
              <h2 className="text-xl mb-4 text-neon-cyan uppercase tracking-[0.3em] flex items-center gap-2">
                <span className="w-3 h-3 rounded-none bg-neon-magenta animate-ping" />
                AUDIO_SUBSYSTEM
              </h2>
              <MusicPlayer />
            </section>

            {/* Controls Guide */}
            <section className="bg-black/40 border-2 border-neon-cyan/50 p-6 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-neon-cyan/5 pointer-events-none static-noise" />
              <h3 className="text-lg mb-4 text-neon-magenta uppercase tracking-widest">INPUT_PROTOCOLS</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#00f3ff]/10 border-2 border-[#00f3ff] flex items-center justify-center text-xl text-[#00f3ff] font-bold">W</div>
                  <span className="text-sm text-[#00f3ff]/60 uppercase tracking-wider">UP</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#00f3ff]/10 border-2 border-[#00f3ff] flex items-center justify-center text-xl text-[#00f3ff] font-bold">S</div>
                  <span className="text-sm text-[#00f3ff]/60 uppercase tracking-wider">DOWN</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#00f3ff]/10 border-2 border-[#00f3ff] flex items-center justify-center text-xl text-[#00f3ff] font-bold">A</div>
                  <span className="text-sm text-[#00f3ff]/60 uppercase tracking-wider">LEFT</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#00f3ff]/10 border-2 border-[#00f3ff] flex items-center justify-center text-xl text-[#00f3ff] font-bold">D</div>
                  <span className="text-sm text-[#00f3ff]/60 uppercase tracking-wider">RIGHT</span>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t-2 border-neon-cyan/30 pt-4">
                <div className="px-4 py-1.5 bg-neon-magenta/20 border-2 border-neon-magenta text-lg text-neon-magenta uppercase">SPACE</div>
                <span className="text-sm text-neon-magenta/80 uppercase tracking-wider">BREAK_SIMULATION</span>
              </div>
            </section>

            {/* Decorative Static */}
            <div className="h-40 border-2 border-[#00f3ff]/50 bg-black/60 overflow-hidden relative select-none pointer-events-none">
               <div className="static-noise absolute inset-0" />
               <div className="absolute inset-0 flex flex-col justify-around">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-1 bg-neon-cyan/20 w-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
               </div>
               <div className="p-4 text-lg leading-tight space-y-1 text-neon-cyan glitch-text tracking-widest relative z-10" data-text="TERMINAL LOG:">
                  <p className="opacity-80">&gt; SYNCHRONIZING_NEURO_MATRICES</p>
                  <p className="opacity-80">&gt; FIREWALL_BYPASS_SUCCESSFUL</p>
                  <p className="text-neon-magenta">&gt; ENTITY_IDENTIFIED</p>
                  <p className="animate-pulse">&gt; AWAITING_DIRECTIVE_</p>
               </div>
            </div>
          </motion.div>
        </aside>
      </main>

      {/* Floating Artifacts */}
      <div className="fixed top-32 right-10 w-24 h-24 border-4 border-neon-cyan/20 rotate-45 animate-spin-slow opacity-20 pointer-events-none" />
      <div className="fixed top-40 right-2 w-8 h-8 bg-neon-magenta opacity-30 pointer-events-none screen-tear" />
      <div className="fixed bottom-20 left-10 w-48 h-48 border-4 border-neon-magenta/20 -rotate-12 animate-pulse opacity-20 pointer-events-none" />
      <div className="fixed bottom-10 left-1/3 w-full h-1 bg-neon-cyan/40 animate-pulse screen-tear opacity-50" />

      {/* CRT Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden opacity-30 mix-blend-overlay">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
      </div>

    </div>
  );
}

