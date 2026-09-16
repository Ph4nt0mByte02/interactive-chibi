import type { ChibiInteraction, Dialogue } from '@/types/chibi';
import { pickRandom } from '@/lib/utils';

const hoverMessages: Dialogue[] = [
  { text: 'Aww, you found me!', mood: 'surprised' },
  { text: 'Hehe, that tickles~', mood: 'blush' },
  { text: 'You are staring at me again 💕', mood: 'heart_eyes' },
  { text: 'Stay close, cutie.', mood: 'love' },
];

const tapMessages: Dialogue[] = [
  { text: 'I love youuuuuuuu', mood: 'love' },
  { text: 'I miss youu my jaan', mood: 'blush' },
  { text: "You know what? you're too beautiful", mood: 'happy' },
  { text: 'Come here, cutie', mood: 'happy' },
  { text: 'You make my heart go boom', mood: 'love' },
  { text: 'I am looking at youuu', mood: 'heart_eyes' },
];

const dragMessages: Dialogue[] = [
  { text: 'Waaah~ gentle, gentle!', mood: 'surprised' },
  { text: 'Spinning... dizzy~', mood: 'dizzy' },
];

const surpriseMessages: Dialogue[] = [
  { text: 'Eeep! You startled me!', mood: 'surprised' },
  { text: 'My heart skipped a beat!', mood: 'blush' },
];

export const romanticMessages: Dialogue[] = [
  ...hoverMessages,
  ...tapMessages,
  ...surpriseMessages,
  ...dragMessages,
  { text: 'I am looking at youuu', mood: 'love' },
];

export const idleActions: Dialogue[] = [
  { text: '*blink*', mood: 'idle' },
  { text: '...', mood: 'idle' },
  { text: 'I was thinking about you.', mood: 'blush' },
  { text: '❤️', mood: 'love' },
  { text: 'Oh! hi hi!', mood: 'happy' },
  { text: 'Mmm... warm and sleepy.', mood: 'sleepy' },
];

export const fallRecoveryMessages: Dialogue[] = [
  { text: 'Ow ow... I am okay!', mood: 'hurt' },
  { text: 'That was a big tumble!', mood: 'dizzy' },
  { text: 'Okay okay, I am back~', mood: 'standing_up' },
];

const interactionDialoguePool: Record<Exclude<ChibiInteraction, 'idle' | 'recover'>, Dialogue[]> = {
  hover: hoverMessages,
  tap: tapMessages,
  drag: dragMessages,
  fall: fallRecoveryMessages,
};

export function pickInteractionDialogue(kind: Exclude<ChibiInteraction, 'idle' | 'recover'>): Dialogue {
  return pickRandom(interactionDialoguePool[kind]);
}

export function pickSurpriseDialogue() {
  return pickRandom(surpriseMessages);
}
