// githubRoutes.js
import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.get('/download-repo-files', async (req, res) => {
  const { owner, repo } = req.query;

  if (!owner || !repo) {
    return res.status(400).json({ error: 'Parâmetros owner e repo são obrigatórios.' });
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro ao buscar arquivos.' });
    }

    const files = await response.json();

    const filePromises = files
      .filter(f => f.type === 'file') // pega só arquivos
      .map(async file => {
        const fileResponse = await fetch(file.download_url);
        const text = await fileResponse.text(); // pega conteúdo como string
        return { name: file.name, content: text };
      });

    const fileContents = await Promise.all(filePromises);

    res.json({ files: fileContents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao baixar os arquivos do repositório.' });
  }
});

export default router;
