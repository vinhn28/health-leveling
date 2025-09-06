'use client'

import { useSession } from "next-auth/react"
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import Navigation from "@/components/Navigation";
import { calculateLevel } from "@/lib/levelUtils";
import AuthButton from "@/components/AuthButton";
import { UserDocument } from "@/lib/models/User";

export default function ProfilePage(){
    const {data: session, status} = useSession();
    const router = useRouter();

    const [userData, setUserData] = useState<UserDocument | null>(null);
    const [loading, setLoading] = useState(true);

    //Check authentication
    useEffect(() => {
        if (status === 'loading') return;
        if (!session){
            router.push('/');
            return;
        }

        //Check if user completed daily strength quests
        const checkDailyStrength = async() => {
            try{
                const response = await fetch('/api/user/initialize', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'}
                });

                const data = await response.json();
                if (data.success && !data.userData.hasCompletedDailyStrength) {
                    router.push('/dashboard');
                    return;
                }
            } catch (error){
                console.error('Error checking daily strength', error);
                router.push('/dashboard');
            }
        }

        checkDailyStrength()
    }, [session, status, router])

    //Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            if (!session?.user?.id) return;

            try{
                const response = await fetch('/api/user/initialize', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'}
                });

                const data = await response.json();
                if (data.success){
                    setUserData(data.userData);
                } 
            } catch(error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();
    }, [session?.user?.id]);

    if (status === 'loading' || loading){
        return(
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-black flex items-center justify-center">
                <div className="text-blue-400 text-xl">Loading your profile...</div>
            </div>
        )
    }

    if (!session || !userData){
        return null;
    }

    console.log('Streak from database:', userData.streakDays);



    const levelInfo = calculateLevel(userData.totalXP);
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-black text-white pb-8">
            <Navigation />
            
            {/* Background elements - same as quest page */}
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
            <div className="relative z-10 p-6 pt-24 flex flex-col items-center">
                <h1 className="text-blue-400 text-3xl font-bold text-center mb-8 tracking-widest text-glow-blue">
                    PROFILE
                </h1>
                {/* Level and XP Section */}
                <div className="w-full max-w-2xl mb-8">
                    <div className="bg-gray-800/40 border border-blue-500/30 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            {/* Level and XP */}
                            <div className="flex-1">
                                <div className="text-center mb-4">
                                    <h2 className="text-2xl font-bold text-blue-400 mb-2">LEVEL {levelInfo.level}</h2>
                                    <div className="text-lg text-gray-300">
                                        {levelInfo.currentXP} / {levelInfo.xpRequired} XP
                                    </div>
                                </div>
                                {/* XP Progress Bar */}
                                <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                                    <div className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                                    style={{width: `${(levelInfo.currentXP / levelInfo.xpRequired) * 100}% `}}></div>
                                </div>
                                <div className="text-center text-sm text-gray-400">
                                    {levelInfo.xpRequired - levelInfo.currentXP} XP to next level
                                </div>
                            </div>
                            {/* Streak Section */}
                            <div className="flex flex-col items-center ml-8">
                                <div className="text-4xl mb-2 animate-pulse">🔥</div>
                                <div className="text-orange-400 text-2xl font-bold mb-1">
                                    {userData.streakDays || 0}
                                </div>
                                <div className="text-gray-400 text-sm text-center">
                                    Day Streak
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                {/* User Info Section */}
                <div className="w-full max-w-2xl mb-8">
                    <div className="bg-gray-800/40 border border-green-500/30 rounded-lg p-6">
                        <h3 className="text-xl font-bold text-green-400 mb-4 text-center tracking-widest">
                            USER INFO
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Name:</span>
                                <span className="text-white-font-medium">{userData.username || 'Not Provided'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Email:</span>
                                <span className="text-white-font-medium">{userData.email || 'Not Provided'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Total XP:</span>
                                <span className="text-blue-400 font-bold">{userData.totalXP || 'Not Provided'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Display Section */}
                <div className="w-full max-w-2xl mb-8">
                    <div className="bg-gray-800/40 border border-purple-500/30 rounded-lg p-6">
                        <h3 className="text-xl font-bold text-purple-400 mb-6 text-center tracking-widest">
                            STATS
                        </h3>
                        <div className="space-y-4">
                            {/* Strength */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                                    <span className="text-gray-300 font-medium">STRENGTH</span>
                                </div>
                                <span className="text-red-400 font-bold text-lg">{userData.stats.strength}</span>
                            </div>
                            {/* Agility */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                                    <span className="text-gray-300 font-medium">AGILITY</span>
                                </div>
                                <span className="text-yellow-400 font-bold text-lg">{userData.stats.agility}</span>
                            </div>

                            {/* Vitality */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                                    <span className="text-gray-300 font-medium">VITALITY</span>
                                </div>
                                <span className="text-green-400 font-bold text-lg">{userData.stats.vitality}</span>
                            </div>

                            {/* Intelligence */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 bg-cyan-500 rounded"></div>
                                    <span className="text-gray-300 font-medium">INTELLIGENCE</span>
                                </div>
                                <span className="text-cyan-400 font-bold text-lg">{userData.stats.intelligence}</span>
                            </div>

                            {/* Sense */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 bg-pink-500 rounded"></div>
                                    <span className="text-gray-300 font-medium">SENSE</span>
                                </div>
                                <span className="text-pink-400 font-bold text-lg">{userData.stats.sense}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sign Out Button */}
                <div className="mb-8">
                    <AuthButton variant='header' className="px-8 py-3 text-lg">
                        Sign Out
                    </AuthButton>
                </div>
            </div>
        </div>
    )
}