export function detectLanguage(name = "", content = "") {
  const ext = (name.split(".").pop() || "").toLowerCase();
  const map = { js: "JavaScript", mjs: "JavaScript", ts: "TypeScript", java: "Java", py: "Python", cs: "C#", rb: "Ruby", php: "PHP", go: "Go" };
  if (map[ext]) return map[ext];
  if (/public\s+class\s+\w+/.test(content)) return "Java";
  if (/function\s+\w+\s*\(|=>/.test(content)) return "JavaScript";
  return "PlainText";
}

export function analyzeFile(name, content) {
  const text = (content || "");
  const lines = text.split(/\r?\n/);
  const imports = lines.filter(l => /^\s*(import|require\(|using\s+|#include|package\s+)/.test(l));
  const complexityHits = (text.match(/\b(if|for|while|case|catch)\b|&&|\|\||\?/g) || []);
  const functions = [];

  // Funções JavaScript/TypeScript
  const jsFns = [...text.matchAll(/(?:async\s+)?function\s+([a-zA-Z_$][\w$]*)\s*\(([^)]*)\)|(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>|(?:async\s+)?([a-zA-Z_$][\w$]*)\s*\(([^)]*)\)\s*\{/g)];
  jsFns.forEach(m => {
    const name = m[1] || m[3] || m[5];
    const keywords = ['if', 'for', 'while', 'catch', 'switch', 'function', 'return', 'throw', 'try', 'main'];
    if (name && !keywords.includes(name.toLowerCase())) {
      const params = (m[2] || m[4] || m[6] || "").split(",").map(s => s.trim()).filter(Boolean);
      functions.push({ name, parameters: params });
    }
  });

  // Funções Java - apenas métodos com modificadores de acesso
  const javaFns = [...text.matchAll(/^[ \t]*(public|private|protected)\s+(?:static\s+)?(?!class\b)[\w<>\[\],\s]+\s+([a-zA-Z_$][\w$]*)\s*\(([^)]*)\)\s*(?:throws\s+[\w\s,]+)?\s*\{/gm)];
  javaFns.forEach(m => {
    const name = m[2];
    if (name && name !== 'main') { // Ignorar main explicitamente
      const params = (m[3] || "").split(",").map(s => s.trim()).filter(Boolean);
      functions.push({ name, parameters: params });
    }
  });

  const loc = lines.length;
  const smells = [];
  if (loc > 400) smells.push("Arquivo grande: considerar modularização por domínio.");
  if ((text.match(/TODO|FIXME|HACK/g) || []).length > 0) smells.push("Comentários TODO/FIXME encontrados.");
  
  const uniqueFunctions = functions.filter((func, index, self) =>
    index === self.findIndex(f => f.name === func.name)
  );
  
  return {
    name,
    language: detectLanguage(name, content),
    loc,
    importCount: imports.length,
    complexityApprox: 1 + complexityHits.length,
    functions: uniqueFunctions,
    smells,
  };
}
export function buildAnalysisSummary(perFile) {
  return perFile.map(f =>
    `Arquivo: ${f.name}\n` +
    `Linguagem: ${f.language}\n` +
    `LOC: ${f.loc}\n` +
    `Complexidade Aproximada: ${f.complexityApprox}\n` +
    `Imports: ${f.importCount}\n` +
    `Funções: ${f.functions.map(fn => `${fn.name}(${fn.parameters.join(", ")})`).join(", ") || "Nenhuma detectada"}\n` +
    `Code smells: ${f.smells.join("; ") || "nenhum"}`
  ).join("\n\n");
}
