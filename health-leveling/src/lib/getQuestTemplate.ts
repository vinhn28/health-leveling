import { AGILITY_QUESTS, VITALITY_QUESTS, INTELLIGENCE_QUESTS, SENSE_QUESTS, QuestTemplate } from './models/QuestTemplate';

export function getQuestTemplateById(id: string): QuestTemplate{
    const allQuests = [...AGILITY_QUESTS, ...VITALITY_QUESTS, ...INTELLIGENCE_QUESTS, ...SENSE_QUESTS];
    const quest = allQuests.find(q => q._id === id);
    if (!quest) throw new Error(`Quest template not found: ${id}`);
    return quest;
}