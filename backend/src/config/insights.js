// insights.js

function calculateEfficiency(originalCode, refactoredCode) {
    const originalLines = originalCode.split('\n').filter(line => line.trim() !== '').length;
    const refactoredLines = refactoredCode.split('\n').filter(line => line.trim() !== '').length;
    
    if (originalLines === 0) return "Não aplicável";

    const reduction = ((originalLines - refactoredLines) / originalLines) * 100;
    return `${reduction.toFixed(2)}% de redução de linhas`;
}

function calculateComplexity(refactoringTips) {
    if (refactoringTips.length === 0) return "Baixa";
    if (refactoringTips.length <= 3) return "Média";
    return "Alta";
}

export function generateRefactoringInsights(result, startTime, originalCode) {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    const efficiency = calculateEfficiency(originalCode, result.refactoredCode);
    const complexity = calculateComplexity(result.refactoringTips);

    return {
        duration: `${duration.toFixed(2)} segundos`,
        efficiency: efficiency,
        originalComplexity: complexity,
        refactoringSummary: `A refatoração resultou em uma ${efficiency} e o código original tinha uma complexidade ${complexity}.`
    };
}