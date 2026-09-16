# Interactive Chibi

A polished interactive chibi web experience built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and Zustand.

## Features
- Idle animation with blink, sway, and breathing motion
- Hover/touch reactions
- Click/tap reactions
- Drag interaction
- Enhanced fall and recovery behavior with staged comeback animation
- Random romantic/friendly dialogue bubbles
- Expanded visual moods (blush, heart-eyes, sleepy, surprised, dizzy/hurt, standing-up)
- Sound toggle and reset control
- Mobile-friendly, deployable UI

## Getting started

```bash
npm install
npm run dev
```

## Deploy

This app is ready to deploy on Vercel or any Node-compatible hosting platform.

## Notes

The current character is implemented as a layered CSS chibi so the project can ship quickly. The architecture is intentionally structured so you can later replace the character with higher-fidelity layered art, Live2D, or another advanced rig without rewriting the interaction engine.
