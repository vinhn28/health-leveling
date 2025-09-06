# Health Leveling
Health Leveling turns your daily workouts into an RPG adventure ⚔️. Complete fitness quests, earn XP, build streaks, and watch your character grow stronger — just like in a game.

# ![App Screenshot](https://cdn.discordapp.com/attachments/813517489313022003/1414024792977313792/image.png?ex=68be10b5&is=68bcbf35&hm=0cc60254092523e7cdb03a0f3fd1ce5cf283c52fa93b45a4679cda677017f193&)

# Features
Authentication System: Google OAuth and email/password login
Daily Strength Quests: Core fitness challenges that must be completed daily
Random Quest Assignment: Daily randomized quests across different stats
Character Progression: Level-up system with XP and stat rewards
Streak Tracking: Maintain daily completion streaks with visual feedback
Profile Dashboard: View character stats, level, XP, and progress
Responsive Design: Modern UI with holographic visual effects

# Tech Stack

Frontend: Next.js 14, TypeScript, Tailwind CSS
Authentication: NextAuth.js with Google OAuth and credentials
Database: MongoDB with MongoDB Adapter
Styling: Custom CSS animations and Tailwind utilities
Icons: Lucide React

# Getting Started
Prerequisites

Node.js 18+
MongoDB database
Google OAuth credentials (optional)


Installation

Clone the repository
bashgit clone https://github.com/vinhn28/health-leveling.git
cd health-leveling 

Install dependencies
bashnpm install

Environment Setup
Create a .env.local file in the root directory:
env# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# MongoDB Connection
MONGODB_URI=your-mongodb-connection-string

# Google OAuth Credentials (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
⚠️ Important: Never commit your .env.local file or share real credentials publicly.
Run the development server
bashnpm run dev

Open your browser
Navigate to http://localhost:3000
```md

## Project Structure:
health-leveling/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── dashboard/          # Daily strength quests
│   │   ├── quest/              # Main quest panel
│   │   ├── profile/            # User profile page
│   │   ├── username-setup/     # Initial setup
│   │   └── api/                # API routes
│   ├── components/             # Reusable components
│   │   ├── Navigation.tsx
│   │   ├── AuthButton.tsx
│   │   └── QuestCard.tsx
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
