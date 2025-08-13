'use client'

import {useSession, signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import AuthButton from "@/components/AuthButton";

export default function HomePage(){
    const {data:session, status} = useSession();
    const router = useRouter();
    const [isRegister, setIsRegister] = useState(false); //false = login | true = register
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    //redirect to main page if user is already logged in
    useEffect(() => {
        if (session){
            router.push("/dashboard")
        }
    }, [session, router]);

    //loading screen
    if (status === "loading"){
        return(
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    //if user is logged in, show nothing
    if (session){
        return null;
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (isRegister){
            if (password !== confirmPassword){
                setError('Passwords do not match');
                setLoading(false);
                return;
            }
            try{
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'}, //Tell server everything is JSON
                    body: JSON.stringify({email, password})
                });
                const data = await response.json();

                if (response.ok){
                    //Registration successful
                    setIsRegister(false); //login mode
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                } else{
                    setError(data.error || 'Registration failed')
                }
            } catch (error) {
                setError('Something went wrong')
            }
        } else{
            try{
                const result = await signIn('credentials', {
                    email,
                    password,
                    redirect: false
                });

                if (result?.error){
                    setError('Invalid email or password');
                }
            } catch (error) {
                setError('Something went wrong')
            }
        }
        setLoading(false);
    }
    
    const toggleMode = () =>{
        setIsRegister(!isRegister);
        setError('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    }
    //Login Page
    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
            <div className="max-w-md w-full space-y-8 p-8">
                <div className="text-center">
                    <h1 className="text-center">
                        Health Leveling
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Level up your health journey
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        Track your Fitness, Mental Health, and many more to gain stats!
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    {/*Email Auth Form*/}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                                required
                                />
                            </div>
                            <div>
                                <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                                required
                                />
                            </div>

                            {isRegister && (
                                <div>
                                    <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                                    required
                                    />
                                </div>
                            )}

                            {error && (
                                <div className="text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                            >
                                {loading ? 'Please wait...': (isRegister ? 'Create Account' : 'Sign In')}
                            </button>
                        </form>

                        <div className="mt-4 text-center">
                            <button
                                onClick={toggleMode}
                                className="text-blue-400  hover:text-blue-300 underline text-sm "
                            >
                                {isRegister
                                    ?"Already have an account? Sign in here"
                                    :"Don't have an account? Sign up here"
                                    }
                            </button>
                        </div>
                    </div>

                    {/*Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600"></div>
                        </div> 
                        <div className="relative flex justify-center text-sm">
                            <span className="px-1 bg-gradient-to-br from-gray-900 to-black text-gray-400"> //comes on top of the line
                                or
                            </span>
                        </div>
                    </div>

                    {/*Google Auth Button*/}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                        <AuthButton variant="google">
                            Continue with Google
                        </AuthButton>
                    </div>
                    
                    <p className="text-center text-gray-500 text-sm">
                        Join along with other hunters gathering their health
                    </p>
                </div>
            </div>
        </div>
    )
}