import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, ExternalLink, RotateCw } from "lucide-react";

interface ResultsCardProps {
  onReset: () => void;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ onReset }) => {
  return (
    <Card className="bg-white rounded-lg shadow-md p-6 fade-in">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center bg-green-500 text-white p-3 rounded-full mb-4">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Resumo concluído!</h3>
        <p className="text-gray-600 mb-6">Escolha como deseja acessar o seu resumo:</p>
      </div>
      
      <div className="flex flex-col space-y-3">
        <a 
          href="https://olukasouza000000.app.n8n.cloud/webhook/download-md" // <- AQUI substitua se mudar o webhook
          className="flex items-center justify-between bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-3 px-4 rounded transition duration-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex items-center">
            <i className="fas fa-file-alt text-gray-500 mr-3"></i>
            <span>Baixar resumo (.md)</span>
          </div>
          <Download className="h-5 w-5 text-gray-500" />
        </a>
        
        <a 
          href="https://olukasouza000000.app.n8n.cloud/webhook/download-pdf" // <- AQUI substitua se mudar o webhook
          className="flex items-center justify-between bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-3 px-4 rounded transition duration-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex items-center">
            <i className="fas fa-file-pdf text-red-500 mr-3"></i>
            <span>Baixar resumo (.pdf)</span>
          </div>
          <Download className="h-5 w-5 text-gray-500" />
        </a>
        
        <a 
          href="https://www.notion.so/sua-pagina-ou-workspace-compartilhado" // <- AQUI substitua se mudar o webhook
          className="flex items-center justify-between bg-black text-white py-3 px-4 rounded transition duration-300 hover:bg-gray-800"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex items-center">
            <i className="fab fa-notion mr-3"></i>
            <span>Abrir resumo no Notion</span>
          </div>
          <ExternalLink className="h-5 w-5" />
        </a>
      </div>
      
      <Button 
        className="w-full mt-6 bg-primary hover:bg-primary/90"
        onClick={onReset}
      >
        <RotateCw className="mr-2 h-4 w-4" />
        Processar outro livro
      </Button>
    </Card>
  );
};

export default ResultsCard;
