import QuestCard from './QuestCard';
import { QuestTemplate } from '@/lib/models/QuestTemplate';
import {useState} from 'react';

interface QuestStatContainerProps {
    statName: string;
    quests: QuestTemplate[];
    completedQuests: string[];
    animatingQuests: string[];
    onQuestClick: (questName: string) => void;
}

export default function QuestStatContainer({
    statName,
    quests,
    completedQuests,
    animatingQuests,
    onQuestClick
    }: QuestStatContainerProps){

        const [questTexts, setQuestTexts] = useState<Record<string, string>>({});

        const handleTextChange = (questName: string, value: string) => {
        setQuestTexts(prev => ({
            ...prev,
            [questName]: value
            }));
        };

        const getStatImage = (stat: string) => {
        const imageMap: Record<string, string> = {
            'agility': '/images/quests/agility.jpg',
            'vitality': '/images/quests/vitality.png',
            'intelligence': '/images/quests/intelligence.png',
            'sense': '/images/quests/sense.jpg'
        };
        return imageMap[stat.toLowerCase()] || '';
    };
    const allQuestsCompleted = quests.every(quest => completedQuests.includes(quest.name))
        return (
            <div className="relative mb-8">
                <div className="absolute inset-6 rounded-lg opacity-20" style={{
                    backgroundImage: `url(${getStatImage(statName)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
                />
                <div className="absolute inset-0 bg-gray-900/60 rounded-lg" />
                <div className="relative z-10 p-6">
                    <h3 className="text-blue-400 text-xl font-bold mb-4 text-center tracking-widest">
                        {statName.toUpperCase()}
                    </h3>

                    {/*Show completion message if all quests are finished*/}
                    {allQuestsCompleted ? (
                        <div className="text-center py-8">
                            <div className="text-green-400 text-lg font-bold mb-2 text-glow-green">
                                Quest for {statName.toUpperCase()} completed!
                            </div>
                            <div className="text-gray-300 text-sm">
                                Check back tomorrow for new quests.
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">

                        {quests.map((quest, index) => {
                            if (completedQuests.includes(quest.name) && !animatingQuests.includes(quest.name)){
                                return null;
                            }
                            return (<QuestCard key={index} name={quest.name} 
                            description={quest.description} target={quest.target}
                            unit={quest.unit} isCompleted={completedQuests.includes(quest.name)}
                            onCardClick={() => onQuestClick(quest.name)}
                            isAnimating={animatingQuests.includes(quest.name)}
                            hasTextInput={quest.hasTextInput}
                            textValue={questTexts[quest.name] || ''}
                            onTextChange={(value) => handleTextChange(quest.name, value)} 
                            />
                            )
                        })}
                    </div>
                    )}
                </div>
            </div>
        )
}
