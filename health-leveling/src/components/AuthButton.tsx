"use client";

import { signIn, signOut, useSession } from "next-auth/react";

type AuthButtonProps = {
    variant?: 'google'| 'header'; //Two UI styles for buttons
    children?: React.ReactNode //Anything react can render 
    className?: string
}

export default function AuthButton({
    variant = 'google',
    children,
    className=''
}: AuthButtonProps){
    const {data: session, status} = useSession()

    //Header variant - Sign in/Sign out
    if (variant === 'header'){
        if (status === 'loading'){
            return <div className="px-4 py-2 text-sm"> Loading...</div>
        }
        if (session){
            //User is logged in -> show sign out
            return(
                <button onClick={() => signOut()} 
                className={`px-4 py-2 text-sm text-red-400 hover:bg-red-700 rounded-md font-medium transition-colors${className}`}
                >
                    Sign Out
                </button>
            )
        } else{
            //User is logged out -> show sign in
            return (
                <button onClick={() => signIn()}
                className={`px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800 ${className}`}
                >
                    Sign In
                </button>
            )
        }
    }

    //Google oauth
    const handleGoogleSignIn = async() => {
        await signIn('google', {callbackUrl: '/dashboard'}) //after signing in go to dashboard
    }
    return(
        <button onClick={handleGoogleSignIn}
        className={`w-full flex items-center justify-center px-4 py-3 bg-blue-600
         hover:bg-blue-700 text-white rounded-lg font-semibold ${className}`}>
        <svg className="w-5 h-5 mr-3 fill-white" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <title>Google</title>
            <path d=
            "M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
        </svg>
        {children || 'Continue with Google'}
    </button>
    )
}