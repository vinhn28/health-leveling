export function calculateLevel(totalXP: number) {
    let level = 1;
    let xpThreshold = 100;
    
    while (totalXP >= xpThreshold) {
        level++;
        xpThreshold += 200;
    }
    
    return {
        level: level,
        currentXP: totalXP,
        xpRequired: xpThreshold
    };
}