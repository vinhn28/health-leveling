import {NextRequest, NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/database';

export async function POST(req: NextRequest) {
    try{
        const {email, password} = await req.json();
        if (!email || !password){
            return NextResponse.json({error: 'Missing email or password'}, {status: 400});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)){
            return NextResponse.json({error: 'Invalid email format'}, {status: 400});
        }

        if (password.length < 6){
            return NextResponse.json({error: 'Password must be at least 6 characters'}, {status: 400})
        }

        const client = await clientPromise;
        const db = client.db();

        //Check if user already exists
        const existingUser = await db.collection('users').findOne({email});
        if (existingUser){
            return NextResponse.json({error: 'User already exists!'}, {status: 409});
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = {
            email,
            password: hashedPassword,
            createdAt: new Date(),
            name:'',
            level: 1,
            xp: 0
        };

        const result = await db.collection('users').insertOne(newUser);

        return NextResponse.json({
            message: 'User registered successfully',
            userId: result.insertedId
        }, {status: 201});
    } catch (error){
        console.error('Registration error:', error);
        return NextResponse.json({error: 'Internal server error'}, {status: 500})
    }
}   