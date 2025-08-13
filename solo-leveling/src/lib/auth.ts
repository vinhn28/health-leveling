import NextAuth, {NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {MongoDBAdapter} from "@next-auth/mongodb-adapter";
import clientPromise from "./database";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

//Main config object for NextAuth
export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!, //Google Oauth Client ID
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!, //Google Oauth Client Secret
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials){ //Runs when someone tries to login
                if(!credentials?.email || !credentials?.password){ //safety measure if inputted incorrectly
                    return null;
                }
                try{
                    const client = await clientPromise;
                    const db = client.db();
                    const user = await db.collection('users').findOne({email: credentials.email}); //Look for user with this email
                    if (!user || !user.password){
                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordValid){
                        return null;
                    }

                    return{
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name || user.email,
                    };
                } catch (error){
                    console.error("Auth error:", error);
                    return null;
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET, //encrypting session data
    session: {
        strategy: "database",
    },
    pages:{
        signIn: '/'
    },
    callbacks: {
        async redirect({url, baseUrl}){ //Runs after successful login
            if (url.startsWith(baseUrl)) return url;
            return `${baseUrl}/dashboard`
        },
        //custom session object sent to the client
        async session ({session, user}) {
            if (session.user){
                (session.user as any).id = user.id; 
            }
            return session;
        },
    },
};