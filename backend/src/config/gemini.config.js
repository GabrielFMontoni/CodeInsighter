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
    refactoredCode: z.string(),
    refactoringTips: z.array(z.string()),
    functionsAnalysis: z.array(
        z.object({
            name: z.string(),
            parameters: z.array(z.string()),
            description: z.string(),
            modernization: z.string(),
        })
    ),
});

const outputParser = StructuredOutputParser.fromZodSchema(refactoringSchema);
const formatInstructions = outputParser.getFormatInstructions();


const promptTemplate = new PromptTemplate({
    template: `
Você é um arquiteto de software sênior em {language}.
Refatore o código legado abaixo aplicando boas práticas.

Para cada função encontrada, forneça:
- Nome da função
- Lista de parâmetros
- Descrição detalhada da função (explique o que ela faz, o tipo de dado retornado, a estrutura desse retorno e, quando aplicável, os principais atributos dos objetos envolvidos)
- Sugestões de modernização:
    - Devem ser **recomendações**, usando verbos no infinitivo (ex.: "Substituir", "Utilizar", "Adicionar").
    - Devem se basear **somente no código fornecido** e na análise estática.
    - Devem estar adaptadas à linguagem do código.
    - Não inventar melhorias que não se aplicam à linguagem ou ao código.
    - Toda função deve ter uma sugestão.

Análise Estática (em português-BR):
{analysis}

Código:
{code}

Saída (JSON puro):
Sua resposta DEVE ser um objeto JSON válido seguindo estritamente o esquema abaixo. 
NÃO inclua crases (\`\`\`), markdown ou texto adicional fora do JSON.
{format_instructions}
`,
    inputVariables: ["language", "analysis", "code"],
    partialVariables: { format_instructions: formatInstructions },
});

const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    temperature: 0.2,
    apiKey: process.env.GOOGLE_API_KEY,
});


const chain = promptTemplate.pipe(model).pipe(outputParser);

export default chain;
