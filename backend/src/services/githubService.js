import fetch from "node-fetch";

const GH_API = "https://api.github.com";

function ghHeaders() {
  const h = { "Accept": "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

async function getRefSha(owner, repo, ref = "main") {
  const r = await fetch(`${GH_API}/repos/${owner}/${repo}/git/refs/heads/${ref}`, { headers: ghHeaders() });
  if (r.status === 200) {
    const js = await r.json();
    return js.object?.sha;
  }
  // try tags/commits directly
  return ref;
}

export async function listRepoTree(owner, repo, ref = "main") {
  const sha = await getRefSha(owner, repo, ref);
  const r = await fetch(`${GH_API}/repos/${owner}/${repo}/git/trees/${sha}?recursive=1`, { headers: ghHeaders() });
  if (!r.ok) throw new Error(`GitHub trees API falhou: ${r.status}`);
  const js = await r.json();
  return { sha, tree: js.tree || [] };
}

export function filterPaths(tree, { includeExt = [".java",".js",".ts",".tsx",".py",".rb",".go",".cs",".php"], excludePaths = [] } = {}) {
  const ok = [];
  for (const node of tree) {
    if (node.type !== "blob") continue;
    const p = `/${node.path}`;
    const ext = "." + (node.path.split(".").pop() || "").toLowerCase();
    if (includeExt.length && !includeExt.includes(ext)) continue;
    if (excludePaths.some(prefix => p.startsWith(prefix))) continue;
    ok.push(node.path);
  }
  return ok;
}

export async function fetchRawFiles(owner, repo, ref, paths) {
  const files = [];
  for (const p of paths) {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${p}`;
    const r = await fetch(url, { headers: ghHeaders() });
    if (!r.ok) continue;
    const content = await r.text();
    files.push({ name: p, content });
  }
  return files;
}
