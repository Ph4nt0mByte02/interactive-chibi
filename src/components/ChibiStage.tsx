'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { idleActions, romanticMessages } from '@/lib/dialogue';
import { pickRandom } from '@/lib/utils';
import { useChibiStore } from '@/store/chibiStore';

function useIdleDialogue() {
  const setDialogue = useChibiStore((s) => s.setDialogue);
  const setMood = useChibiStore((s) => s.setMood);

  useEffect(() => {
    const id = window.setInterval(() => {
      const action = pickRandom(idleActions);
      setMood(action.mood as any);
      setDialogue(action);
      window.setTimeout(() => setDialogue(null), 2200);
    }, 14000);

    return () => window.clearInterval(id);
  }, [setDialogue, setMood]);
}

function useBlinkLoop() {
  useEffect(() => {
    const id = window.setInterval(() => {
      const el = document.querySelector('[data-blink]');
      if (!el) return;
      el.animate(
        [
          { transform: 'scaleY(1)' },
          { transform: 'scaleY(0.08)' },
          { transform: 'scaleY(1)' },
        ],
        { duration: 180, easing: 'ease-in-out' }
      );
    }, 4300 + Math.random() * 2500);
    return () => window.clearInterval(id);
  }, []);
}

function SoundToggle() {
  const muted = useChibiStore((s) => s.muted);
  const setMuted = useChibiStore((s) => s.setMuted);
  return (
    <button
      className="rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm shadow-sm backdrop-blur transition hover:bg-white"
      onClick={() => setMuted(!muted)}
    >
      {muted ? 'Sound off' : 'Sound on'}
    </button>
  );
}

function ControlBar() {
  const reset = useChibiStore((s) => s.reset);
  return (
    <div className="flex gap-3">
      <SoundToggle />
      <button className="rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm shadow-sm backdrop-blur transition hover:bg-white" onClick={reset}>
        Reset
      </button>
    </div>
  );
}

function ChibiFace() {
  const mood = useChibiStore((s) => s.mood);
  return (
    <div className="relative h-[260px] w-[220px]">
      <div className="absolute left-1/2 top-0 h-[170px] w-[170px] -translate-x-1/2 rounded-[48%] bg-[#ffd7b0] chibi-shadow" />
      <div className="absolute left-1/2 top-[16px] h-[140px] w-[150px] -translate-x-1/2 rounded-[48%] bg-[#3a2a24]" />
      <div className="absolute left-1/2 top-[45px] h-[88px] w-[142px] -translate-x-1/2 rounded-[48%] bg-[#ffd7b0]" />
      <div className="absolute left-[27px] top-[66px] h-[18px] w-[30px] rounded-full bg-[#3a2a24]" />
      <div className="absolute right-[27px] top-[66px] h-[18px] w-[30px] rounded-full bg-[#3a2a24]" />
      <div className={`absolute left-[40px] top-[60px] h-[30px] w-[36px] rounded-full bg-white ${mood === 'sleepy' ? 'scale-y-30' : ''}`} data-blink />
      <div className={`absolute right-[40px] top-[60px] h-[30px] w-[36px] rounded-full bg-white ${mood === 'sleepy' ? 'scale-y-30' : ''}`} data-blink />
      <div className="absolute left-[48px] top-[70px] h-[12px] w-[12px] rounded-full bg-[#6b463f]" />
      <div className="absolute right-[48px] top-[70px] h-[12px] w-[12px] rounded-full bg-[#6b463f]" />
      <div className={`absolute left-1/2 top-[122px] h-[12px] w-[34px] -translate-x-1/2 rounded-b-[999px] border-b-4 border-[#7b4f43] ${mood === 'love' ? 'scale-125 border-pink-400' : ''}`} />
      {(mood === 'love' || mood === 'shy') && (
        <>
          <div className="absolute left-[26px] top-[96px] text-2xl text-pink-400">♥</div>
          <div className="absolute right-[26px] top-[96px] text-2xl text-pink-400">♥</div>
        </>
      )}
      {(mood === 'hurt' || mood === 'dizzy') && <div className="absolute left-1/2 top-[10px] -translate-x-1/2 text-3xl">💫</div>}
      <div className={`absolute left-1/2 top-[150px] h-[24px] w-[48px] -translate-x-1/2 rounded-full bg-[#ff9da8]/70 blur-[1px] ${mood === 'idle' ? 'opacity-30' : 'opacity-100'}`} />
    </div>
  );
}

function ChibiBody() {
  return (
    <div className="relative mx-auto h-[440px] w-[300px] select-none">
      <motion.div
        className="absolute left-1/2 top-0 -translate-x-1/2"
        animate={{ y: [0, -4, 0], rotate: [0, -1, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChibiFace />
      </motion.div>
      <div className="absolute left-1/2 top-[198px] h-[150px] w-[120px] -translate-x-1/2 rounded-[34px] bg-white shadow-[0_10px_24px_rgba(44,31,27,0.12)]" />
      <div className="absolute left-1/2 top-[184px] h-[24px] w-[126px] -translate-x-1/2 rounded-t-[999px] bg-white" />
      <div className="absolute left-[58px] top-[242px] h-[110px] w-[28px] rounded-full bg-white rotate-[12deg]" />
      <div className="absolute right-[58px] top-[242px] h-[110px] w-[28px] rounded-full bg-white -rotate-[12deg]" />
      <div className="absolute left-[76px] top-[300px] h-[125px] w-[30px] rounded-full bg-[#29221f]" />
      <div className="absolute right-[76px] top-[300px] h-[125px] w-[30px] rounded-full bg-[#29221f]" />
      <div className="absolute left-[58px] top-[406px] h-[26px] w-[62px] rounded-[12px] bg-white rotate-[-6deg]" />
      <div className="absolute right-[58px] top-[406px] h-[26px] w-[62px] rounded-[12px] bg-white rotate-[6deg]" />
      <div className="absolute left-[92px] top-[292px] h-[52px] w-[36px] rounded-full bg-[#ffd7b0]" />
      <div className="absolute right-[92px] top-[292px] h-[52px] w-[36px] rounded-full bg-[#ffd7b0]" />
    </div>
  );
}

function DialogueBubble() {
  const dialogue = useChibiStore((s) => s.dialogue);
  if (!dialogue) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      className="absolute left-1/2 top-4 z-20 max-w-[320px] -translate-x-1/2 rounded-[28px] border border-white/70 bg-white/80 px-5 py-3 text-center text-[15px] font-medium text-ink shadow-soft backdrop-blur"
    >
      {dialogue.text}
    </motion.div>
  );
}

export function ChibiStage() {
  useIdleDialogue();
  useBlinkLoop();
  const setDialogue = useChibiStore((s) => s.setDialogue);
  const setMood = useChibiStore((s) => s.setMood);
  const setDragged = useChibiStore((s) => s.setDragged);
  const setFallen = useChibiStore((s) => s.setFallen);
  const muted = useChibiStore((s) => s.muted);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const onReact = (kind: 'hover' | 'click' | 'drag' | 'fall') => {
    const action = pickRandom(kind === 'hover' ? romanticMessages.slice(2, 8) : romanticMessages);
    setMood(action.mood as any);
    setDialogue(action);
    if (!muted) {
      const audio = new Audio(`/sounds/${kind === 'fall' ? 'ouch' : kind === 'drag' ? 'boing' : 'pop'}.mp3`);
      audio.volume = 0.5;
      audio.play().catch(() => undefined);
    }
    window.setTimeout(() => setDialogue(null), 2400);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      <DialogueBubble />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.65),transparent_60%)]" />
      <section className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-8 rounded-[40px] border border-white/60 bg-white/35 p-6 shadow-soft backdrop-blur-xl md:p-10">
        <header className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Interactive Chibi</h1>
          <p className="mt-3 max-w-2xl text-sm text-ink/70 md:text-base">
            Hover, tap, drag, and interact with the chibi to trigger affectionate reactions, idle motion, and playful surprises.
          </p>
        </header>

        <div className="flex items-center gap-3">
          <ControlBar />
        </div>

        <div
          className="relative h-[560px] w-full max-w-[520px] cursor-pointer rounded-[40px] border border-white/60 bg-white/30 p-4 shadow-soft transition will-change-transform"
          onPointerEnter={() => onReact('hover')}
          onPointerDown={(e) => {
            dragStart.current = { x: e.clientX, y: e.clientY };
            setIsInteracting(true);
            setDragged(true);
          }}
          onPointerMove={(e) => {
            if (!isInteracting) return;
            setPosition({ x: (e.clientX - (dragStart.current?.x ?? e.clientX)) * 0.02, y: (e.clientY - (dragStart.current?.y ?? e.clientY)) * 0.02 });
          }}
          onPointerUp={() => {
            const distance = Math.hypot(position.x, position.y);
            if (distance > 7) {
              setFallen(true);
              setMood('hurt');
              onReact('fall');
              window.setTimeout(() => setMood('standing_up'), 900);
              window.setTimeout(() => setFallen(false), 1200);
            } else {
              onReact('click');
            }
            setIsInteracting(false);
            setDragged(false);
            setPosition({ x: 0, y: 0 });
          }}
          onClick={() => onReact('click')}
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ x: position.x, y: position.y, rotate: position.x * 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            <div className="relative">
              {useChibiStore.getState().dialogue && <div />}
              <ChibiBody />
              {useChibiStore.getState().mood === 'love' && (
                <div className="pointer-events-none absolute -right-4 top-10 text-3xl text-pink-400">✨</div>
              )}
              {useChibiStore.getState().mood === 'happy' && (
                <div className="pointer-events-none absolute -left-6 top-20 text-3xl text-amber-400">✨</div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
