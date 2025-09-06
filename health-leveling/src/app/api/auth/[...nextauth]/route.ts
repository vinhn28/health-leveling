import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);


//Export GET and POST handlers for the route to be used in app router
export {handler as GET, handler as POST};