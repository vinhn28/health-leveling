import { ObjectId } from 'mongodb';
import clientPromise from './database';
import { DEFAULT_USER_STATS, UserDocument } from './models/User';

export async function checkIfUserHasGamingStats(userId: string): Promise<boolean> {
    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection('users').findOne({_id: new ObjectId(userId)})

    return user?.level !== undefined;
}

//Function to initialize gaming stats for new users
export async function initializeUserGamingStats(userId: string): Promise<void>{
    const client = await clientPromise;
    const db = client.db();

    await db.collection('users').updateOne(
        {_id: new ObjectId(userId)},
        { $set: DEFAULT_USER_STATS}
    )
}

//Function to get user with all their data
export async function getUserWithGamingStats(userId: string): Promise<UserDocument| null>{
    const client = await clientPromise;
    const db = client.db();

    return await db.collection('users').findOne({_id: new ObjectId(userId)}) as UserDocument | null;
}