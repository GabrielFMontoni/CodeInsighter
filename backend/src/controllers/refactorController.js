import runRefactoring  from "../services/refactorService.js";

const staticAnalysisResults = `
- Uso de 'var' em vez de 'let'/'const'.
- Concatenação de strings ineficiente.
- Complexidade ciclomática pode ser reduzida.
`;

const legacyCode = 'Cod legado aqui';

const code_leng = "JavaScript";

async function handleRefactorRequest(req, res) {
    try {
        const result = await runRefactoring(code_leng, staticAnalysisResults, legacyCode);

        return res.json({
            codigoRefatorado: result.refactoredCode,
            dicas: result.refactoringTips,
        });
    } catch {
        return res.status(500).json({ error: "Erro ao processar a refatoração." });
    }
}

export default handleRefactorRequest;