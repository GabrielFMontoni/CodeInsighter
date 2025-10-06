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
            fileName: z.string(), // ← ADICIONAR NOME DO ARQUIVO
            name: z.string(),
            parameters: z.array(z.string()),
            description: z.string(),
            modernization: z.string(),
            refactoredCode: z.string().optional(),
        })
    ),
});

// Parser robusto com múltiplas estratégias de correção
class CustomStructuredOutputParser extends StructuredOutputParser {
    async parse(text) {
        let cleanedText = text.trim();
        
        // Remove markdown code blocks
        cleanedText = cleanedText.replace(/^```json\s*/i, '');
        cleanedText = cleanedText.replace(/^```\s*/, '');
        cleanedText = cleanedText.replace(/\s*```$/m, '');
        cleanedText = cleanedText.trim();
        
        // Estratégia 1: Tentar parse direto
        try {
            const parsed = JSON.parse(cleanedText);
            console.log("✅ JSON parseado com sucesso (estratégia 1)");
            return parsed;
        } catch (firstError) {
            console.log("⚠️ Primeira tentativa falhou, aplicando correções...");
        }
        
        // Estratégia 2: Corrigir escapes comuns
        cleanedText = cleanedText.replace(/\\\\n/g, '\\n');
        cleanedText = cleanedText.replace(/\\\\t/g, '\\t');
        cleanedText = cleanedText.replace(/\\\\r/g, '\\r');
        
        try {
            const parsed = JSON.parse(cleanedText);
            console.log("✅ JSON parseado com sucesso (estratégia 2 - escape fix)");
            return parsed;
        } catch (secondError) {
            console.log("⚠️ Segunda tentativa falhou, aplicando correção profunda...");
        }
        
        // Estratégia 3: Corrigir aspas escapadas dentro de strings
        // Regex para encontrar valores de propriedades que contêm código
        cleanedText = cleanedText.replace(
            /"refactoredCode":\s*"([^"]|\\")+"(?=\s*[,}])/g,
            (match) => {
                // Dentro da string do código, substituir \" por '
                return match.replace(/\\"/g, "'");
            }
        );
        
        try {
            const parsed = JSON.parse(cleanedText);
            console.log("✅ JSON parseado com sucesso (estratégia 3 - quote fix)");
            return parsed;
        } catch (thirdError) {
            console.error("❌ Todas as estratégias falharam");
            console.error("Erro:", thirdError.message);
            console.error("JSON problemático (primeiros 1000 chars):");
            console.error(cleanedText.substring(0, 1000));
            
            // Última tentativa: usar super.parse com fallback
            try {
                return super.parse(cleanedText);
            } catch (finalError) {
                throw new Error(`Falha ao parsear JSON após múltiplas tentativas: ${finalError.message}`);
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

REQUISITOS DE SAÍDA PARA CADA FUNÇÃO (EM PORTUGUÊS):

1. Nome do arquivo (fileName) - OBRIGATÓRIO

2. Nome da função

3. Lista de parâmetros (com nomes e tipos quando possível)

4. Descrição concisa da função (máximo 3 linhas, EM PORTUGUÊS)

5. Código refatorado (refactoredCode):
   - Reescreva APENAS a função específica (não a classe inteira)
   - Use sintaxe moderna da linguagem {language}
   - Máximo de 30 linhas de código
   - IMPORTANTE: Use ASPAS SIMPLES (') dentro do código Java/C#/etc ao invés de aspas duplas (")
   - Exemplo: 'Shradha' ao invés de "Shradha"
   - Isso evita problemas de escape no JSON
   
6. Sugestão de modernização (modernization) EM PORTUGUÊS:
   - Uma frase curta e objetiva (máximo 2 linhas)
   - Use verbos no infinitivo (Exemplo: "Utilizar", "Implementar", "Adicionar")

7. Dicas de refatoração gerais (refactoringTips) EM PORTUGUÊS:
   - Lista de recomendações gerais para melhorar o código
   - Máximo 5 dicas
   - Cada dica deve ter no máximo 2 linhas

INFORMAÇÕES PARA ANÁLISE:

Análise Estática: {analysis}

Código legado: {code}

REGRAS CRÍTICAS:
- Analise TODAS as funções encontradas na análise estática, inclusive getters e setters
- Cada função DEVE incluir o campo "fileName" indicando o arquivo de origem
- ESCREVA TUDO EM PORTUGUÊS BRASILEIRO
- Retorne SOMENTE JSON puro, sem \`\`\`json ou \`\`\`

ATENÇÃO ESPECIAL - ASPAS NO CÓDIGO:
- SEMPRE use aspas simples (') para strings literais dentro do código refatorado
- NUNCA use aspas duplas (") dentro do campo "refactoredCode"
- Exemplo CORRETO: if (x.equals('admin'))
- Exemplo ERRADO: if (x.equals("admin"))

ESCAPE DE CARACTERES NO JSON:
- Use \\n para quebras de linha (um backslash)
- Use \\t para tabulações (um backslash)
- Exemplo: "code": "public void test() \\n\\t return true;\\n"

{format_instructions}

LEMBRE-SE: 
1. Toda a saída em PORTUGUÊS BRASILEIRO
2. Incluir "fileName" em TODAS as funções
3. Analisar TODAS as funções (inclusive getters/setters)
4. Use ASPAS SIMPLES no código Java/C#/etc
5. JSON válido sem vírgulas extras
`,
    inputVariables: ["language", "analysis", "code"],
    partialVariables: { format_instructions: formatInstructions },
});

const model = new ChatGoogleGenerativeAI({
    model: process.env.GOOGLE_MODEL || "gemini-2.0-flash",
    temperature: 0.1, // Reduzido para mais consistência
    apiKey: process.env.GOOGLE_API_KEY,
    maxOutputTokens: 8192, // Aumentado
});

const chain = promptTemplate.pipe(model).pipe(outputParser);

export default chain;