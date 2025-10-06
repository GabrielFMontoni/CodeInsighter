import express from "express";
import { listRepoTree, filterPaths, fetchRawFiles } from "../services/githubService.js";
import { buildChunksFromFiles } from "../rag/chunker.js";
import { RagStore } from "../rag/ragStore.js";
import { analyzeFile, buildAnalysisSummary } from "../utils/staticAnalyzer.js";
import runRefactoring from "../services/refactorService.js";

const router = express.Router();

// 1) Apenas ingere um repositório no RAG
router.post("/github/ingest", async (req, res) => {
  try {
    const { owner, repo, ref = "main", includeExt, excludePaths, chunkSize, overlap } = req.body || {};
    if (!owner || !repo) return res.status(400).json({ error: 'Envie "owner" e "repo"' });

    const { sha, tree } = await listRepoTree(owner, repo, ref);
    const paths = filterPaths(tree, { includeExt, excludePaths });
    const files = await fetchRawFiles(owner, repo, ref, paths);

    const docs = buildChunksFromFiles(files, { chunkSize, overlap });
    const rag = new RagStore();
    const result = await rag.upsertDocuments(docs);

    return res.json({ ok: true, owner, repo, ref, sha, filesCount: files.length, ingestedChunks: result.added, totalChunks: result.total });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Falha na ingestão do repositório.", details: String(e) });
  }
});

// 2) Pipeline completo: baixa → ingere → recupera contexto → refatora
router.post("/github/refactor", async (req, res) => {
  try {
    const { owner, repo, ref = "main", includeExt, excludePaths, chunkSize, overlap, topK = 6, language, maxBundleBytes = 120000 } = req.body || {};
    if (!owner || !repo) return res.status(400).json({ error: 'Envie "owner" e "repo"' });

    const { sha, tree } = await listRepoTree(owner, repo, ref);
    const paths = filterPaths(tree, { includeExt, excludePaths });
    const files = await fetchRawFiles(owner, repo, ref, paths);

    // Ingest
    const rag = new RagStore();
    const docs = buildChunksFromFiles(files, { chunkSize, overlap });
    const ingestResult = await rag.upsertDocuments(docs);

    // Análise estática
    const analyses = files.map(f => analyzeFile(f.name || "sem_nome", f.content || ""));
    const analysisText = buildAnalysisSummary(analyses);

    const tally = analyses.reduce((acc, a) => (acc[a.language] = (acc[a.language] || 0) + 1, acc), {});
    const majority = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0];
    const chosenLanguage = language || majority || "JavaScript";

    // Bundle com limite
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

    // Contexto RAG
    const ragQuery = `${chosenLanguage}\n${analysisText}\nRepo: ${owner}/${repo} (${ref})`;
    const contextItems = await rag.search(ragQuery, topK);
    const context = contextItems.map((c, i) => `[#${i+1}] (${c.metadata.fileName} - ${c.metadata.chunkIndex+1}/${c.metadata.totalChunks})\n${c.text}`).join("\n\n");

    // IA
    const aiOutput = await runRefactoring(chosenLanguage, analysisText, codeBundle, context);

    return res.json({
      repo: { owner, repo, ref, sha },
      filesCount: files.length,
      ingest: ingestResult,
      language: chosenLanguage,
      bundledFiles: selected.map(f => f.name),
      rag: { topK, matches: contextItems },
      aiOutput
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Falha no pipeline github/refactor.", details: String(e) });
  }
});

export default router;
