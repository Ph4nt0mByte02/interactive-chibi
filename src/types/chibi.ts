export type Mood =
  | 'idle'
  | 'happy'
  | 'love'
  | 'heart_eyes'
  | 'blush'
  | 'shy'
  | 'surprised'
  | 'hurt'
  | 'dizzy'
  | 'sleepy'
  | 'wave'
  | 'falling'
  | 'standing_up';

export type Dialogue = {
  text: string;
  mood: Exclude<Mood, 'falling'>;
};

export type ChibiInteraction = 'idle' | 'hover' | 'tap' | 'drag' | 'fall' | 'recover';
