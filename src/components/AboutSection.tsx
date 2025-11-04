import { Linkedin, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
  github?: string;
};

const teamMembers: TeamMember[] = [
  {
    name: "Gabriel Montoni",
    role: "Desenvolvedor de Automações",
    bio: "",
    image: "../../src/assets/gabriel.jpeg", 
    linkedin: "https://www.linkedin.com/in/gabriel-felipe-montoni",
    github: "https://github.com/GabrielFMontoni"
  },
  {
    name: "Ronaldo Amorim",
    role: "CX Analyst",
    bio: "",
    image: "../../src/assets/ronaldo.jpeg",
    linkedin: "https://www.linkedin.com/in/ronaldo-amorim",
    github: "https://github.com/ronaldofelp"
  },
  {
    name: "Henrique Veneroso",
    role: "Engenheiro de Software",
    bio: "",
    image: "../../src/assets/henrique.jpeg",
    linkedin: "https://www.linkedin.com/in/henrique-veneroso",
    github: "https://github.com/HVeneroso"
  },
  {
    name: "Paulo Figueiredo",
    role: "Backend Developer",
    bio: "",
    image: "../../src/assets/paulo.jpeg",
    linkedin: "https://www.linkedin.com/in/paulofigueiredo-dev",
    github: "https://github.com/phlete"
  }
];

const AboutSection = () => {
  return (
    <div className="py-16 px-6">
      <div className="container mx-auto">
        {/* Sobre a Empresa */}
        <div className="max-w-3xl mx-auto text-center mb-16 relative">
          {/* botão voltar ao início (estilizado parecido com os botões do Hero) */}
          <div className="absolute right-0 top-0 md:top-2">
            <Link to="/">
              <Button size="sm" className="bg-gradient-primary text-white shadow-glow">
                Voltar ao Início
              </Button>
            </Link>
          </div>

          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            Sobre o CodeInsighter
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            O CodeInsighter nasceu da necessidade de modernizar sistemas legados de forma
            inteligente e eficiente. Desenvolvido como parte do Ford Innovation Challenge
            em parceria com a FIAP, nossa solução utiliza IA de ponta para analisar,
            compreender e sugerir melhorias em bases de código existentes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="p-6 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">Nossa Missão</h3>
              <p className="text-muted-foreground">
                Capacitar empresas a evoluírem seus sistemas legados com confiança,
                reduzindo riscos e acelerando a transformação digital através da
                inteligência artificial.
              </p>
            </div>
            <div className="p-6 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">Nossa Visão</h3>
              <p className="text-muted-foreground">
                Ser a principal ferramenta de modernização de código para empresas
                que buscam inovação tecnológica, tornando a evolução de sistemas
                mais acessível e eficiente.
              </p>
            </div>
          </div>
        </div>

        {/* Time (com degradê envolvente similar ao Hero) */}
        <div className="mt-16">
          <div className="max-w-5xl mx-auto relative">
            {/* degradê por trás do bloco de membros (centralizado e com animação parecida com o Hero) */}
            <div className="absolute inset-0 -translate-y-2 rounded-2xl bg-gradient-primary blur-3xl opacity-20 animate-glow-pulse pointer-events-none" />

            <div className="relative z-10 py-8">
              <h2 className="text-3xl font-bold text-center mb-12">Nosso Time</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-lg p-6 border border-border transition-all hover:border-primary/50"
                  >
                    {/* Foto */}
                    <div className="mb-4 relative">
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.src = "https://via.placeholder.com/200x200.png?text=Foto";
                          }}
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <h3 className="font-semibold mb-1">{member.name}</h3>
                    <p className="text-sm text-primary mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>

                    {/* Links */}
                    <div className="flex gap-2">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-primary/20 rounded-md transition-colors"
                          title="LinkedIn"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-primary/20 rounded-md transition-colors"
                          title="GitHub"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;