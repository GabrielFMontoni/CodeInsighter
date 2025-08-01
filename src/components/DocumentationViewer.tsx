import { useState } from "react";
import { FileText, Download, Copy, Check, Code, Building, Lightbulb, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data para demonstração
const mockDocumentation = {
  overview: {
    projectName: "Legacy Banking System",
    language: "COBOL",
    totalFiles: 47,
    linesOfCode: 15420,
    complexity: "High",
    modernizationScore: 6.8
  },
  files: [
    {
      name: "account-manager.cbl",
      type: "COBOL",
      size: "2.4 KB",
      functions: [
        {
          name: "CALCULATE-INTEREST",
          description: "Calcula juros compostos para contas de poupança",
          parameters: ["ACCOUNT-BALANCE", "INTEREST-RATE", "TIME-PERIOD"],
          complexity: "Medium",
          suggestions: "Migrar para função JavaScript pura com validação de tipos"
        },
        {
          name: "VALIDATE-ACCOUNT",
          description: "Valida número da conta e dados do cliente",
          parameters: ["ACCOUNT-NUMBER", "CUSTOMER-ID"],
          complexity: "Low",
          suggestions: "Implementar como middleware Express.js com validação Joi"
        }
      ],
      architecture: {
        currentPattern: "Monolithic Mainframe",
        suggestedPattern: "Microservice",
        migrationComplexity: "High",
        recommendations: [
          "Separar lógica de conta em microserviço independente",
          "Implementar API REST para comunicação",
          "Usar banco de dados NoSQL para melhor performance"
        ]
      }
    },
    {
      name: "customer-service.cbl",
      type: "COBOL",
      size: "3.1 KB",
      functions: [
        {
          name: "CREATE-CUSTOMER",
          description: "Cria novo registro de cliente no sistema",
          parameters: ["CUSTOMER-DATA", "VALIDATION-FLAGS"],
          complexity: "High",
          suggestions: "Migrar para Node.js com MongoDB e validação automática"
        }
      ],
      architecture: {
        currentPattern: "Procedural",
        suggestedPattern: "Object-Oriented with Repository Pattern",
        migrationComplexity: "Medium",
        recommendations: [
          "Implementar classes Customer e CustomerService",
          "Usar padrão Repository para abstração de dados",
          "Adicionar testes unitários com Jest"
        ]
      }
    }
  ]
};

const DocumentationViewer = () => {
  const [selectedFile, setSelectedFile] = useState(0);
  const [copiedItems, setCopiedItems] = useState<string[]>([]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItems(prev => [...prev, id]);
    setTimeout(() => {
      setCopiedItems(prev => prev.filter(item => item !== id));
    }, 2000);
  };

  const exportDocumentation = () => {
    // Implementar exportação da documentação
    console.log("Exportando documentação...");
  };

  return (
    <section className="pt-28 py-16 px-6"> {/* pt-28 para compensar o header fixo */}
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

        {/* Project Overview */}
        <Card className="p-8 mb-8 bg-gradient-card border-border/50">
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {mockDocumentation.overview.totalFiles}
              </div>
              <div className="text-sm text-muted-foreground">Arquivos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {mockDocumentation.overview.linesOfCode.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Linhas de Código</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">
                {mockDocumentation.overview.modernizationScore}/10
              </div>
              <div className="text-sm text-muted-foreground">Score de Modernização</div>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {mockDocumentation.overview.language}
              </Badge>
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
          {/* File Navigator */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-gradient-card border-border/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                Arquivos do Projeto
              </h3>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {mockDocumentation.files.map((file, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedFile(index)}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedFile === index
                          ? 'bg-primary/20 border-primary/30 border'
                          : 'hover:bg-background/50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.size}</p>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${
                          selectedFile === index ? 'rotate-90' : ''
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Documentation Content */}
          <div className="lg:col-span-3">
            <Card className="p-8 bg-gradient-card border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">
                  {mockDocumentation.files[selectedFile].name}
                </h3>
                <Badge variant="outline">
                  {mockDocumentation.files[selectedFile].type}
                </Badge>
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
                  <TabsTrigger value="insights" className="flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Insights
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="functions" className="mt-6">
                  <div className="space-y-6">
                    {mockDocumentation.files[selectedFile].functions.map((func, index) => (
                      <Card key={index} className="p-6 bg-background/30 border-border/30">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-primary">
                            {func.name}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={func.complexity === 'High' ? 'destructive' : 
                                     func.complexity === 'Medium' ? 'default' : 'secondary'}
                            >
                              {func.complexity}
                            </Badge>
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
                        </div>
                        
                        <p className="text-muted-foreground mb-4">{func.description}</p>
                        
                        <div className="mb-4">
                          <h5 className="font-medium mb-2">Parâmetros:</h5>
                          <div className="flex flex-wrap gap-2">
                            {func.parameters.map((param, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {param}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                          <h5 className="font-medium text-accent mb-2">💡 Sugestão de Modernização:</h5>
                          <p className="text-sm">{func.suggestions}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="architecture" className="mt-6">
                  <div className="space-y-6">
                    <Card className="p-6 bg-background/30 border-border/30">
                      <h4 className="text-lg font-semibold mb-4">Análise Arquitetural</h4>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h5 className="font-medium mb-2 text-muted-foreground">Padrão Atual</h5>
                          <Badge variant="secondary" className="text-sm">
                            {mockDocumentation.files[selectedFile].architecture.currentPattern}
                          </Badge>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2 text-muted-foreground">Padrão Sugerido</h5>
                          <Badge variant="default" className="text-sm">
                            {mockDocumentation.files[selectedFile].architecture.suggestedPattern}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h5 className="font-medium mb-3">Recomendações de Migração:</h5>
                        <div className="space-y-3">
                          {mockDocumentation.files[selectedFile].architecture.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                              <p className="text-sm">{rec}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Complexidade de Migração:</span>
                          <Badge 
                            variant={mockDocumentation.files[selectedFile].architecture.migrationComplexity === 'High' ? 'destructive' : 'default'}
                          >
                            {mockDocumentation.files[selectedFile].architecture.migrationComplexity}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="insights" className="mt-6">
                  <div className="space-y-6">
                    <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-border/30">
                      <h4 className="text-lg font-semibold mb-4 flex items-center">
                        <Lightbulb className="w-5 h-5 mr-2 text-accent" />
                        Insights de IA
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-background/50 rounded-lg">
                          <h5 className="font-medium text-accent mb-2">🚀 Oportunidades de Melhoria</h5>
                          <ul className="text-sm space-y-2">
                            <li>• Implementar cache Redis para operações frequentes</li>
                            <li>• Adicionar logging estruturado com Winston</li>
                            <li>• Configurar CI/CD com GitHub Actions</li>
                          </ul>
                        </div>
                        
                        <div className="p-4 bg-background/50 rounded-lg">
                          <h5 className="font-medium text-primary mb-2">⚡ Performance</h5>
                          <p className="text-sm">
                            Migração para Node.js pode resultar em 40-60% de melhoria na performance 
                            devido ao processamento assíncrono e menor overhead de memória.
                          </p>
                        </div>
                        
                        <div className="p-4 bg-background/50 rounded-lg">
                          <h5 className="font-medium text-accent mb-2">🔧 Stack Sugerida</h5>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker', 'Kubernetes'].map((tech) => (
                              <Badge key={tech} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
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