import React from "react";
import { Upload, FileText, Brain, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/hero-transformation.jpg";

type HeroSectionProps = {
  onShowDocumentation?: () => void;
};

const HeroSection: React.FC<HeroSectionProps> = ({ onShowDocumentation }) => {
  return (
    <section className="pt-24 pb-16 px-6">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full ">
          
           
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Transforme{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Código Legado
            </span>
            <br />
            em Soluções Modernas
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Utilize IA avançada para analisar, documentar e modernizar projetos antigos. 
            Converta linguagens legadas em arquiteturas modernas com insights inteligentes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-105"
              onClick={() => {
                const section = document.getElementById("upload-section");
                if (section) {
                  section.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <Upload className="w-5 h-5 mr-2" />
              Enviar Projeto
            </Button>
            <Button 
             onClick={() => {
              console.log("Card clicado!");
              onShowDocumentation && onShowDocumentation();
            }}
              variant="outline" 
              size="lg"
              className="border-primary/30 hover:bg-primary/10 transition-all duration-300"
            >
              <FileText className="w-5 h-5 mr-2" />
              Ver Documentação
            </Button>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-3xl opacity-20 animate-glow-pulse"></div>
            <img 
              src={heroImage} 
              alt="CodeInsighter - Transformação de código legado"
              className="relative w-full h-auto rounded-2xl shadow-elegant border border-border/30"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-8 bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Análise Inteligente</h3>
            <p className="text-muted-foreground leading-relaxed">
              IA avançada analisa seu código legado, identificando padrões, 
              funcionalidades e dependências para facilitar a modernização.
            </p>
          </Card>

          <Card
            className="p-8 bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            onClick={() => {
              console.log("Card clicado!");
              onShowDocumentation && onShowDocumentation();
            }}
            tabIndex={0}
            role="button"
            aria-pressed="false"
            onKeyPress={e => {
              if (e.key === "Enter" || e.key === " ") {
                onShowDocumentation && onShowDocumentation();
              }
            }}
          >
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Documentação Automática</h3>
            <p className="text-muted-foreground leading-relaxed">
              Gere documentação completa e padronizada automaticamente, 
              incluindo funções, arquitetura e sugestões de modernização.
            </p>
          </Card>

          <Card className="p-8 bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
              <Layers className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Insights Arquiteturais</h3>
            <p className="text-muted-foreground leading-relaxed">
              Receba sugestões sobre migração para microsserviços, 
              padrões modernos e melhores práticas de desenvolvimento.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;