import refactoringChain from "./gemini.config.js";
import readline from "readline";
import fs from "fs/promises";
import path from "path";

// Mapeamento de extensões de arquivo para linguagens de destino
const languageMap = {
  ".cbl": "python",
  ".cob": "python",
  ".java": "kotlin",
  ".js": "typescript",
  ".ts": "javascript",
  ".cs": "fsharp",
  ".vb": "csharp",
  ".py": "rust",
  ".go": "rust",
  ".cpp": "rust",
  ".c": "rust",
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log("Olá! Eu sou sua IA de refatoração de código.");
  console.log("Por favor, forneça o caminho do arquivo e a análise da refatoração.");
  console.log("---");

  try {
    // 1. Coleta os dados de entrada
    const filePath = await askQuestion("Qual o caminho do arquivo legado? ");
    const fileExtension = path.extname(filePath).toLowerCase();

    // Determina a linguagem de destino
    const language = languageMap[fileExtension];

    if (!language) {
      console.log(`\nNão foi possível determinar uma linguagem de destino para a extensão "${fileExtension}".`);
      console.log("Por favor, adicione esta extensão ao 'languageMap' no código.");
      return;
    }

    console.log(`\nDetectado: Código legado de "${fileExtension.substring(1).toUpperCase()}".`);
    console.log(`Será refatorado para: "${language.charAt(0).toUpperCase() + language.slice(1)}".`);
    console.log("---");

    const analysis = await askQuestion("Descreva a análise estática e os objetivos da refatoração:\n");
    
    // 2. Lê o conteúdo do arquivo
    const code = await fs.readFile(filePath.trim(), "utf-8");

    // 3. Chama a sua "máquina" de refatoração
    console.log("\nProcessando... Isso pode demorar um pouco.");
    const result = await refactoringChain.invoke({
      language,
      analysis: analysis.trim(),
      code: code.trim(),
    });

    // 4. Exibe o resultado para o usuário
    console.log("\n--- Refatoração Concluída ---");
    console.log("\nCódigo Refatorado:");
    console.log(result.refactoredCode);
    console.log("\nDicas de Refatoração:");
    result.refactoringTips.forEach((tip, index) => {
      console.log(`- ${tip}`);
    });

  } catch (error) {
    console.error("\nOcorreu um erro durante a refatoração:", error);
  } finally {
    rl.close();
  }
}

main();