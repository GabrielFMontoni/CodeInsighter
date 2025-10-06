import runRefactoring from "../services/refactorService.js";
import { analyzeFile, buildAnalysisSummary } from "../utils/staticAnalyzer.js";
import { RagStore } from "../rag/ragStore.js";
import { buildChunksFromFiles } from "../rag/chunker.js";

const staticAnalysisResults = `
Sugestões de modernização (em tom de recomendação, descrevendo ações a serem feitas e não como algo já feito).
Exemplos de estilo:
- Substituir 'var' por 'let' ou 'const'.
- Utilizar template literals para concatenação de strings.
- Considerar separar a classe Produto em um arquivo próprio.
`;

const legacyCode = `
public class Exemplo {
  public static void main(String[] args) {
    System.out.println("Hello, legado!");
  }
}
`;

async function handleRefactorRequest(req, res) {
  try {
    const language = req.query.language || "Java";
    const result = await runRefactoring(language, staticAnalysisResults, legacyCode, "");
    return res.json({
      codigoRefatorado: result.refactoredCode,
      dicas: result.refactoringTips,
      funcoes: result.functionsAnalysis
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Erro ao processar a refatoração." });
  }
}

export async function handleFilesAnalyze(req, res) {
  try {
    const { files } = req.body;
    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'Envie "files": [{ name, content }]' });
    }
    const analyses = files.map(f => analyzeFile(f.name || "sem_nome", f.content || ""));
    const summary = buildAnalysisSummary(analyses);
    return res.json({ analyses, summary });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Erro ao analisar arquivos." });
  }
}
export async function handleFilesRefactor(req, res) {
  try {
    let { files, language, ingest = true, topK = 6, chunkSize, overlap, maxBundleBytes = 120000 } = req.body;
    
    console.log('📥 Arquivos recebidos:', files.map(f => f.name));
    
    // Filtrar arquivos compilados e desnecessários
    files = files.filter(f => {
      const name = f.name?.toLowerCase() || '';
      const shouldKeep = !name.endsWith('.class') && 
                        !name.endsWith('.jar') && 
                        !name.endsWith('.pyc') &&
                        !name.includes('/node_modules/') &&
                        !name.includes('/dist/') &&
                        !name.includes('/build/');
      if (!shouldKeep) console.log('⏭️  Ignorando:', f.name);
      return shouldKeep;
    });
    
    console.log('✅ Arquivos para processar:', files.map(f => f.name));
    
    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'Envie "files": [{ name, content }]' });
    }

    const analyses = files.map(f => analyzeFile(f.name || "sem_nome", f.content || ""));
    
    // Log das funções detectadas por arquivo
    analyses.forEach(a => {
      console.log(`📄 ${a.name}: ${a.functions.length} funções -> ${a.functions.map(f => f.name).join(', ')}`);
    });
    
    const analysisText = buildAnalysisSummary(analyses);

    const tally = analyses.reduce((acc, a) => (acc[a.language] = (acc[a.language] || 0) + 1, acc), {});
    const majority = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0];
    const chosenLanguage = language || majority || "JavaScript";

    let remaining = maxBundleBytes;
    const sorted = [...files].sort((a,b) => (a.content?.length||0) - (b.content?.length||0));
    const selected = [];
    for (const f of sorted) {
      const len = (f.content||"").length + (f.name||"").length + 32;
      if (len <= remaining) {
        remaining -= len;
        selected.push(f);
      } else {
        break;
      }
    }
    const codeBundle = selected.map(f => `// BEGIN ${f.name}\n${f.content}\n// END ${f.name}`).join("\n\n");

    const rag = new RagStore();
    let contextItems = [];
    if (ingest) {
      const docs = buildChunksFromFiles(files, { chunkSize, overlap });
      await rag.upsertDocuments(docs);
    }
    const ragQuery = `${chosenLanguage}\n${analysisText}\nArquivos: ${files.map(f => f.name).join(", ")}`;
    contextItems = await rag.search(ragQuery, topK);
    const context = contextItems.map((c, i) => `[#${i+1}] (${c.metadata.fileName} - ${c.metadata.chunkIndex+1}/${c.metadata.totalChunks})\n${c.text}`).join("\n\n");

    const aiOutput = await runRefactoring(chosenLanguage, analysisText, codeBundle, context);

    return res.json({ language: chosenLanguage, analysis: analyses, rag: { topK, matches: contextItems }, aiOutput, bundledFiles: selected.map(f => f.name) });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Erro ao analisar/refatorar arquivos." });
  }
}
export function getMockPayload(req, res) {
  return res.json({
    analysis: staticAnalysisResults.trim(),
    code: legacyCode.trim()
  });
}

export default handleRefactorRequest;
