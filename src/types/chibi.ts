export type Mood = 'idle' | 'happy' | 'love' | 'shy' | 'surprised' | 'hurt' | 'dizzy' | 'sleepy' | 'wave' | 'falling' | 'standing_up';

export type Dialogue = {
  text: string;
  mood: Exclude<Mood, 'falling' | 'standing_up'>;
};
