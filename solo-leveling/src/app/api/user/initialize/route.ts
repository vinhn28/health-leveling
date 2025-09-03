import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkIfUserHasGamingStats, initializeUserGamingStats, getUserWithGamingStats } from '@/lib/userHelpers';
import clientPromise from '@/lib/database';
import {ObjectId} from 'mongodb';

export async function POST(request: NextRequest) {
    try {
        // Check if user is authenticated
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const userId = session.user.id;

        // Check if user has gaming stats
        const hasStats = await checkIfUserHasGamingStats(userId);

        // Initialize stats if needed
        if (!hasStats) {
            await initializeUserGamingStats(userId);
        }

        // Get user data
        const userData = await getUserWithGamingStats(userId);
        const today = new Date();
        const todayDateString = today.toDateString();

        if (userData?.lastQuestDate) {
            const lastQuestDate = new Date(userData?.lastQuestDate);
            const lastQuestDateString = lastQuestDate.toDateString();
            
            // If last quest was on a different day, reset
            if (lastQuestDateString !== todayDateString) {
                const client = await clientPromise;
                const db = client.db();
                
                await db.collection('users').updateOne(
                    {_id: new ObjectId(userId)},
                    {
                        $set: {
                            questsCompletedToday: [],
                            hasCompletedDailyStrength: false
                        }
                    }
                );
                // Update the userData object to reflect the reset
                userData.questsCompletedToday = [];
                userData.hasCompletedDailyStrength = false;
            }
        }
        return NextResponse.json({ 
            success: true, 
            userData,
            wasInitialized: !hasStats 
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}