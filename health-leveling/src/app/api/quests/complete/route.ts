import {NextRequest, NextResponse} from 'next/server';
import {getServerSession} from 'next-auth';
import clientPromise from '@/lib/database';
import {authOptions} from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { DAILY_STRENGTH_QUESTS, AGILITY_QUESTS, VITALITY_QUESTS, INTELLIGENCE_QUESTS, SENSE_QUESTS } from '@/lib/models/QuestTemplate';

export async function POST(request: NextRequest){
    try{
        const session = await getServerSession(authOptions);
        if (!session?.user?.id){
            return NextResponse.json({error: 'Unauthorized'}, {status: 401});
        }

        const userId = session.user.id;

        const body = await request.json();
        const {completedQuests, questType} = body

        const client = await clientPromise;
        const db = client.db();

        const currentUser = await db.collection('users').findOne({_id: new ObjectId(userId)});

        if (!currentUser){
            return NextResponse.json({error: 'User not found'}, {status: 404});
        }

        let newTotalXP = currentUser.totalXP || 0;
        let newStats = {
            strength: currentUser.stats?.strength || 10,
            agility: currentUser.stats?.agility || 10,
            vitality: currentUser.stats?.vitality || 10,
            intelligence: currentUser.stats?.intelligence || 10,
            sense: currentUser.stats?.sense || 10,
        }

        function calculateLevel(totalXP: number){
            let level = 1;
            let xpThreshold = 100;
            while (totalXP >= xpThreshold){
                level++;
                xpThreshold += 200;
            }
            return{
                level: level,
                currentXP: totalXP,
                xpRequired: xpThreshold
            };
        }

        let newStreakDays = currentUser.streakDays || 1;
        const today = new Date();
        const todayDateString = today.toDateString();

        if (questType === 'daily_strength'){
            if (!Array.isArray(completedQuests) || completedQuests.length !== 4){
            return NextResponse.json({error: 'Must complete all 4 daily strength quests'}, {status: 400});
        }
            const requiredQuests = DAILY_STRENGTH_QUESTS.map(q => q.name); //gets the name and put it in an array
            const hasAllQuests = requiredQuests.every(questName => 
                completedQuests.includes(questName)
            )
            if (!hasAllQuests || completedQuests.length !== 4){
                return NextResponse.json({error: 'Must complete all 4 daily strength quests'});
            }

            let totalXP = 0;
            let totalStrengthReward = 0;

            DAILY_STRENGTH_QUESTS.forEach(quest => {
                totalXP += quest.xpReward;
                totalStrengthReward += quest.statReward;
            })

            newTotalXP += totalXP;
            newStats.strength += totalStrengthReward;

            //Streak system
            if (currentUser.lastQuestDate){
                const lastQuestDate = new Date(currentUser.lastQuestDate);
                const lastQuestDateString = lastQuestDate.toDateString();

                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayDateString = yesterday.toDateString();

                //if most recent quest date was done and the date was yesterday
                if (lastQuestDateString === yesterdayDateString){
                    newStreakDays = (currentUser.streakDays || 0) + 1;
                } else if (lastQuestDateString === todayDateString){ //if most recent quest date was done today
                    return NextResponse.json({
                        error: 'Daily Quest already completed today'
                    }, {status: 400})
                } else{
                    newStreakDays = 1;
                }
            }

        } else if (questType === 'individual'){
            if (!Array.isArray(completedQuests) || completedQuests.length !== 1){
            return NextResponse.json({error: 'Individual quest requires exactly 1 '}, {status: 400});
        }
            const questName = completedQuests[0];

            //check if quest is already completed today
            const currentCompletedQuests = currentUser.questsCompletedToday || [];
            if (currentCompletedQuests.includes(questName)){
                return NextResponse.json({error: 'Quest already completed today'}, {status: 400});
            }
            
            const allOtherQuests = [...AGILITY_QUESTS, ...VITALITY_QUESTS, ...INTELLIGENCE_QUESTS, ...SENSE_QUESTS];
            completedQuests.forEach(questName => { //loops through each completed quest array
                const quest = allOtherQuests.find(q => q.name === questName);
                if (quest) {
                    newTotalXP += quest.xpReward;
                    newStats[quest.stat] += quest.statReward;
                }
            });       
        }
        const levelInfo = calculateLevel(newTotalXP);

        const updateFields: any = {
            totalXP: newTotalXP,
            level: levelInfo.level,
            'stats.strength': newStats.strength, 
            'stats.agility': newStats.agility,
            'stats.vitality': newStats.vitality,
            'stats.intelligence': newStats.intelligence,
            'stats.sense': newStats.sense,
            lastQuestDate: today,
            questsCompletedToday: questType === 'individual' ? [...(currentUser.questsCompletedToday || []), completedQuests[0]] : completedQuests,
            hasCompletedDailyStrength: questType === 'daily_strength' ? true: currentUser.hasCompletedDailyStrength
        };

        if (questType === 'daily_strength'){
            updateFields.streakDays = newStreakDays;
        }

        const updateResult = await db.collection('users').updateOne({_id: new ObjectId(userId)},
        {
            $set: updateFields
        })

        if (updateResult.modifiedCount === 0){
            return NextResponse.json({error: 'Failed to update user'}, {status: 500});
        }

        return NextResponse.json({
            success: true,
            levelInfo: levelInfo,
            newStats: newStats,
            streakDays: newStreakDays,
            questsCompletedToday: questType === 'individual' ? 
            [...(currentUser.questsCompletedToday || []), completedQuests[0]] : 
            completedQuests  
        })

    } catch (error){
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}