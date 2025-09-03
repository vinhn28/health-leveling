import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/database';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest){
    try{
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await request.json();
        const { username } = body;

        //Valid username
        if (!username || typeof username !== 'string'){
            return NextResponse.json({error: 'Username is required'}, {status: 400});
        }

        const trimmedUserName = username.trim();

        //Check username length
        if (trimmedUserName.length === 0 || trimmedUserName.length > 10){
            return NextResponse.json({ error: 'Username must be between 1-10 characters' }, { status: 400 });
        }

        //check username format (letters, numbers, underscores only )
        if (!/^[a-zA-Z0-9_]+$/.test(trimmedUserName)) {
            return NextResponse.json({ 
                error: 'Username can only contain letters, numbers, and underscores' 
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

        const existingUser = await db.collection('users').findOne({
            username: { $regex: new RegExp(`^${trimmedUserName}$`, 'i') }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
        }

        // Update user with new username
        const updateResult = await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { 
                $set: { 
                    username: trimmedUserName,
                    hasSetUsername: true 
                } 
            }
        );

        if (updateResult.modifiedCount === 0) {
            return NextResponse.json({ error: 'Failed to update username' }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            username: trimmedUserName 
        });
    } catch (error){
        console.error('Username API error', error);
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }

    //check if username already exists 
}