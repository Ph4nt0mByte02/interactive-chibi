import type { Dialogue } from '@/types/chibi';

export const romanticMessages: Dialogue[] = [
  { text: 'I love youuuuuuuu', mood: 'love' },
  { text: 'I miss youu my jaan', mood: 'shy' },
  { text: "You know what? you're too beautiful", mood: 'happy' },
  { text: 'Come here, cutie', mood: 'happy' },
  { text: 'You make my heart go boom', mood: 'love' },
  { text: 'Aww, you found me!', mood: 'surprised' },
  { text: 'Hehe, that tickles~', mood: 'shy' },
  { text: 'I am looking at youuu', mood: 'love' },
];

export const idleActions: Dialogue[] = [
  { text: '*blink*', mood: 'idle' },
  { text: '...', mood: 'idle' },
  { text: 'I was thinking about you.', mood: 'shy' },
  { text: '❤️', mood: 'love' },
  { text: 'Oh! hi hi!', mood: 'happy' },
];

export const fallRecoveryMessages: Dialogue[] = [
  { text: 'Ow ow... I am okay!', mood: 'hurt' },
  { text: 'That was a big tumble!', mood: 'dizzy' },
  { text: 'Okay okay, I am back~', mood: 'standing_up' as never },
];
