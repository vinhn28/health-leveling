import NextAuth, {NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {MongoDBAdapter} from "@next-auth/mongodb-adapter";
import clientPromise from "./database";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

//Main config object for NextAuth
export const authOptions: NextAuthOptions = { //Const must have all NextAuthOptions properties
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
        strategy: "jwt",
    },
    pages:{
        signIn: '/'
    },
    callbacks: {
        async redirect({ url, baseUrl }) { //Controls where users go after signing in/out
            if (url.startsWith(baseUrl)) return url;
            return `${baseUrl}/dashboard`;
        },
        async jwt({ token, user }) { //Runs whenever JWT is created/accessed
            if (user) { 
                token.id = user.id || (user as any)._id?.toString(); //Adds user ID to jwt token
            }
            return token; //return token object that includes basic info about user + id
        },
        async session({ session, token }) { //useSession() being used
            if (session.user) {
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
};