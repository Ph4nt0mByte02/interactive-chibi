export function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
