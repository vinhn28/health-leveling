'use client'

import {useRouter, usePathname} from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Navigation(){
    const router = useRouter();
    const pathName = usePathname();
    const {data: session} = useSession();

    const handleQuestClick = () => {
        router.push('/quest')
    };

    const handleProfileClick = () => {
        router.push('/profile')
    };

    return(
        <nav className="absolute top-0 left-0 right-0 z-20 p-6">
            <div className="flex justify-between items-center">
                {/*Quest Button - Top Left */}
                <button onClick={handleQuestClick} className={`px-6 py-3 rounded-lg border transition-all duration-300 font-medium tracking-wider 
                ${pathName === '/quest'
                    ? 'bg-blue-600/80 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-gray-800/60 border-gray-600/50 text-gray-300 hover:bg-blue-600/40 hover:border-blue-400/70 hover:text-white'
                }`}>
                    QUEST PANEL
                </button>
                <button 
                    onClick={handleProfileClick}
                    className={`px-6 py-3 rounded-lg border transition-all duration-300 font-medium tracking-wider flex items-center gap-3 ${
                        pathName === '/profile' 
                        ? 'bg-green-600/80 border-green-400 text-white shadow-lg shadow-green-500/20' 
                        : 'bg-gray-800/60 border-gray-600/50 text-gray-300 hover:bg-green-600/40 hover:border-green-400/70 hover:text-white'
                    }`}
                    >PROFILE
                </button>
            </div>
        </nav>
    )
}