import fs from "fs";
import path from "path";
import { embeddings } from "../config/embeddings.config.js";

const DATA_DIR = path.join(process.cwd(), "data");
const INDEX_PATH = path.join(DATA_DIR, "rag_index.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadIndex() {
  ensureDataDir();
  if (!fs.existsSync(INDEX_PATH)) {
    return { version: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), docs: [], model: "text-embedding-004" };
  }
  try {
    const raw = fs.readFileSync(INDEX_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { version: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), docs: [], model: "text-embedding-004" };
  }
}

function saveIndex(idx) {
  ensureDataDir();
  idx.updatedAt = new Date().toISOString();
  fs.writeFileSync(INDEX_PATH, JSON.stringify(idx, null, 2), "utf-8");
}

function cosineSim(a, b) {
  let dot = 0, na = 0, nb = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export class RagStore {
  constructor() {
    this.index = loadIndex();
  }

  stats() {
    return { count: this.index.docs.length, updatedAt: this.index.updatedAt, model: this.index.model };
  }

  async clear() {
    this.index.docs = [];
    saveIndex(this.index);
  }

  async embed(text) {
    const vec = await embeddings.embedQuery(text);
    return vec;
  }

  async upsertDocuments(docs) {
    const toAdd = [];
    for (const d of docs) {
      const vector = await this.embed(d.text);
      toAdd.push({ id: d.id, text: d.text, metadata: d.metadata || {}, embedding: vector });
    }
    const idSet = new Set(toAdd.map(d => d.id));
    this.index.docs = [
      ...this.index.docs.filter(d => !idSet.has(d.id)),
      ...toAdd
    ];
    saveIndex(this.index);
    return { added: toAdd.length, total: this.index.docs.length };
  }

  async search(query, k = 5) {
    if (!this.index.docs.length) return [];
    const qvec = await this.embed(query);
    const scored = this.index.docs.map(d => ({
      ...d,
      score: (() => {
        const s = cosineSim(qvec, d.embedding);
        return Number((s || 0).toFixed(6));
      })()
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, k).map(s => ({
      id: s.id,
      text: s.text,
      metadata: s.metadata,
      score: s.score
    }));
  }
}
