import { useState, useRef } from "react";
import { Upload, FileText, X, AlertCircle, Link, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface UploadSectionProps {
  onShowDocumentation?: () => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onShowDocumentation }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [useRAG, setUseRAG] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleGithubUpload = async () => {
    if (!githubUrl) return alert('Cole a URL do GitHub');

    try {
      const url = new URL(githubUrl);
      const pathParts = url.pathname.split('/').filter(p => p);
      
      if (pathParts.length < 2) {
        alert('URL inválida. Use: https://github.com/owner/repo');
        return;
      }

      const [owner, repo] = pathParts;

      // Iniciar indicador de loading
      setIsProcessing(true);
      setProcessingProgress(30);
      setProcessingStatus(`Baixando repositório ${owner}/${repo} do GitHub...`);

      const response = await fetch(`http://localhost:3000/api/github/download-repo-files?owner=${owner}&repo=${repo}`);
      
      if (!response.ok) {
        throw new Error('Erro ao baixar os arquivos');
      }

      setProcessingProgress(70);
      setProcessingStatus('Processando arquivos baixados...');

      const data = await response.json();
      const files = data.files.map((f: any) => new File([f.content], f.name));
      
      setProcessingProgress(100);
      setProcessingStatus(`${files.length} arquivos importados com sucesso!`);
      
      setUploadedFiles(prev => [...prev, ...files]);
      
      // Resetar após 1 segundo
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingProgress(0);
        setProcessingStatus('');
        setGithubUrl('');
      }, 1000);

    } catch (err) {
      console.error('Erro ao processar o upload do GitHub:', err);
      alert('Erro ao processar o upload do GitHub. Verifique a URL e tente novamente.');
      setIsProcessing(false);
      setProcessingProgress(0);
      setProcessingStatus('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const detectLanguage = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      'js': 'JavaScript',
      'ts': 'TypeScript',
      'jsx': 'JavaScript',
      'tsx': 'TypeScript',
      'py': 'Python',
      'java': 'Java',
      'go': 'Go',
      'rb': 'Ruby',
      'cs': 'C#',
      'php': 'PHP',
      'cobol': 'COBOL',
      'cbl': 'COBOL',
      'cpp': 'C++',
      'c': 'C'
    };
    return langMap[ext || ''] || 'JavaScript';
  };

  const processFiles = async () => {
    if (uploadedFiles.length === 0) return;

    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessingStatus("Preparando arquivos...");

    try {
      // Converter arquivos para o formato esperado pela API
      const filesPayload = await Promise.all(
        uploadedFiles.map(async (file) => ({
          name: file.name,
          content: await file.text()
        }))
      );

      setProcessingProgress(20);
      setProcessingStatus("Analisando estrutura do código...");

      // Etapa 1: Análise estática
      const analyzeResponse = await fetch('http://localhost:3000/api/analyze/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: filesPayload })
      });

      if (!analyzeResponse.ok) {
        throw new Error('Erro na análise estática');
      }

      const analyzeData = await analyzeResponse.json();
      console.log('Análise estática concluída:', analyzeData);

      setProcessingProgress(50);
      setProcessingStatus("Gerando sugestões de refatoração com IA...");

      // Etapa 2: Refatoração com RAG
      const language = detectLanguage(uploadedFiles[0].name);

      const refactorResponse = await fetch('http://localhost:3000/api/refactor/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          ingest: useRAG, // Usa RAG se marcado
          topK: 6,
          files: filesPayload
        })
      });

      if (!refactorResponse.ok) {
        throw new Error('Erro na refatoração');
      }

      const refactorData = await refactorResponse.json();
      console.log('Refatoração concluída:', refactorData);

      // Salvar dados no sessionStorage para o DocumentationViewer
try {
  sessionStorage.setItem('refactorData', JSON.stringify(refactorData));
  console.log('✅ Dados salvos no sessionStorage');
  
  // Verificar se foi salvo
  const verificacao = sessionStorage.getItem('refactorData');
  if (verificacao) {
    console.log('✅ Verificação OK - dados encontrados');
  } else {
    console.error('❌ Verificação falhou - dados não encontrados');
  }
} catch (storageError) {
  console.error('❌ Erro ao salvar no sessionStorage:', storageError);
}

      setProcessingProgress(90);
      setProcessingStatus("Finalizando análise...");

      // Pequeno delay para mostrar o progresso
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProcessingProgress(100);
      setProcessingStatus("Análise concluída!");

      // Redirecionar para DocumentationViewer após 1 segundo
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingProgress(0);
        setProcessingStatus("");
        onShowDocumentation && onShowDocumentation();
      }, 1000);

    } catch (err) {
      console.error('Erro ao processar arquivos:', err);
      alert('Erro ao processar os arquivos. Verifique se a API está rodando em localhost:3000');
      setIsProcessing(false);
      setProcessingProgress(0);
      setProcessingStatus("");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const codeExtensions = ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'cobol', 'cbl'];
    return codeExtensions.includes(extension || '') ? '💻' : '📄';
  };

  return (
    <section id="upload-section" className="py-16 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Envie Seu{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Projeto Legado
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Faça upload dos arquivos do seu projeto e deixe nossa IA fazer a análise completa
          </p>
        </div>

        <Card className="p-8 bg-gradient-card border-border/50">
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              isDragging
                ? 'border-primary bg-primary/10 scale-105'
                : 'border-border hover:border-primary/50 hover:bg-primary/5'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center transition-all duration-300 ${
                isDragging ? 'animate-glow-pulse' : ''
              }`}>
                <Upload className="w-8 h-8 text-white" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Arraste e solte seus arquivos aqui
                </h3>
                <p className="text-muted-foreground mb-4">
                  Ou clique para selecionar arquivos
                </p>
                
                <div className="flex gap-2 justify-center">
                  <label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.cs,.php,.rb,.go,.html,.css,.json,.xml,.sql,.cobol,.cbl"
                    />
                    <Button 
                      variant="outline" 
                      className="cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessing}
                    >
                      Selecionar Arquivos
                    </Button>
                  </label>

                  <label>
                    <input
                      ref={folderInputRef}
                      type="file"
                      multiple
                      // @ts-ignore
                      webkitdirectory="true"
                      // @ts-ignore
                      directory="true"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      className="cursor-pointer"
                      onClick={() => folderInputRef.current?.click()}
                      disabled={isProcessing}
                    >
                      Selecionar Pasta
                    </Button>
                  </label>
                </div>

                <div className="flex gap-2 pt-4 items-center justify-center">
                  <input
                    type="text"
                    placeholder="Cole a URL do repositório GitHub"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm w-64 bg-background"
                    disabled={isProcessing}
                  />
                  <Button
                    variant="outline"
                    className="cursor-pointer flex items-center gap-2"
                    onClick={handleGithubUpload}
                    disabled={isProcessing}
                  >
                    <Link className="w-4 h-4" />
                    Importar
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Formatos suportados: Cobol, Ruby, Go, JS, TS, Python, Java e mais...</p>
                <p>Tamanho máximo: 100MB por arquivo</p>
              </div>
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-primary" />
                  Arquivos Carregados ({uploadedFiles.length})
                </h4>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useRAG}
                    onChange={(e) => setUseRAG(e.target.checked)}
                    className="w-4 h-4 rounded border-border"
                    disabled={isProcessing}
                  />
                  <span className="text-sm text-muted-foreground">
                    Usar RAG (contexto semântico)
                  </span>
                </label>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{getFileIcon(file.name)}</span>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {file.name.split('.').pop()?.toUpperCase()}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
                        disabled={isProcessing}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="font-medium">{processingStatus}</span>
              </div>
              <Progress value={processingProgress} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                {processingProgress}% concluído
              </p>
            </div>
          )}

          {uploadedFiles.length > 0 && !isProcessing && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button
                onClick={processFiles}
                className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
                size="lg"
              >
                <Brain className="w-5 h-5 mr-2" />
                Analisar com IA
              </Button>
              <Button
                variant="outline"
                onClick={() => setUploadedFiles([])}
                size="lg"
              >
                Limpar Tudo
              </Button>
            </div>
          )}

          <div className="mt-8 p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <h5 className="font-medium text-accent mb-1">Dicas para melhores resultados:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Inclua arquivos de configuração (package.json, requirements.txt, etc.)</li>
                  <li>• Envie a estrutura completa do projeto para análise arquitetural</li>
                  <li>• Arquivos com comentários geram documentação mais rica</li>
                  <li>• Ative o RAG para análises contextualizadas usando embeddings</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default UploadSection;