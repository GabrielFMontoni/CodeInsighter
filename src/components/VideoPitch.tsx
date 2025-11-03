import React from "react";

type Props = {
  videoUrl?: string;
};

const VideoPitch: React.FC<Props> = ({
  videoUrl = "https://youtube.com/embed/UFK4Ha33PME?si=W5bwlws5AZO3Eth0",
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">Pitch do Projeto</h2>

      {/* Responsive 16:9 wrapper */}
      <div style={{ position: "relative", paddingTop: "56.25%" }}>
        <iframe
          src={videoUrl}
          title="Pitch do projeto"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full rounded-md border"
        />
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
      Apresentamos o Code Insighter, a IA que acelera a modernização de sistemas legados. Reduza tempo, custos e riscos ao analisar projetos antigos e obter insights claros para evolução tecnológica.
      </p>
    </div>
  );
};

export default VideoPitch;
