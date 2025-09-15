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
Você é um arquiteto de software sênior especializado em {language}.

Sua tarefa é refatorar e analisar código legado fornecido, aplicando boas práticas de engenharia de software.

Para cada função identificada no código, siga rigorosamente as instruções abaixo:

Etapas de raciocínio (Self-Consistency)

Gerar múltiplas interpretações possíveis do código e da análise estática.

Comparar as alternativas e selecionar a mais clara, precisa e consistente com o código fornecido.

Produzir apenas a resposta final consolidada no formato JSON solicitado, garantindo que seja coesa, sem contradições internas e totalmente válida.

Requisitos de saída para cada função

Nome da função

Lista de parâmetros (com nomes e, se possível, tipos inferidos a partir do código)

Descrição detalhada da função:

Explique o que a função faz.

Informe o tipo de dado retornado.

Explique a estrutura desse retorno.

Quando aplicável, descreva os principais atributos dos objetos envolvidos.

Sugestões de modernização (sempre em forma de recomendações):

Usar verbos no infinitivo, ex.: "Substituir", "Utilizar", "Adicionar".

Basear-se exclusivamente no código fornecido (sem inventar melhorias que não se aplicam à linguagem ou ao contexto).

Adaptar recomendações às boas práticas da linguagem analisada.

Toda função deve obrigatoriamente ter pelo menos uma sugestão.

Restrições importantes

A análise deve ser feita com base no seguinte bloco de informações:

Análise Estática (português-BR): {analysis}

Código legado: {code}

A saída final DEVE ser um objeto JSON válido, sem crases, markdown ou texto adicional.

O JSON precisa seguir estritamente o formato esperado:

{format_instructions}

Apenas a resposta final consistente deve ser exibida ao usuário.
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
