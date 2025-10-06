import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import z from "zod";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const refactoringSchema = z.object({
    refactoredCode: z.string().optional(),
    refactoringTips: z.array(z.string()),
    functionsAnalysis: z.array(
        z.object({
            name: z.string(),
            parameters: z.array(z.string()),
            description: z.string(),
            modernization: z.string(),
            refactoredCode: z.string().optional(),
        })
    ),
});

// Parser aprimorado com limpeza mais robusta
class CustomStructuredOutputParser extends StructuredOutputParser {
    async parse(text) {
        let cleanedText = text.trim();
        
        // Remove markdown code blocks
        cleanedText = cleanedText.replace(/^```json\s*/i, '');
        cleanedText = cleanedText.replace(/^```\s*/, '');
        cleanedText = cleanedText.replace(/\s*```$/, '');
        cleanedText = cleanedText.trim();
        
        // Tenta corrigir escape de quebras de linha comum
        // Se encontrar \\n literal, substitui por \n real
        cleanedText = cleanedText.replace(/\\\\n/g, '\\n');
        cleanedText = cleanedText.replace(/\\\\t/g, '\\t');
        cleanedText = cleanedText.replace(/\\\\"/g, '\\"');
        
        try {
            return super.parse(cleanedText);
        } catch (error) {
            console.error("❌ Erro ao parsear JSON. Texto recebido:");
            console.error(cleanedText.substring(0, 500) + "...");
            
            // Tenta um fallback: parse manual e re-stringify
            try {
                const parsed = JSON.parse(cleanedText);
                return parsed;
            } catch (fallbackError) {
                console.error("❌ Fallback também falhou");
                throw error;
            }
        }
    }
}

const outputParser = CustomStructuredOutputParser.fromZodSchema(refactoringSchema);
const formatInstructions = outputParser.getFormatInstructions();

const promptTemplate = new PromptTemplate({
    template: `
Você é um arquiteto de software sênior especializado em {language}.

IMPORTANTE: Toda a sua resposta DEVE ser em PORTUGUÊS BRASILEIRO (pt-BR).

Sua tarefa é refatorar e analisar código legado fornecido, aplicando boas práticas de engenharia de software modernas.

Para cada função identificada no código, siga rigorosamente as instruções abaixo:

REQUISITOS DE SAÍDA PARA CADA FUNÇÃO (EM PORTUGUÊS):

1. Nome da função

2. Lista de parâmetros (com nomes e tipos quando possível)

3. Descrição concisa da função (máximo 3 linhas, EM PORTUGUÊS)

4. Código refatorado (refactoredCode):
   - Reescreva APENAS a função específica (não a classe inteira)
   - Use sintaxe moderna da linguagem {language}
   - Máximo de 30 linhas de código
   - Inclua apenas o código da função, sem imports ou contexto extra
   - Aplique: async/await quando apropriado, arrow functions, destructuring, tratamento de erros
   
5. Sugestão de modernização (modernization) EM PORTUGUÊS:
   - Uma frase curta e objetiva (máximo 2 linhas)
   - Use verbos no infinitivo (Exemplo: "Utilizar", "Implementar", "Adicionar")

6. Dicas de refatoração gerais (refactoringTips) EM PORTUGUÊS:
   - Lista de recomendações gerais para melhorar o código
   - Máximo 5 dicas
   - Cada dica deve ter no máximo 2 linhas

INFORMAÇÕES PARA ANÁLISE:

Análise Estática: {analysis}

Código legado: {code}

REGRAS CRÍTICAS PARA FORMATO JSON:
- ESCREVA TUDO EM PORTUGUÊS BRASILEIRO
- Retorne SOMENTE JSON puro, sem \`\`\`json ou \`\`\`
- O campo "refactoredCode" deve conter APENAS o código da função, não a classe inteira
- Descrições, sugestões e dicas DEVEM estar em português
- Seja conciso: descrições curtas, código enxuto

ATENÇÃO ESPECIAL AO ESCAPE DE STRINGS NO JSON:
- Use \\n para quebras de linha (não \\\\n)
- Use \\" para aspas duplas dentro de strings (não \\\\")
- Use \\t para tabulações (não \\\\t)
- Exemplo correto: "code": "public void test() \\n{{ return true; }}"
- Exemplo ERRADO: "code": "public void test() \\\\n{{ return true; }}"

TESTE SEU JSON ANTES DE ENVIAR:
- Certifique-se de que é JSON válido
- Verifique se todas as chaves estão entre aspas duplas
- Verifique se não há vírgulas extras no final de arrays ou objetos

{format_instructions}

LEMBRE-SE: Toda a saída deve ser em PORTUGUÊS BRASILEIRO, incluindo descrições, sugestões e dicas.
`,
    inputVariables: ["language", "analysis", "code"],
    partialVariables: { format_instructions: formatInstructions },
});

const model = new ChatGoogleGenerativeAI({
    model: process.env.GOOGLE_MODEL || "gemini-2.0-flash",
    temperature: 0.2, // Mantém baixo para saídas mais consistentes
    apiKey: process.env.GOOGLE_API_KEY,
    maxOutputTokens: 4096, // Aumenta limite se necessário
});

const chain = promptTemplate.pipe(model).pipe(outputParser);

export default chain;