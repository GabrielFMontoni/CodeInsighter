import chain from "../config/gemini.config.js";

function cleanJsonResponse(text) {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

export default async function runRefactoring(language, analysis, code, context = "") {
  const vars = { language, analysis, code, context };
  try {
    const raw = await chain.invoke(vars);
    const cleaned = typeof raw === "string" ? cleanJsonResponse(raw) : raw;
    const result = typeof cleaned === "string" ? JSON.parse(cleaned) : cleaned;
    return result;
  } catch (err) {
    console.error("Erro na refatoração:", err);
    throw err;
  }
}
