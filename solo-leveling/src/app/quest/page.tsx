"use client"

import {useSession} from "next-auth/react";
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import { QuestTemplate } from "@/lib/models/QuestTemplate";
import QuestStatContainer from "@/components/QuestStatContainerProps";
import { DAILY_STRENGTH_QUESTS } from "@/lib/models/QuestTemplate";
import Navigation from "@/components/Navigation";
import {getQuestTemplateById} from "@/lib/getQuestTemplate";

export default function QuestPanel(){
    const {data: session, status} = useSession();
    const router = useRouter();

    const [assignedQuests, setAsssignedQuests] = useState<QuestTemplate[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedQuest, setSelectedQuest] = useState<string | null>(null);
    const [completedQuests, setCompletedQuests] = useState<string[]>([]);
    const [animatingQuests, setAnimatingQuests] = useState<string[]>([]);
    const [dailyStrengthCompleted, setDailyStrengthCompleted] = useState(false);
    const [activeTab, setActiveTab] = useState<'todo' | 'completed'>('todo');

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

    //Fetch randomized assigned quests
    useEffect(() => {
        const fetchASsignedQuests = async() => {
            if (!session?.user?.id){
                return;
            }

            try{
                const response = await fetch('/api/quests/assign', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'}
                });

                const data = await response.json();
                console.log('API response:', data);
                if (data.success){
                    console.log('Setting assigned quests:', data.assignedQuests);
                    setAsssignedQuests(data.assignedQuests);
                } else {
                    console.log('User assigned quests data:', JSON.stringify(currentUser.assignedQuests, null, 2));

                    console.error('Failed to fetch assigned quests:', data.error)
                }
            } catch (error){
                console.error('Error fetching assigned quests', error)
            } finally {
                setLoading(false);
            }
        }
        fetchASsignedQuests();
    }, [session?.user?.id])

    useEffect(() => {
        const fetchUserData = async() => {
            if (!session?.user?.id) return;

            try{
                const response = await fetch('/api/user/initialize', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'}
                });
                const data = await response.json()

                if (data.success && data.userData.questsCompletedToday) {
                    setCompletedQuests(data.userData.questsCompletedToday);
                }
                setDailyStrengthCompleted(data.userData.hasCompletedDailyStrength || false);

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
        fetchUserData();
    }, [session?.user?.id]);

    const handleQuestClick = (questName: string) => {
        setSelectedQuest(questName);
    }

    const handleCompletedQuest = async () => {
        if (!selectedQuest) return;
        setAnimatingQuests(prev => [...prev, selectedQuest])
        try{
            const response = await fetch('/api/quests/complete',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    completedQuests: [selectedQuest],
                    questType:'individual'
                })
            })
            const data = await response.json();
            if (data.success){
                setCompletedQuests(data.questsCompletedToday || []);
                console.log(`Quest "${selectedQuest}" completed!`)

                //After animation, mark as completed
                setTimeout(() => {
                    setAnimatingQuests(prev => prev.filter(q => q !== selectedQuest))
                    setSelectedQuest(null);
                }, 300)

            } else{
                console.error('Quest completion failed', data.error);
                setAnimatingQuests(prev => prev.filter(q => q !== selectedQuest))
                if (data.error.includes('daily') || data.error.includes('strength')){
                    router.push('/dashboard')
                }

            }
        } catch(error){
            console.error('Error completing quest:', error)
            setAnimatingQuests(prev => prev.filter(q => q !== selectedQuest))
        }    
    }

    const handleCloseModal = () => {
        setSelectedQuest(null);
    }

    if (status === 'loading' || loading) {
        return(
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-black flex items-center justify-center">
                <div className="text-blue-400 text-xl">Loading your quests...</div>
            </div>
        )
    }

    if (!session){
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-black text-white pb-8">
            <Navigation/>
            <div className="absolute inset-0">
                <div className="holographic-spiral holographic-spiral-1"></div>
                <div className="holographic-spiral holographic-spiral-2"></div>
                <div className="holographic-spiral holographic-spiral-3"></div>
                <div className="holographic-spiral holographic-spiral-4"></div>
            </div>
            <div className="holographic-particle w-3 h-3" style={{top: '20%', left: '15%', opacity: 0.6}}></div>
            <div className="holographic-particle w-2 h-2" style={{top: '60%', left: '80%', opacity: 0.4}}></div>
            <div className="holographic-particle w-4 h-4" style={{top: '30%', left: '70%', opacity: 0.7}}></div>

            {/*Main content*/}
            <div className="relative z-10 p-6">
                <h1 className="text-blue-400 text-3xl font-bold text-center mb-8 tracking-widest text-glow-blue">
                    QUEST PANEL
                </h1>
                {/*Navigation Tabs*/}
                <div className="max-w-4xl mx-auto mb-8">
                    <div className="flex bg-gray-800/30 rounded-lg p-1 border border-gray-600/50">
                        <button 
                        onClick={() => setActiveTab('todo')} 
                        className={`flex-1 py-3 px-6 rounded-md transition-all duration-300 font-medium tracking-wider ${
                            activeTab ==='todo' 
                            ? 'bg-blue-600 text-white shadow-lg' 
                            : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                        }`}> TO-DO ({assignedQuests.filter(q => !completedQuests.includes(q.name)).length})</button>
                        <button 
                        onClick={() => setActiveTab('completed')}
                        className={`flex-1 py-3 px-6 rounded-md transition-all duration-300 font-medium tracking-wider ${
                            activeTab ==='completed'
                            ? 'bg-green-600 text-white shadow-lg'
                            : 'text-gray-300 hover:text-white hover:bg-gray-700/50'}`} >
                            COMPLETED ({completedQuests.length})</button>
                    </div>
                </div>
            </div>

            {/* Content based on active tab */}
            <div className="max-w-4xl mx-auto space-y-8">
                {activeTab === 'todo' ? (
                    assignedQuests.length === 0 ? (
                        <div className="text-center">
                            <p className="text-gray-300 text-lg">No quests assigned yet.</p>
                            <p className="text-gray-400 text-sm mt-2">Try refreshing the page.</p> 
                        </div>
                    ) : (
                    ['agility', 'vitality', 'intelligence', 'sense'].map(statName => {
                        const allquestsForstat = assignedQuests.filter(quest => 
                            quest.stat === statName
                        );
                        if (allquestsForstat.length === 0) return null;
                        return (
                            <QuestStatContainer 
                            key={statName} 
                            statName={statName} 
                            quests={allquestsForstat} 
                            completedQuests={completedQuests} 
                            animatingQuests={animatingQuests}
                            onQuestClick={handleQuestClick}/>
                        )
                    })
                )
            ) : (
                // Completed tab
                (completedQuests.length === 0 && !dailyStrengthCompleted) ? (
                    <div className="text-center">
                        <p className="text-gray-300 text-lg">No quests completed yet.</p>
                        <p className="text-gray-400 text-sm mt-2">Complete some quests to see them here!</p>
                    </div>
                ) : (
                    <>
                        {/* Daily Strength Section */}
                        {dailyStrengthCompleted && (
                            <div key="completed-strength" className="relative mb-8">
                                <div className="absolute inset-0 bg-gray-800/40 rounded-lg"/>
                                <div className="relative z-10 p-6">
                                    <h3 className="text-green-400 text-xl font-bold mb-4 text-center tracking-widest">
                                        STRENGTH - COMPLETED
                                    </h3>
                                    <div className="space-y-3">
                                        {DAILY_STRENGTH_QUESTS.map((quest, index) => (
                                            <div key={index} className="bg-gray-700/30 border border-green-500/30 rounded-lg p-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-white font-medium">{quest.name}</span>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-green-400 font-bold"> COMPLETED ✓ </span>
                                                        <span className="text-blue-300 text-sm">
                                                            +{quest.xpReward} XP | +{quest.statReward} {quest.stat.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                {quest.description && (
                                                    <div className="text-gray-400 text-sm mt-2">
                                                        {quest.description}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Other Stats */}
                        {['agility', 'vitality', 'intelligence', 'sense'].map(statName => {
                            const completedQuestsForStat = assignedQuests.filter(quest =>
                                quest.stat === statName && completedQuests.includes(quest.name)
                            );
                            if (completedQuestsForStat.length === 0) return null;
                            return (
                                <div key={`completed-${statName}`} className="relative mb-8">
                                    <div className="absolute inset-0 bg-gray-800/40 rounded-lg"/>
                                    <div className="relative z-10 p-6">
                                        <h3 className="text-green-400 text-xl font-bold mb-4 text-center tracking-widest">
                                            {statName.toUpperCase()} - COMPLETED
                                        </h3>
                                        <div className="space-y-3">
                                            {completedQuestsForStat.map((quest, index) => (
                                                <div key={index} className="bg-gray-700/30 border border-green-500/30 rounded-lg p-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-white font-medium">{quest.name}</span>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-green-400 font-bold"> COMPLETED ✓ </span>
                                                            <span className="text-blue-300 text-sm">
                                                                +{quest.xpReward} XP | +{quest.statReward} {quest.stat.toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {quest.description && (
                                                        <div className="text-gray-400 text-sm mt-2">
                                                            {quest.description}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </>
                )
                )}
            </div>
            {/*Modal overlay for quest completion*/}
            {selectedQuest && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-gray-800 border border-blue-500 rounded-lg p-8 max-w-md text-center">
                        <h3 className="text-white text-xl font-bold mb-4">
                            Complete Quest?
                        </h3>
                        <p className="text-gray-300 mb-6">
                            Mark "{selectedQuest}" as completed?
                        </p>
                        <div className="flex gap-4">
                            <button onClick={handleCompletedQuest} className="flex-1 bg-green-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                                Yes, Complete
                            </button>
                            <button onClick={handleCloseModal} className="flex-1 bg-green-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}