import { Code2, Zap } from "lucide-react";

const Header = () => {
  const handleLogoClick = () => {
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleLogoClick}
              className="relative focus:outline-none"
              aria-label="Voltar para o início"
              style={{ background: "none", border: "none", padding: 0, margin: 0 }}
            >
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-glow-pulse">
                <Zap className="w-3 h-3 text-background m-0.5" />
              </div>
            </button>
            <a href="/" className="text-sm text-muted-foreground">
            
            
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                CodeInsighter
              </h1>
              <p className="text-xs text-muted-foreground">
                Ford x FIAP Innovation Challenge
              </p>
              
            </div>
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <span className="text-muted-foreground">
                Transforme código legado em soluções modernas
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;