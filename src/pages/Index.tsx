import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import UploadSection from "@/components/UploadSection";
import DocumentationViewer from "@/components/DocumentationViewer";
import Footer from "@/components/Footer";

const Index = () => {
  const [showDocumentation, setShowDocumentation] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {showDocumentation ? (
          <DocumentationViewer />
        ) : (
          <>
            <HeroSection onShowDocumentation={() => setShowDocumentation(true)} />
            <UploadSection onShowDocumentation={() => setShowDocumentation(true)} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
