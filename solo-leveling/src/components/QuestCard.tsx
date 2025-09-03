import { useState } from 'react';

interface QuestCardProps{
    name: string;
    description?: string;
    target: number;
    unit?: string;
    isCompleted: boolean;
    isAnimating: boolean;
    hasTextInput?: boolean;
    textValue?: string;
    onCardClick: () => void;
    onTextChange?: (value: string) => void;
}

export default function QuestCard({
    name,
    description,
    target,
    unit,
    isCompleted,
    isAnimating,
    hasTextInput = false,
    textValue = '',
    onCardClick,
    onTextChange
}: QuestCardProps){
    
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.stopPropagation(); // Prevent card click when typing
        if (onTextChange) {
            onTextChange(e.target.value);
        }
    };

    const handleTextClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click when clicking on text area
    };

    console.log(`Quest "${name}": hasTextInput = ${hasTextInput}, textValue = "${textValue}"`); // Debug log

    return (
        <div onClick={onCardClick} className={`cursor-pointer bg-gray-800/20 border border-gray-600/50 rounded-lg p-4 hover:bg-gray-700/60 transition-all duration-300 relative z-10 ${isAnimating? 'animate-slide-out' : ''}`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{name}</span>
                <div className="flex items-center gap-4">
                    <span className="text-gray-300 font-mono">
                        [{isCompleted ? target: 0}/{target} {unit}]
                    </span>
                </div>
            </div>
            
            {description && (
                <div className="text-gray-400 text-sm mb-2">
                    {description}
                </div>
            )}

            {/* Debug: Always show if hasTextInput is true */}
            {hasTextInput && (
                <div onClick={handleTextClick} className="mt-3">
                    <textarea
                        value={textValue}
                        onChange={handleTextChange}
                        placeholder="Add your notes or details here..."
                        className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        rows={3}
                        disabled={isCompleted}
                    />
                </div>
            )}
        </div>
    );
}