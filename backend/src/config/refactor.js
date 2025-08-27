// refactor.js

// Importa a "máquina" de refatorar que você criou
import refactoringChain from "./gemini.config.js";

async function main() {
  const codigoLegado = `
       IDENTIFICATION DIVISION.
       PROGRAM-ID. HELLO-WORLD.
       
       DATA DIVISION.
       
       PROCEDURE DIVISION.
           DISPLAY "Hello, world!".
           STOP RUN.
  `;

  const analise = `O código COBOL fornecido exibe a mensagem "Hello, world!".
  
  Objetivo da refatoração:
  - Transformar o código COBOL em um código Python limpo e funcional.
  - Usar a função print() para exibir a mensagem.
  - Seguir as convenções de estilo do Python (PEP 8).
  `;

  try {
    // Executa a "máquina" de refatorar com as suas instruções
    const resultado = await refactoringChain.invoke({
      language: "python", // Linguagem de destino
      analysis: analise, // Análise do que o código faz e o que deve ser feito
      code: codigoLegado, // O código legado a ser refatorado
    });

    console.log("--- Código Refatorado ---");
    console.log(resultado.refactoredCode);
    
    console.log("\n--- Dicas da IA ---");
    console.log(resultado.refactoringTips);

  } catch (error) {
    console.error("Erro ao refatorar o código:", error);
  }
}

main();