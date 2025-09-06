"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function UsernameSetup(){
    const {data: session} = useSession();
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isValid, setIsValid] = useState(false);

    const validateUsername = (value: string) => {
        setError('');

        if (value.length === 0){
            setIsValid(false);
            return;
        }

        if (value.length > 10){
            setError('Username must be 10 characters or less');
            setIsValid(false);
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(value)){
            setError('Username can only contain letters, numbers, and underscores');
            setIsValid(false);
            return;
        }

        setIsValid(true);
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUsername(value);
        validateUsername(value);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid || !username.trim()) return;

        setLoading(true);
        setError('');
        try{
            const response = await fetch('/api/user/username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: username.trim()})
            })

            const data = await response.json();
            if (data.success){
                router.push('/dashboard');
            } else{
                setError(data.error || 'Failed to set username');
            }
        } catch (error){
            setError('Something went wrong. Please try again');
        } finally {
            setLoading(false);
        }
    };
    if (!session){
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-black flex items-center justify-center">
                <div className="text-blue-400 text-xl">Loading...</div> 
            </div>
        )
    }
    return(
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-black text-white flex items-center justify-center">
            {/* Background elements */}
            <div className="absolute inset-0">
                <div className="holographic-spiral holographic-spiral-1"></div>
                <div className="holographic-spiral holographic-spiral-2"></div>
                <div className="holographic-spiral holographic-spiral-3"></div>
                <div className="holographic-spiral holographic-spiral-4"></div>
            </div>
            <div className="holographic-particle w-3 h-3" style={{top: '20%', left: '15%', opacity: 0.6}}></div>
            <div className="holographic-particle w-2 h-2" style={{top: '60%', left: '80%', opacity: 0.4}}></div>
            
            <div className="holographic-particle w-4 h-4" style={{top: '30%', left: '70%', opacity: 0.7}}></div>
            {/* Main content */}
            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-gray-800/60 border border-blue 500/30 rounded-lg p-8">
                    <h1 className="text-2xl font-bold text-blue-400 text-center mb-2 tracking-widest">
                        CHOOSE USERNAME
                    </h1>
                    <p className="text-gray-300 text-center mb-6 text-sm">
                        This will be your display name throughout the app
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <input type="text" value={username} onChange={handleUsernameChange} placeholder='Enter username'
                            maxLength={10} className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                                error
                                ? 'border-red-500 focus:ring-red-500'
                                : isValid
                                ? 'border-green-500 focus:ring-green-500'
                                :'border-gray-600 focus:ring-blue-500'
                            }`}
                            disabled={loading} />
                            <div className="text-right text-xs text-gray-400 mt-1">
                                {username.length}/10 characters
                            </div>
                        </div>
                        {error && (
                            <div className="text-red-400 text-sm mb-4 text-center">
                                {error}
                            </div>
                        )}
                        <button type="submit" disabled={!isValid || loading}
                        className={`w-full py-3 rounded-lg font-medium tracking-wider transition-all ${
                            !isValid || loading
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                        }`}
                    >
                            {loading ? 'SETTING USERNAME...' : 'CONTINUE'}
                        </button>
                    </form>
                </div>
            </div>
        </div>

    )
} 