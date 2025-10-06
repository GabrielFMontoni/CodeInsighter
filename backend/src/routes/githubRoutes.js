import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // carrega as variáveis do .env

const router = express.Router();


const ignoredExtensions = [
  '.xml', '.mf', '.rd', '.env', '.json', '.yml', '.yaml', '.lock', '.gitignore', '.properties', '.md'
];

function shouldIgnoreFile(filename) {
  return ignoredExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}


const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // armazene no .env

async function fetchFilesRecursively(owner, repo, path = '') {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents${path ? `/${path}` : ''}`;
  console.log(`Buscando conteúdo de: ${url}`);

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'CodeInsighter',
      'Authorization': `token ${GITHUB_TOKEN}`
    }
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`❌ Falha ao buscar ${url} - Status: ${response.status}\n${text}`);
    throw new Error(`Erro ao buscar conteúdo de ${path}`);
  }

  const items = await response.json();
  if (!Array.isArray(items)) return [];

  const files = [];

  for (const item of items) {
    if (item.type === 'file') {
      if (shouldIgnoreFile(item.name) || !item.download_url) continue;
      const fileResponse = await fetch(item.download_url);
      const content = await fileResponse.text();
      files.push({ name: item.name, path: item.path, content });
    } else if (item.type === 'dir') {
      const subFiles = await fetchFilesRecursively(owner, repo, item.path);
      files.push(...subFiles);
    }
  }

  return files;
}


// Rota principal
router.get('/download-repo-files', async (req, res) => {
  const { owner, repo } = req.query;

  if (!owner || !repo) {
    return res.status(400).json({ error: 'Parâmetros owner e repo são obrigatórios.' });
  }

  try {
    const allFiles = await fetchFilesRecursively(owner, repo);
    res.json({ files: allFiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao baixar os arquivos do repositório.' });
  }
});

export default router;
