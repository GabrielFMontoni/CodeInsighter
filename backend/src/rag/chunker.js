export function chunkText(text, opts = {}) {
  const chunkSize = Math.max(400, Math.min(2000, opts.chunkSize || 1200));
  const overlap = Math.max(0, Math.min(400, opts.overlap || 200));
  const out = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(text.length, i + chunkSize);
    const chunk = text.slice(i, end);
    out.push(chunk);
    if (end === text.length) break;
    i = end - overlap;
  }
  return out;
}

export function buildChunksFromFiles(files, opts = {}) {
  const docs = [];
  files.forEach(file => {
    const name = file.name || "sem_nome";
    const content = file.content || "";
    const chunks = chunkText(content, opts);
    const total = chunks.length;
    chunks.forEach((chunk, idx) => {
      docs.push({
        id: `${name}::${idx}`,
        text: chunk,
        metadata: { fileName: name, chunkIndex: idx, totalChunks: total }
      });
    });
  });
  return docs;
}
