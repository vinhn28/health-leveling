'use client'

import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

import { UserDocument } from '@/lib/models/User';
import { DAILY_STRENGTH_QUESTS } from '@/lib/models/QuestTemplate';
import {AlertCircle, X} from 'lucide-react';

export default function DashBoard(){
    const {data: session, status} = useSession();
    const router = useRouter();
    const userId = session?.user?.id;

    const [userStats, setUserStats] = useState<UserDocument | null>(null);
    const [loading, setLoading] = useState(true);
    const [completedQuests, setCompletedQuests] = useState<string[]>([]);
    const [showSuccessScreen, setShowSuccessScreen] = useState(false);
    const [newStreakDay, setNewStreakDay] = useState(0);

    useEffect(() => {
        const initializeUser = async () =>{
            if (!userId) return;
            try {
                setLoading(true);
                
                const response = await fetch('/api/user/initialize', {
                    method: 'POST', //POST endpoint
                    headers: {
                        'Content-Type': 'application/json', //sending json
                    }
                })

                if (!response.ok){
                    throw new Error(`API call failed: ${response.status}`);
                }

                const data = await response.json();
                console.log("API Response:", data);

                if (data.success){
                  if (!data.userData.hasSetUsername){
                    router.push('/username-setup');
                    return;
                  }

                  if (data.userData.hasCompletedDailyStrength){
                    router.push('/quest');
                    return;
                  }

                  setUserStats(data.userData);
                } else{
                    console.error("API returned success: false")
                }

            } catch (error){
                console.error("Error calling API:", error)
            } finally {
                setLoading(false);
            }
        }

        initializeUser();
    }, [userId, router]);

    const handleQuestComplete = async (questName: string) => {
      // figure out new completed quests
      const newCompleted = completedQuests.includes(questName)
      ? completedQuests.filter(name => name !== questName)
      : [...completedQuests, questName];

      // update local state immediately
      setCompletedQuests(newCompleted);

      // if all 4 are done call the API
      if (newCompleted.length === 4) {
        try {
          const response = await fetch('/api/quests/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              completedQuests: newCompleted,
              questType: 'daily_strength',
            }),
            cache: 'no-store',
          });

          const data = await response.json();

          if (data.success) {
            // ✅ use streak from server
            setNewStreakDay(data.streakDays);
            setShowSuccessScreen(true);
            console.log("All quests completed!");
          } else {
            console.error("Quest completion failed:", data.error);
          }
          } catch (error) {
            console.error("Failed to complete quest:", error);
          }
        }
      };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
                <div className="text-blue-400 text-xl">Checking login...</div>
            </div>
        );
    }
    if (!session) {
        router.push('/');
        return null;
    }

    if (!userStats){
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
                <div className="text-blue-400 text-xl">Loading your stats...</div>
            </div>
        )
    }
    return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-black text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="holographics-spiral holographic-spiral-1"></div>
        <div className="holographics-spiral holographic-spiral-2"></div>
        <div className="holographics-spiral holographic-spiral-3"></div>
        <div className="holographics-spiral holographic-spiral-4"></div>
      </div>
      
      <div className="holographic-particle w-3 h-3" style={{top: '20%', left: '15%', opacity: 0.6}}></div>
      <div className="holographic-particle w-2 h-2" style={{top: '60%', left: '80%', opacity: 0.4}}></div>
      <div className="holographic-particle w-4 h-4" style={{top: '30%', left: '70%', opacity: 0.7}}></div>
      <div className="holographic-particle w-1 h-1" style={{top: '80%', left: '20%', opacity: 0.3}}></div>
      <div className="holographic-particle w-3 h-3" style={{top: '10%', left: '90%', opacity: 0.5}}></div>
      <div className="holographic-particle w-2 h-2" style={{top: '70%', left: '40%', opacity: 0.6}}></div>
      <div className="holographic-particle w-5 h-5" style={{top: '40%', left: '10%', opacity: 0.4}}></div>
      <div className="holographic-particle w-2 h-2" style={{top: '90%', left: '60%', opacity: 0.8}}></div>

      <div className="relative z-10 flex items-start justify-center h-screen p-4">
        <div className="bg-gray-800/95 border border-gray-600/50 rounded-lg p-8 w-full max-w-2xl min-h-[92vh] flex flex-col shadow-2xl shadow-blue-500/20 -mt-15" style={{backgroundColor: 'rgba(17,24,39,0.75'}}>
          
          {/* Header */}
          <div className="flex items-center justify-center relative mb-24">
            <div className="absolute left-6">
              <AlertCircle className="w-8 h-8 text-blue-400" strokeWidth={2} />
            </div>
            <h1 className="text-blue-400 text-2xl font-bold tracking-widest text-glow-blue">
              QUEST INFO
            </h1>
          </div>

          {/* Quest Title */}
          <div className="text-center mb-20">
            <h2 className="text-white text-lg font-semibold leading-relaxed text-glow-white">
              DAILY QUEST - STRENGTH TRAINING HAS ARRIVED
            </h2>
          </div>

          {/* Goals Section  */}
          <div className="mb-20 flex-1">
            <h3 className="text-green-400 text-center text-xl font-bold mb-12 tracking-wider text-glow-green">
              GOAL
            </h3>
            <div className="flex flex-col items-center space-y-6">
              {DAILY_STRENGTH_QUESTS.map((quest, index) => (
                <div key={index} className="flex items-center justify-between w-80">
                  <span className="text-white text-lg font-medium text-glow-white">
                    {quest.name}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-300 text-base font-mono">
                      [{completedQuests.includes(quest.name) ? quest.target: 0}/{quest.target} {quest.unit}]
                    </span>
                    <input 
                      type="checkbox" 
                      onChange={() => handleQuestComplete(quest.name)}
                      checked={completedQuests.includes(quest.name)}
                      className="w-5 h-5 bg-transparent border-2 border-gray-400 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning Section */}
          <div className="text-center mt-auto">
            <p className="text-red-500 font-bold mb-6 text-lg tracking-wide text-glow-red">
              CAUTION
            </p>
            <p className="text-white text-sm leading-relaxed font-medium text-glow-white">
              - IF THE DAILY QUEST<br/>
              REMAINS INCOMPLETE, PENALTIES<br/>
              WILL BE GIVEN ACCORDINGLY.
            </p>
          </div>
        </div>
      </div>
      {showSuccessScreen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gray-800 border border-green-500 rounded-lg p-8 max-w-md text-center relative animate-slideUp">

            {/*Close button */}
            <button 
              onClick={() => router.push('/quest')}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
            >
              <X className="w-6 h-6" />
            </button>

            {/*Animated Fire Streak */}
            <div className="mb-6">
              <div className="text-6xl mb-2 animate-bounce">🔥</div>
              <div className="text-orange-400 text-3xl font-bold mb-2">
                {newStreakDay}
              </div>
            </div>
              
            {/*Quest completed */}
            <h2 className="text-green-400 text-2xl font-bold mb-4 animate-pulse">
              QUEST COMPLETED!
            </h2>
            
            <p className="text-white text-lg ">
              Streak Unlocked: Day {newStreakDay}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}