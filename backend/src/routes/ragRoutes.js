import express from "express";
import { RagStore } from "../rag/ragStore.js";
import { buildChunksFromFiles } from "../rag/chunker.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  const rag = new RagStore();
  return res.json(rag.stats());
});

router.delete("/reset", async (req, res) => {
  try {
    const rag = new RagStore();
    await rag.clear();
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Erro ao limpar índice." });
  }
});

router.post("/ingest/files", async (req, res) => {
  try {
    const { files, chunkSize, overlap } = req.body;
    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'Envie "files": [{ name, content }]' });
    }
    const docs = buildChunksFromFiles(files, { chunkSize, overlap });
    const rag = new RagStore();
    const result = await rag.upsertDocuments(docs);
    return res.json({ ok: true, ...result });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Erro ao ingerir arquivos." });
  }
});

router.post("/search", async (req, res) => {
  try {
    const { query, k = 5 } = req.body;
    if (!query) return res.status(400).json({ error: 'Envie "query"' });
    const rag = new RagStore();
    const hits = await rag.search(query, k);
    return res.json({ query, k, hits });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Erro na busca." });
  }
});

export default router;
