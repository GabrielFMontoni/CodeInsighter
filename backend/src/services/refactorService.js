import chain from "../config/gemini.config.js";

function cleanJsonResponse(text) {
    return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

async function runRefactoring(language, analysis, code) {

    try {

        const rawResult = await chain.invoke({ language, analysis, code });
        const cleaned = typeof rawResult === "string" ? cleanJsonResponse(rawResult) : rawResult;
        const result = typeof cleaned === "string" ? JSON.parse(cleaned) : cleaned;
        return result;

    } catch (error) {

        console.error("Erro na refatoração:", error);

        throw error;
    }
}


export default runRefactoring;