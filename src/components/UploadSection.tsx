import { useState, useRef } from "react";
import { Upload, File, X, Check, AlertCircle } from "lucide-react";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

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

  const processFiles = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Simular processamento
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProcessingProgress(i);
    }
    
    setTimeout(() => {
      setIsProcessing(false);
      setProcessingProgress(0);
      // Redirecionar para DocumentationViewer
      onShowDocumentation && onShowDocumentation();
    }, 1000);
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
    const codeExtensions = ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go'];
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
          {/* Upload Area */}
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
                  {/* Selecionar arquivos */}
                  <label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.cs,.php,.rb,.go,.html,.css,.json,.xml,.sql"
                    />
                    <Button 
                      variant="outline" 
                      className="cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Selecionar Arquivos
                    </Button>
                  </label>

                  {/* Selecionar pasta */}
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
                    >
                      Selecionar Pasta
                    </Button>
                  </label>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Formatos suportados: Cobol, Ruby, Go, JS, TS, Python, Java e mais...</p>
                <p>Tamanho máximo: 100MB por arquivo</p>
              </div>
            </div>
          </div>

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <File className="w-5 h-5 mr-2 text-primary" />
                Arquivos Carregados ({uploadedFiles.length})
              </h4>
              
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
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Processing */}
          {isProcessing && (
            <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="font-medium">Processando arquivos com IA...</span>
              </div>
              <Progress value={processingProgress} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                Analisando estrutura, funções e dependências ({processingProgress}%)
              </p>
            </div>
          )}

          {/* Action Buttons */}
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

          {/* Tips */}
          <div className="mt-8 p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <h5 className="font-medium text-accent mb-1">Dicas para melhores resultados:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Inclua arquivos de configuração (package.json, requirements.txt, etc.)</li>
                  <li>• Envie a estrutura completa do projeto para análise arquitetural</li>
                  <li>• Arquivos com comentários geram documentação mais rica</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

import { Brain } from "lucide-react";

export default UploadSection;