# Health Leveling
Health Leveling turns your daily workouts into an RPG adventure ⚔️. Complete fitness quests, earn XP, build streaks, and watch your character grow stronger — just like in a game.

# ![App Screenshot](https://cdn.discordapp.com/attachments/813517489313022003/1414024792977313792/image.png?ex=68be10b5&is=68bcbf35&hm=0cc60254092523e7cdb03a0f3fd1ce5cf283c52fa93b45a4679cda677017f193&)

**[View Live App](https://health-leveling.vercel.app)**

# Features
Authentication System: Google OAuth and email/password login
Daily Strength Quests: Core fitness challenges that must be completed daily
Random Quest Assignment: Daily randomized quests across different stats
Character Progression: Level-up system with XP and stat rewards
Streak Tracking: Maintain daily completion streaks with visual feedback
Profile Dashboard: View character stats, level, XP, and progress
Responsive Design: Modern UI with holographic visual effects

# ![App Screenshot](https://cdn.discordapp.com/attachments/813517489313022003/1414110836208697405/image.png?ex=68be60d8&is=68bd0f58&hm=ba26dfbcf7a1947ed3431ce7b3b03d39caeae12dd21bd27b8b9cf5c017961c15&)

# Tech Stack

Frontend: Next.js, TypeScript, Tailwind CSS
Authentication: NextAuth.js with Google OAuth and credentials
Database: MongoDB with MongoDB Adapter
Styling: Custom CSS animations and Tailwind utilities
Icons: Lucide React

# 🚀 Getting Started

This is a full-stack Next.js application — the **frontend** and **backend** (API routes, authentication, and database integration) run together.

## Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- A [MongoDB](https://www.mongodb.com/) database (local or MongoDB Atlas)
- Google OAuth credentials (optional, only if you want Google login enabled)

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vinhn28/health-leveling.git
   cd health-leveling

2. **Install dependencies**

npm install


3. **Set up environment variables**

Create a .env.local file in the project root:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# MongoDB Connection
MONGODB_URI=your-mongodb-connection-string

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

⚠️ Important: Never commit your .env.local file or share real credentials publicly.

# Running the App

Development server
```bash
npm run dev
```

Then open http://localhost:3000
.

Production build

```bash
npm run build
npm run start
```

## Project Structure:
```md
health-leveling/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── dashboard/          # Daily strength quests
│   │   ├── quest/              # Main quest panel
│   │   ├── profile/            # User profile page
│   │   ├── username-setup/     # Initial setup
│   │   └── api/                # API routes
│   │       ├── auth/           # Authentication endpoints
│   │       │   ├── [...nextauth]/
│   │       │   │   └── routes.ts 
│   │       │   ├── register/
│   │       │   │   └── routes.ts #Register route
│   │       │   └── quests/
│   │       │       ├── assign/
│   │       │       │   └── routes.ts #assign routes
│   │       │       ├── complete/
│   │       │       │   └── routes.ts #Quest Completion route
│   │       │       └── user/
│   │       │           ├── initialize/
│   │       │           │   └── routes.ts #Initialize user stats route
│   │       │           └── username/
│   │       │               └── routes.ts #Setting up username route
│   │       ├── stats/          # User statistics and progress
│   │       │   └── route.ts
│   │       ├── quests/         # Quest management
│   │       │   ├── daily/      # Daily quest operations
│   │       │   │   └── route.ts
│   │       │   ├── complete/   # Quest completion handling
│   │       │   │   └── route.ts
│   │       │   └── assign/     # Quest assignment logic
│   │       │       └── route.ts
│   │       ├── user/           # User profile and data
│   │       │   ├── profile/    # Profile management
│   │       │   │   └── route.ts
│   │       │   ├── stats/      # Individual user statistics
│   │       │   │   └── route.ts
│   │       │   └── level/      # Level progression tracking
│   │       │       └── route.ts
│   │       └── dashboard/      # Dashboard data aggregation
│   │           └── route.ts
│   ├── components/             # Reusable components
│   │   ├── Navigation.tsx
│   │   ├── AuthButton.tsx
│   │   ├── Providers.tsx
│   │   └── QuestCard.tsx
│   │   └── QuestStatContainerProps.tsx 
│   └── lib/                    # Utilities and models
│       ├── models/             # Data models
│       ├── database.ts         # MongoDB connection
│       ├── auth.ts             # NextAuth configuration
│       └── levelUtils.ts       # XP/level calculations
├── public/                     # Static assets
└── styles/                     # Global styles
```
# Core Gameplay Loop

Daily Login: Users must complete strength training quests first
Quest Completion: Mark quests as complete to earn XP and stat points
Streak Building: Consecutive daily completions build streak multipliers
Character Growth: Stats increase and levels unlock new content
Progress Tracking: Monitor advancement through profile dashboard

# Quest System
  Daily Strength Quests (Required)
  
  Push-ups: 20 reps
  Sit-ups: 20 reps
  Plank: 60 seconds
  Squats: 50 reps
  
  Random Daily Quests
  Assigned across four stats:
  
  Agility: Running, sports activities
  Vitality: Cardio, endurance challenges
  Intelligence: Reading, learning tasks
  Sense: Meditation, mindfulness practices

# ![App Screenshot](https://cdn.discordapp.com/attachments/813517489313022003/1414110782035202068/image.png?ex=68be60cb&is=68bd0f4b&hm=66ce65ed343dd64219073ab3192a47182d28cd58260eafd7a38f78825f766c0a&)

# API Endpoints

POST /api/user/initialize - Initialize/fetch user data
POST /api/quests/assign - Get daily assigned quests
POST /api/quests/complete - Mark quests as completed
POST /api/auth/register - User registration

# License
This project is licensed under the MIT License - see the LICENSE file for details.
# Acknowledgments

Inspired by Solo Leveling manhwa/anime
Built with Next.js and modern web technologies
UI design influenced by cyberpunk and gaming aesthetics
