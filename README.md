# MeorFitnessPal

A food logging and nutrition tracking app for monitoring daily calorie and macro intake.

## Tech Stack

- **Framework**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, HeroUI, shadcn/ui
- **Database**: MongoDB
- **Charts**: Recharts

## Features

- Log meals with calories and macros (protein, carbs, fats)
- Track daily nutrition progress against goals
- Set macro goals with preset ratios (balanced, high-protein, performance)
- View historical data by date navigation
- Visualize nutrition trends with charts

## Setup

```bash
npm install
```

Create a `.env.local` file with your MongoDB connection string:

```
MONGODB_URI=your_mongodb_connection_string
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start tracking your nutrition.
