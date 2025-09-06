import { QuestTemplate } from "./QuestTemplate";

//default stats interface 
export interface UserGamingStats {
    level: number;
    totalXP: number;
    stats: {
        strength: number;
        agility: number;
        vitality: number;
        intelligence: number;
        sense: number;
    };
    streakDays: number;
    lastQuestDate: Date | null;
    questsCompletedToday: string[];
    hasCompletedDailyStrength: boolean;
    assignedQuests?: {
        date: string;
        quests: QuestTemplate[];
    }
}

//complete user document
export interface UserDocument {
    _id: string;
    email: string;
    name?: string;
    username?: string;
    hasSetUsername?: boolean;
    image?: string;
    level?: number;
    totalXP: number;
    stats: {
        strength: number;
        agility: number;
        vitality: number;
        intelligence: number;
        sense: number;
    };
    streakDays: number;
    lastQuestDate: Date | null;
    questsCompletedToday: string[];
    hasCompletedDailyStrength: boolean;
    assignedQuests?: {
        date: string;
        quests: QuestTemplate[];
    }
}

//Default stats
export const DEFAULT_USER_STATS: UserGamingStats = {
    level: 1,
    totalXP: 0,
    stats: {
        strength: 10,
        agility: 10,
        vitality: 10,
        intelligence: 10,
        sense: 10,
    },
    streakDays: 0,
    lastQuestDate: null,
    questsCompletedToday: [],
    hasCompletedDailyStrength: false,
    assignedQuests: undefined
}