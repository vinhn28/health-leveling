import {NextRequest, NextResponse} from 'next/server';
import {getServerSession} from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/database';
import {ObjectId} from 'mongodb';
import{  AGILITY_QUESTS,
    VITALITY_QUESTS,
    INTELLIGENCE_QUESTS,
    SENSE_QUESTS,
    QuestTemplate
} from '@/lib/models/QuestTemplate';
import {getQuestTemplateById} from '@/lib/getQuestTemplate';


function getRandomQuests(questArray: QuestTemplate[], count: number = 2): QuestTemplate[]{
    if (!questArray || questArray.length === 0){
        return [];
    }

    const shuffled = [...questArray];
    //randomizing the array
    for (let i = shuffled.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
}



export async function POST(request: NextRequest){
    try{
        const session = await getServerSession(authOptions);
        if (!session?.user?.id){
            return NextResponse.json({error: 'Unauthorized'}, {status: 401});
        }

        const userId = session.user.id;
        const client = await clientPromise;
        const db = client.db();

        //Check if user has assigned quests for today
        const today = new Date();
        const todayDateString = today.toDateString();

        const currentUser = await db.collection('users').findOne({_id: new ObjectId(userId)});

        if (!currentUser){
            return NextResponse.json({error: 'User not found'}, {status:404})
        }

        //Check if user already has assigned quests for today
        if (currentUser.assignedQuests?.date === todayDateString){
            try {
                // Check if the stored quests are the old format (objects) or new format (IDs)
                const storedQuests = currentUser.assignedQuests.quests;
                
                // If first quest is a string, it's quest IDs - new format
                if (storedQuests.length > 0 && typeof storedQuests[0] === 'string') {
                    console.log('Found quest IDs, mapping to templates:', storedQuests);
                    const mergedQuests = storedQuests.map((qid: string) => getQuestTemplateById(qid));
                    return NextResponse.json({
                        success: true,
                        message: 'Returning existing assigned quests',
                        assignedQuests: mergedQuests
                    });
                } else {
                    // Old format - full objects stored, clear and create new ones
                    console.log('Found old format quest objects, clearing and creating new quests');
                    // Fall through to create new quests
                }
            } catch (err) {
                console.error('Error processing existing quests:', err);
                console.log('Clearing invalid quest data and creating new quests');
                // Fall through to create new quests
            }
        }

        //Create new quests
        const newAssignedQuests = [];

        const agilityQuests = getRandomQuests(AGILITY_QUESTS, 2);
        const vitalityQuests = getRandomQuests(VITALITY_QUESTS, 2);
        const intelligenceQuests = getRandomQuests(INTELLIGENCE_QUESTS, 2);
        const senseQuests = getRandomQuests(SENSE_QUESTS, 2);

        newAssignedQuests.push(...agilityQuests);
        newAssignedQuests.push(...vitalityQuests);
        newAssignedQuests.push(...intelligenceQuests);
        newAssignedQuests.push(...senseQuests);

        const questIds = newAssignedQuests.map(q => q._id!);

        console.log('Creating new quest assignment with IDs:', questIds);

        const updateResult = await db.collection('users').updateOne(
            {_id: new ObjectId(userId)},
            {
                $set: {
                    assignedQuests: {
                        date: todayDateString,
                        quests: questIds  // Store only IDs
                    }
                }
            }
        )

        if (updateResult.modifiedCount === 0){
            return NextResponse.json({error: 'Failed to assign quests'}, {status: 500});
        }
        
        console.log('Returning new assigned quests:', newAssignedQuests);
        return NextResponse.json({
            success: true,
            message: 'New quests assigned successfully',
            assignedQuests: newAssignedQuests
        })

    } catch (error){
        console.error('Error in assign API:', error);
        return NextResponse.json({
            error: 'Internal server error'
        }, {status: 500}
    ); 
    }
}