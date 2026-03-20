# Pass the Pigs Score Keeper

A digital score keeper for the [Pass the Pigs](https://en.wikipedia.org/wiki/Pass_the_Pigs) dice game. Track points for multiple players in real-time with automatic scoring calculations.

**Live app**: https://amazonessari.github.io/pass-the-pigs-scorekeeper/

## Features

- Multi-player support with custom player names
- Configurable target score
- Automatic scoring for all pig outcomes (Sider, Razorback, Trotter, Snouter, Leaning Jowler, and doubles)
- Penalty handling (Pig Out, Makin' Bacon)
- Turn history and game log
- Leaderboard shown at the end of each round
- Undo support

## Tech stack

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Framer Motion

## Development

Requires Node.js and npm.

```sh
# Clone the repository
git clone https://github.com/amazonessari/pass-the-pigs-scorekeeper.git
cd pass-the-pigs-scorekeeper

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Deployment

Deployed automatically to GitHub Pages via GitHub Actions on every push to `main`.
