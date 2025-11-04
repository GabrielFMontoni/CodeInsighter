import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import UploadSection from "@/components/UploadSection";
import DocumentationViewer from "@/components/DocumentationViewer";
import Footer from "@/components/Footer";
import VideoPitch from "@/components/VideoPitch";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"home" | "documentation" | "video">("home");
  const [docRefreshKey, setDocRefreshKey] = useState(0);

  const showDocumentation = () => {
    setActiveTab("documentation");
    setDocRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Tabs */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab("home")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                activeTab === "home" ? "bg-primary text-white" : "bg-muted"
              }`}
            >
              Início
            </button>

            <button
              onClick={() => showDocumentation()}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                activeTab === "documentation" ? "bg-primary text-white" : "bg-muted"
              }`}
            >
              Documentação
            </button>

            <button
              onClick={() => setActiveTab("video")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                activeTab === "video" ? "bg-primary text-white" : "bg-muted"
              }`}
            >
              Pitch (vídeo)
            </button>
          </div>
        </div>

        {/* Renderização condicional */}
        {activeTab === "home" && (
          <>
            <HeroSection onShowDocumentation={showDocumentation} />
            <UploadSection onShowDocumentation={showDocumentation} />
          </>
        )}

        {activeTab === "documentation" && <DocumentationViewer key={docRefreshKey} />}

        {activeTab === "video" && <VideoPitch />}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
