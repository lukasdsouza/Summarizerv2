import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LoadingCardProps {
  progress: number;
}

const LoadingCard: React.FC<LoadingCardProps> = ({ progress }) => {
  return (
    <Card className="bg-white rounded-lg shadow-md p-6 mb-6 fade-in">
      <div className="text-center py-6">
        <div className="spinner inline-block w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Resumo em geração...</h3>
        <p className="text-gray-600 text-sm">
          Estamos processando seu livro com inteligência artificial
        </p>
        
        <Progress 
          className="w-full h-2.5 mt-6 bg-gray-200" 
          value={progress} 
        />
      </div>
    </Card>
  );
};

export default LoadingCard;
