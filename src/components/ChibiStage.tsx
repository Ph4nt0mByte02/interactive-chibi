'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { fallRecoveryMessages, idleActions, pickInteractionDialogue, pickSurpriseDialogue } from '@/lib/dialogue';
import { clamp, pickRandom } from '@/lib/utils';
import { useChibiStore } from '@/store/chibiStore';
import type { ChibiInteraction, Dialogue, Mood } from '@/types/chibi';

type Position = { x: number; y: number };
type ReactKind = Exclude<ChibiInteraction, 'idle' | 'recover'> | 'surprise';

const REACTION_DIALOGUE_DURATION = 2600;
const IDLE_DIALOGUE_DURATION = 2200;
const FALL_TRIGGER_DISTANCE = 125;
const DRAG_TRIGGER_DISTANCE = 30;
const SURPRISE_TRIGGER_DISTANCE = 55;

const SOUND_BY_KIND: Record<ReactKind, string> = {
  hover: 'pop',
  tap: 'pop',
  drag: 'boing',
  fall: 'ouch',
  surprise: 'pop',
};

function useTimeoutQueue() {
  const timeoutIds = useRef<number[]>([]);

  const clearAll = useCallback(() => {
    timeoutIds.current.forEach((id) => window.clearTimeout(id));
    timeoutIds.current = [];
  }, []);

  const schedule = useCallback((callback: () => void, delay: number) => {
    const id = window.setTimeout(callback, delay);
    timeoutIds.current.push(id);
    return id;
  }, []);

  useEffect(() => clearAll, [clearAll]);

  return { clearAll, schedule };
}

function useChibiAudio(muted: boolean) {
  return useCallback(
    (kind: ReactKind) => {
      if (muted) return;
      const audio = new Audio(`/sounds/${SOUND_BY_KIND[kind]}.mp3`);
      audio.volume = kind === 'fall' ? 0.55 : 0.45;
      audio.play().catch(() => undefined);
    },
    [muted]
  );
}

function useIdleDialogue() {
  const setDialogue = useChibiStore((s) => s.setDialogue);
  const setMood = useChibiStore((s) => s.setMood);

  useEffect(() => {
    const id = window.setInterval(() => {
      const action = pickRandom(idleActions);
      setMood(action.mood);
      setDialogue(action);
      window.setTimeout(() => setDialogue(null), IDLE_DIALOGUE_DURATION);
    }, 14000);

    return () => window.clearInterval(id);
  }, [setDialogue, setMood]);
}

function useBlinkLoop() {
  useEffect(() => {
    const id = window.setInterval(() => {
      document.querySelectorAll<HTMLElement>('[data-blink]').forEach((el) => {
        el.animate(
          [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0.08)' }, { transform: 'scaleY(1)' }],
          { duration: 180, easing: 'ease-in-out' }
        );
      });
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

function ChibiFace({ mood }: { mood: Mood }) {
  const showBlush = mood === 'blush' || mood === 'love' || mood === 'heart_eyes' || mood === 'happy' || mood === 'surprised';
  const showHearts = mood === 'love' || mood === 'heart_eyes';
  const showDizzy = mood === 'hurt' || mood === 'dizzy' || mood === 'falling';
  const sleepy = mood === 'sleepy';
  const surprised = mood === 'surprised';
  const recovering = mood === 'standing_up';

  return (
    <div className="relative h-[260px] w-[220px]">
      <div className={`absolute left-1/2 top-0 h-[170px] w-[170px] -translate-x-1/2 rounded-[48%] bg-[#ffd7b0] chibi-shadow ${recovering ? 'animate-gentle-bob' : ''}`} />
      <div className="absolute left-1/2 top-[16px] h-[140px] w-[150px] -translate-x-1/2 rounded-[48%] bg-[#3a2a24]" />
      <div className="absolute left-1/2 top-[45px] h-[88px] w-[142px] -translate-x-1/2 rounded-[48%] bg-[#ffd7b0]" />
      <div className={`absolute left-[27px] top-[66px] h-[18px] w-[30px] rounded-full bg-[#3a2a24] ${recovering ? '-rotate-6' : ''}`} />
      <div className={`absolute right-[27px] top-[66px] h-[18px] w-[30px] rounded-full bg-[#3a2a24] ${recovering ? 'rotate-6' : ''}`} />

      {showHearts ? (
        <>
          <div className="absolute left-[46px] top-[62px] text-xl text-pink-500 animate-heart-pop">♥</div>
          <div className="absolute right-[46px] top-[62px] text-xl text-pink-500 animate-heart-pop">♥</div>
        </>
      ) : (
        <>
          <div className={`absolute left-[40px] top-[60px] h-[30px] w-[36px] rounded-full bg-white ${sleepy ? 'scale-y-[0.28]' : surprised ? 'scale-[1.12]' : ''}`} data-blink />
          <div className={`absolute right-[40px] top-[60px] h-[30px] w-[36px] rounded-full bg-white ${sleepy ? 'scale-y-[0.28]' : surprised ? 'scale-[1.12]' : ''}`} data-blink />
          <div className={`absolute left-[48px] top-[70px] rounded-full bg-[#6b463f] ${sleepy ? 'h-[8px] w-[12px]' : surprised ? 'h-[14px] w-[14px]' : 'h-[12px] w-[12px]'}`} />
          <div className={`absolute right-[48px] top-[70px] rounded-full bg-[#6b463f] ${sleepy ? 'h-[8px] w-[12px]' : surprised ? 'h-[14px] w-[14px]' : 'h-[12px] w-[12px]'}`} />
        </>
      )}

      <div
        className={`absolute left-1/2 top-[122px] -translate-x-1/2 ${
          surprised
            ? 'h-[16px] w-[16px] rounded-full border-4 border-[#7b4f43]'
            : sleepy
              ? 'h-[8px] w-[28px] rounded-b-[999px] border-b-2 border-[#7b4f43]'
              : 'h-[12px] w-[34px] rounded-b-[999px] border-b-4 border-[#7b4f43]'
        } ${showHearts ? 'scale-125 border-pink-400' : ''}`}
      />

      {showBlush && (
        <>
          <div className="absolute left-[34px] top-[102px] h-[20px] w-[32px] rounded-full bg-rose-300/65 blur-[1px]" />
          <div className="absolute right-[34px] top-[102px] h-[20px] w-[32px] rounded-full bg-rose-300/65 blur-[1px]" />
        </>
      )}

      {showDizzy && <div className="absolute left-1/2 top-[10px] -translate-x-1/2 text-3xl animate-spin-slow">💫</div>}

      {surprised && (
        <>
          <div className="absolute -left-3 top-[78px] text-xl text-amber-400 animate-surprise-pop">✦</div>
          <div className="absolute -right-3 top-[76px] text-xl text-amber-400 animate-surprise-pop">✦</div>
        </>
      )}

      <div className={`absolute left-1/2 top-[150px] h-[24px] w-[48px] -translate-x-1/2 rounded-full bg-[#ff9da8]/70 blur-[1px] ${mood === 'idle' ? 'opacity-30' : 'opacity-100'}`} />
    </div>
  );
}

function ChibiBody({ mood }: { mood: Mood }) {
  return (
    <div className={`relative mx-auto h-[440px] w-[300px] select-none ${mood === 'standing_up' ? 'animate-gentle-bob' : ''}`}>
      <motion.div
        className="absolute left-1/2 top-0 -translate-x-1/2"
        animate={{ y: [0, -4, 0], rotate: [0, -1, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChibiFace mood={mood} />
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

function DialogueBubble({ dialogue }: { dialogue: Dialogue | null }) {
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

function useChibiInteractions() {
  const mood = useChibiStore((s) => s.mood);
  const setMood = useChibiStore((s) => s.setMood);
  const setDialogue = useChibiStore((s) => s.setDialogue);
  const setDragged = useChibiStore((s) => s.setDragged);
  const setFallen = useChibiStore((s) => s.setFallen);
  const muted = useChibiStore((s) => s.muted);
  const { clearAll, schedule } = useTimeoutQueue();
  const playSound = useChibiAudio(muted);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const surprisedDuringDrag = useRef(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  const clearDialogueSoon = useCallback(() => {
    schedule(() => setDialogue(null), REACTION_DIALOGUE_DURATION);
  }, [schedule, setDialogue]);

  const react = useCallback(
    (kind: Exclude<ReactKind, 'surprise'>) => {
      const action = pickInteractionDialogue(kind);
      setMood(action.mood);
      setDialogue(action);
      playSound(kind);
      clearDialogueSoon();
    },
    [clearDialogueSoon, playSound, setDialogue, setMood]
  );

  const reactSurprise = useCallback(() => {
    const action = pickSurpriseDialogue();
    setMood(action.mood);
    setDialogue(action);
    playSound('surprise');
    clearDialogueSoon();
  }, [clearDialogueSoon, playSound, setDialogue, setMood]);

  const runFallSequence = useCallback(() => {
    clearAll();
    setFallen(true);
    setMood('falling');
    setDialogue(fallRecoveryMessages[0]);
    playSound('fall');

    schedule(() => {
      setMood('hurt');
      setDialogue(fallRecoveryMessages[1]);
    }, 460);
    schedule(() => setMood('dizzy'), 900);
    schedule(() => {
      setMood('standing_up');
      setDialogue(fallRecoveryMessages[2]);
    }, 1550);
    schedule(() => {
      setFallen(false);
      setMood('happy');
    }, 2380);
    schedule(() => {
      setMood('idle');
      setDialogue(null);
    }, 3300);
  }, [clearAll, playSound, schedule, setDialogue, setFallen, setMood]);

  const resetInteraction = useCallback(() => {
    dragStart.current = null;
    surprisedDuringDrag.current = false;
    setIsInteracting(false);
    setDragged(false);
    setPosition({ x: 0, y: 0 });
  }, [setDragged]);

  const onPointerEnter = useCallback(() => react('hover'), [react]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      dragStart.current = { x: e.clientX, y: e.clientY };
      surprisedDuringDrag.current = false;
      setIsInteracting(true);
      setDragged(false);
    },
    [setDragged]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isInteracting || !dragStart.current) return;
      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;
      const distance = Math.hypot(deltaX, deltaY);

      setDragged(distance > 6);
      setPosition({ x: clamp(deltaX * 0.08, -24, 24), y: clamp(deltaY * 0.08, -18, 28) });

      if (distance > SURPRISE_TRIGGER_DISTANCE && !surprisedDuringDrag.current) {
        surprisedDuringDrag.current = true;
        reactSurprise();
      }
    },
    [isInteracting, reactSurprise, setDragged]
  );

  const onPointerUp = useCallback(() => {
    if (!dragStart.current) return;
    const distance = Math.hypot(position.x / 0.08, position.y / 0.08);

    if (distance >= FALL_TRIGGER_DISTANCE) {
      runFallSequence();
    } else if (distance >= DRAG_TRIGGER_DISTANCE) {
      react('drag');
    } else {
      react('tap');
    }

    resetInteraction();
  }, [position.x, position.y, react, resetInteraction, runFallSequence]);

  const onPointerCancel = useCallback(() => resetInteraction(), [resetInteraction]);

  return {
    mood,
    position,
    onPointerEnter,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  };
}

function MoodEffects({ mood }: { mood: Mood }) {
  if (mood === 'love' || mood === 'heart_eyes') {
    return <div className="pointer-events-none absolute -right-4 top-10 text-3xl text-pink-400 animate-heart-pop">✨</div>;
  }

  if (mood === 'happy' || mood === 'standing_up') {
    return <div className="pointer-events-none absolute -left-6 top-20 text-3xl text-amber-400 animate-surprise-pop">✨</div>;
  }

  if (mood === 'surprised') {
    return (
      <>
        <div className="pointer-events-none absolute -left-5 top-16 text-3xl text-amber-400 animate-surprise-pop">!</div>
        <div className="pointer-events-none absolute -right-5 top-16 text-3xl text-amber-400 animate-surprise-pop">!</div>
      </>
    );
  }

  return null;
}

export function ChibiStage() {
  useIdleDialogue();
  useBlinkLoop();
  const dialogue = useChibiStore((s) => s.dialogue);
  const fallen = useChibiStore((s) => s.fallen);
  const { mood, position, onPointerEnter, onPointerDown, onPointerMove, onPointerUp, onPointerCancel } = useChibiInteractions();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      <DialogueBubble dialogue={dialogue} />
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
          className="relative h-[560px] w-full max-w-[520px] touch-none cursor-pointer rounded-[40px] border border-white/60 bg-white/30 p-4 shadow-soft transition will-change-transform"
          onPointerEnter={onPointerEnter}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerCancel}
          onPointerCancel={onPointerCancel}
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              x: position.x,
              y: position.y,
              rotate: fallen ? -72 : position.x * 0.85,
              scale: fallen ? 0.96 : 1,
            }}
            transition={fallen ? { duration: 0.28, ease: 'easeOut' } : { type: 'spring', stiffness: 280, damping: 22 }}
          >
            <div className="relative">
              <ChibiBody mood={mood} />
              <MoodEffects mood={mood} />
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
