import { useState, useEffect } from "react";
import { FileText, Download, Copy, Check, Code, Building, Lightbulb, ChevronRight, FileCode, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const DocumentationViewer = () => {
  const [documentation, setDocumentation] = useState<any>(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copiedItems, setCopiedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItems(prev => [...prev, id]);
    setTimeout(() => {
      setCopiedItems(prev => prev.filter(item => item !== id));
    }, 2000);
  };

  const exportDocumentation = () => {
    const dataStr = JSON.stringify(documentation, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'documentacao-completa.json';
    link.click();
  };

  useEffect(() => {
    const storedData = sessionStorage.getItem('refactorData');
    
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setDocumentation(data);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Falha ao carregar os dados");
        setLoading(false);
      }
    } else {
      setError("Nenhum dado de análise encontrado. Por favor, faça o upload de arquivos primeiro.");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <section className="pt-32 py-16 px-6">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Carregando documentação...</p>
        </div>
      </section>
    );
  }

  if (error || !documentation) {
    return (
      <section className="pt-32 py-16 px-6">
        <div className="container mx-auto max-w-7xl text-center">
          <p className="text-xl text-red-500">{error || "Erro ao carregar documentação"}</p>
          <Button className="mt-4" onClick={() => window.location.href = '/#upload-section'}>
            Voltar para Upload
          </Button>
        </div>
      </section>
    );
  }

  const analysis = documentation.analysis?.[selectedFileIndex];
  const aiOutput = documentation.aiOutput;
  const allFiles = documentation.analysis || [];
  const totalFunctions = allFiles.reduce((sum: number, file: any) => sum + (file.functions?.length || 0), 0);
  const totalLoc = allFiles.reduce((sum: number, file: any) => sum + (file.loc || 0), 0);
  const avgComplexity = allFiles.length > 0 
    ? Math.round(allFiles.reduce((sum: number, file: any) => sum + (file.complexityApprox || 0), 0) / allFiles.length)
    : 0;

  // Filtrar funções do arquivo atual baseado nos nomes das funções
  const currentFileFunctions = [...new Set(analysis?.functions?.map((func: any) => func.name) || [])];
  
  // Filtrar apenas as funções deste arquivo E remover duplicatas
  const filteredFunctionsAnalysis = currentFileFunctions.length > 0
    ? aiOutput?.functionsAnalysis?.filter((func: any, index: number, self: any[]) => 
        currentFileFunctions.includes(func.name) && 
        // Remove duplicatas: mantém apenas a primeira ocorrência de cada nome
        self.findIndex(f => f.name === func.name) === index
      ) || []
    : [];

  // Logs para debug
  console.log('📁 Arquivo atual:', analysis?.name);
  console.log('🔍 Funções detectadas na análise estática:', currentFileFunctions);
  console.log('🤖 Funções retornadas pela IA (total):', aiOutput?.functionsAnalysis?.map((f: any) => f.name));
  console.log('✅ Funções filtradas para este arquivo:', filteredFunctionsAnalysis.map((f: any) => f.name));

  return (
    <section className="pt-28 py-16 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Documentação{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Inteligente
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Análise completa do seu projeto com insights de modernização
          </p>
        </div>

        <Card className="p-8 mb-8 bg-gradient-card border-border/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {allFiles.length}
              </div>
              <div className="text-sm text-muted-foreground">Arquivos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {totalFunctions}
              </div>
              <div className="text-sm text-muted-foreground">Funções</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {totalLoc}
              </div>
              <div className="text-sm text-muted-foreground">Linhas de Código</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {avgComplexity}
              </div>
              <div className="text-sm text-muted-foreground">Complexidade Média</div>
            </div>
        
          </div>
          <div className="flex justify-center">
            <Button onClick={exportDocumentation} className="bg-gradient-primary">
              <Download className="w-4 h-4 mr-2" />
              Exportar Documentação Completa
            </Button>
          </div>
        </Card>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="p-6 bg-gradient-card border-border/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                Arquivos ({allFiles.length})
              </h3>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {allFiles.map((file: any, index: number) => (
                    <div
                      key={index}
                      onClick={() => setSelectedFileIndex(index)}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedFileIndex === index
                          ? 'bg-primary/20 border-primary/30 border'
                          : 'hover:bg-background/50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm truncate">{file.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {file.language}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {file.functions?.length || 0} funções
                            </span>
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform flex-shrink-0 ml-2 ${
                            selectedFileIndex === index ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {allFiles.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/30">
                  <h4 className="text-sm font-semibold mb-2 text-yellow-500">⚠️ Code Smells Gerais</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {allFiles.flatMap((file: any, fileIdx: number) => 
                      (file.smells || []).map((smell: string, smellIdx: number) => (
                        <div key={`${fileIdx}-${smellIdx}`} className="p-2 bg-yellow-500/10 rounded text-xs border border-yellow-500/20">
                          <span className="font-medium">{file.name}:</span> {smell}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="p-8 bg-gradient-card border-border/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">{analysis?.name || 'Arquivo'}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="outline">{analysis?.language}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {analysis?.loc} linhas • {analysis?.functions?.length || 0} funções
                    </span>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="functions" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="functions" className="flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    Funções
                  </TabsTrigger>
                  <TabsTrigger value="architecture" className="flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    Arquitetura
                  </TabsTrigger>
                  <TabsTrigger value="tips" className="flex items-center">
                    <Layers className="w-4 h-4 mr-2" />
                    Dicas
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="functions" className="mt-6">
                  {filteredFunctionsAnalysis.length === 0 && currentFileFunctions.length > 0 && (
                    <Card className="p-6 bg-yellow-500/10 border-yellow-500/30 mb-4">
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">
                        ⚠️ A análise estática detectou {currentFileFunctions.length} função(ões), mas a IA não gerou análise para elas. 
                        Funções detectadas: {currentFileFunctions.join(', ')}
                      </p>
                    </Card>
                  )}
                  
                  <div className="space-y-6">
                    {filteredFunctionsAnalysis.length > 0 ? (
                      filteredFunctionsAnalysis.map((func: any, index: number) => (
                        <Card key={index} className="p-6 bg-background/30 border-border/30">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-primary">{func.name}</h4>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(func.name, `func-${index}`)}
                            >
                              {copiedItems.includes(`func-${index}`) ? (
                                <Check className="w-4 h-4 text-accent" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          
                          <div className="mb-4">
                            <h5 className="font-medium mb-2 text-sm text-muted-foreground">Descrição:</h5>
                            <p className="text-sm">{func.description}</p>
                          </div>

                          <div className="mb-4">
                            <h5 className="font-medium mb-2 text-sm text-muted-foreground">Parâmetros:</h5>
                            <div className="flex flex-wrap gap-2">
                              {func.parameters?.length > 0 ? (
                                func.parameters.map((param: string, i: number) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {param}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-xs text-muted-foreground">Nenhum parâmetro</span>
                              )}
                            </div>
                          </div>

                          {func.refactoredCode && (
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-sm text-muted-foreground">💻 Código Refatorado:</h5>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyToClipboard(func.refactoredCode, `code-${index}`)}
                                >
                                  {copiedItems.includes(`code-${index}`) ? (
                                    <Check className="w-4 h-4 text-accent" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                              <div className="relative border border-border/30 rounded-lg overflow-hidden">
                                <ScrollArea className="h-96">
                                  <pre className="p-4 bg-black/20 text-xs">
                                    <code className="whitespace-pre-wrap break-all">{func.refactoredCode}</code>
                                  </pre>
                                </ScrollArea>
                              </div>
                            </div>
                          )}

                          <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                            <h5 className="font-medium text-accent mb-2">💡 Sugestão de Modernização:</h5>
                            <p className="text-sm">{func.modernization}</p>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <Card className="p-6 bg-background/30 border-border/30 text-center">
                        <p className="text-muted-foreground">
                          Nenhuma função foi analisada neste arquivo ou a análise de IA não está disponível.
                        </p>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="architecture" className="mt-6">
                  <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-border/30">
                    <h4 className="text-lg font-semibold mb-4 flex items-center">
                      <Building className="w-5 h-5 mr-2 text-accent" />
                      Análise Arquitetural & Insights RAG
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="p-4 bg-background/50 rounded-lg border border-border/30">
                        <h5 className="font-medium mb-2 text-muted-foreground">Padrão Atual Detectado</h5>
                        <Badge variant="secondary" className="text-sm mb-2">
                          {allFiles.length > 3 ? 'Monolítico' : 'Estrutura Simples'}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {allFiles.length} arquivo(s) • {totalFunctions} função(ões) • {totalLoc} linhas
                        </p>
                      </div>
                      <div className="p-4 bg-background/50 rounded-lg border border-border/30">
                        <h5 className="font-medium mb-2 text-muted-foreground">Recomendação</h5>
                        <Badge variant="default" className="text-sm mb-2">
                          {allFiles.length > 5 ? 'Microserviços' : 'Modular'}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          Baseado na complexidade e tamanho do projeto
                        </p>
                      </div>
                    </div>

                    {documentation.rag?.matches && documentation.rag.matches.length > 0 && (
                      <div className="mb-6">
                        <h5 className="font-medium mb-3 text-sm">Contexto RAG Utilizado (Top {documentation.rag.topK}):</h5>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {documentation.rag.matches.map((match: any, i: number) => (
                            <div key={i} className="p-3 bg-background/50 rounded-lg border border-border/30">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-muted-foreground">
                                  {match.metadata?.fileName} - Chunk {match.metadata?.chunkIndex + 1}/{match.metadata?.totalChunks}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  Relevância: {(match.score * 100).toFixed(1)}%
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-3">{match.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <h5 className="font-medium text-sm">Sugestões de Migração:</h5>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <p className="text-sm">Identificar e separar módulos com responsabilidades distintas</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <p className="text-sm">Implementar comunicação via APIs REST ou mensageria</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <p className="text-sm">Adicionar camada de observabilidade (logs, métricas, tracing)</p>
                      </div>
                      {allFiles.length > 5 && (
                        <>
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <p className="text-sm">Considerar containerização com Docker/Kubernetes</p>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <p className="text-sm">Implementar API Gateway para gerenciar microsserviços</p>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Complexidade de Migração:</span>
                        <Badge variant={allFiles.length > 5 ? 'destructive' : 'default'}>
                          {allFiles.length > 5 ? 'Alta' : 'Média'}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="tips" className="mt-6">
                  <Card className="p-6 bg-background/30 border-border/30">
                    <h4 className="text-lg font-semibold mb-4 flex items-center">
                      <Layers className="w-5 h-5 mr-2 text-primary" />
                      Dicas de Refatoração
                    </h4>
                    
                    <div className="space-y-3">
                      {aiOutput?.refactoringTips?.map((tip: string, i: number) => (
                        <div key={i} className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-primary">{i + 1}</span>
                          </div>
                          <p className="text-sm">{tip}</p>
                        </div>
                      ))}

                      {(!aiOutput?.refactoringTips || aiOutput.refactoringTips.length === 0) && (
                        <div className="text-center p-6 text-muted-foreground">
                          Nenhuma dica de refatoração disponível.
                        </div>
                      )}
                    </div>

                    {documentation.bundledFiles && documentation.bundledFiles.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-border/30">
                        <h5 className="font-medium mb-3 text-sm">Arquivos Analisados:</h5>
                        <div className="flex flex-wrap gap-2">
                          {documentation.bundledFiles.map((file: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {file}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentationViewer;