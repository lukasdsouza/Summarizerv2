import React, { useState } from "react";
import Header from "@/components/Header";
import UploadCard from "@/components/UploadCard";
import LoadingCard from "@/components/LoadingCard";
import ResultsCard from "@/components/ResultsCard";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AppState = "upload" | "loading" | "results";

const Home: React.FC = () => {
  const [appState, setAppState] = useState<AppState>("upload");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [summaryId, setSummaryId] = useState<number | null>(null);
  const { toast } = useToast();

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const response = await fetch('https://olukasouza000000.app.n8n.cloud/webhook/upload-livro', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error('Erro na resposta do servidor');
        
        return { success: true, message: "Upload enviado com sucesso!" };
      } catch (err) {
        console.error(err);
        throw new Error('Erro no upload: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
      }
    },
    onSuccess: (data) => {
      simulateProcessing();
    },
    onError: (error) => {
      toast({
        title: "Erro no upload",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
      setAppState("upload");
      setUploadProgress(0);
    },
  });

  // Handle file upload
  const handleUpload = (file: File) => {
    const formData = new FormData();
    formData.append("data", file);
    
    setAppState("loading");
    uploadMutation.mutate(formData);
  };

  // Simulate processing (in a real app, we would poll the server for status)
  const simulateProcessing = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setAppState("results");
        }, 500);
      }
    }, 200);
  };

  // Reset the app
  const handleReset = () => {
    setAppState("upload");
    setUploadProgress(0);
    setSummaryId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Header />
      
      <main>
        {appState === "upload" && (
          <UploadCard onUpload={handleUpload} />
        )}
        
        {appState === "loading" && (
          <LoadingCard progress={uploadProgress} />
        )}
        
        {appState === "results" && (
          <ResultsCard onReset={handleReset} />
        )}
      </main>
    </div>
  );
};

export default Home;
