import { create } from 'zustand';
import type { Dialogue, Mood } from '@/types/chibi';

type ChibiState = {
  mood: Mood;
  dialogue: Dialogue | null;
  muted: boolean;
  dragged: boolean;
  fallen: boolean;
  setMood: (mood: Mood) => void;
  setDialogue: (dialogue: Dialogue | null) => void;
  setMuted: (muted: boolean) => void;
  setDragged: (dragged: boolean) => void;
  setFallen: (fallen: boolean) => void;
  reset: () => void;
};

export const useChibiStore = create<ChibiState>((set) => ({
  mood: 'idle',
  dialogue: null,
  muted: false,
  dragged: false,
  fallen: false,
  setMood: (mood) => set({ mood }),
  setDialogue: (dialogue) => set({ dialogue }),
  setMuted: (muted) => set({ muted }),
  setDragged: (dragged) => set({ dragged }),
  setFallen: (fallen) => set({ fallen }),
  reset: () => set({ mood: 'idle', dialogue: null, dragged: false, fallen: false }),
}));
