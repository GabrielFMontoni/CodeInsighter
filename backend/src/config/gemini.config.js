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
});

const outputParser = StructuredOutputParser.fromZodSchema(refactoringSchema);
const formatInstructions = outputParser.getFormatInstructions();

const promptTemplate = new PromptTemplate({
    template: `
Você é um arquiteto de software sênior em {language}.
Refatore o código legado abaixo aplicando boas práticas.

Análise Estática:

devem ser em portugues-BR
{analysis}

Código:
\`\`\`{language}
{code}
\`\`\`

Saída (JSON puro):

Sua resposta DEVE ser um objeto JSON que segue estritamente o esquema abaixo. NÃO inclua markdown (como \`\`\`json) ou qualquer outro texto explicativo fora do JSON.
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
