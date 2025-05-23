import React, { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWebcam } from "@/hooks/use-webcam";
import { Camera } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface UploadCardProps {
  onUpload: (file: File) => void;
}

const UploadCard: React.FC<UploadCardProps> = ({ onUpload }) => {
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState("Nenhum arquivo selecionado");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [webcamOpen, setWebcamOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { videoRef, capturePhoto, photoRef, hasPhoto, clearPhoto } = useWebcam();

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setUploadSuccess(true);
      setFileSelected(true);
    } else {
      resetFileSelection();
    }
  };

  // Reset file selection
  const resetFileSelection = () => {
    setFileName("Nenhum arquivo selecionado");
    setUploadSuccess(false);
    setFileSelected(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFileName(file.name);
      setUploadSuccess(true);
      setFileSelected(true);
      
      // Create a new file input event to capture the file
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  // Handle submission
  const handleSubmit = () => {
    if (!fileSelected && !hasPhoto) return;
    
    if (hasPhoto) {
      // Convert canvas image to File object
      photoRef.current?.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          onUpload(file);
        }
      }, "image/jpeg");
    } else if (fileInputRef.current?.files?.[0]) {
      onUpload(fileInputRef.current.files[0]);
    }
  };

  // Handle webcam capture confirmation
  const handleCaptureConfirm = () => {
    setWebcamOpen(false);
    setFileSelected(true);
    setFileName("camera-capture.jpg");
    setUploadSuccess(true);
  };

  // Open camera dialog
  const openCamera = () => {
    clearPhoto();
    setWebcamOpen(true);
  };

  return (
    <>
      <Card className="bg-white rounded-lg shadow-md p-6 mb-6 fade-in">
        <p className="text-gray-700 mb-4">Escolha ou tire uma foto da capa do livro:</p>
        
        <div 
          className="upload-box border-2 border-dashed border-secondary rounded-lg p-6 text-center cursor-pointer"
          onClick={() => !hasPhoto && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input 
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          
          {hasPhoto ? (
            <div className="flex flex-col items-center">
              <canvas 
                ref={photoRef} 
                className="w-full max-h-48 object-contain rounded mb-2"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  clearPhoto();
                  resetFileSelection();
                }}
              >
                Remover foto
              </Button>
            </div>
          ) : (
            <>
              <div className="text-secondary mb-2">
                <i className="fas fa-camera text-4xl"></i>
              </div>
              <div className="text-gray-500 mb-2">{fileName}</div>
              {uploadSuccess && (
                <div className="text-secondary text-sm">
                  Arquivo selecionado com sucesso!
                </div>
              )}
              <div className="flex flex-col space-y-2 mt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openCamera();
                  }}
                >
                  <Camera className="mr-2 h-4 w-4" /> Usar câmera
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <i className="fas fa-upload mr-2"></i> Fazer upload de foto
                </Button>
              </div>
            </>
          )}
        </div>
        
        <Button
          className="w-full mt-6 bg-primary hover:bg-primary/90"
          disabled={!fileSelected && !hasPhoto}
          onClick={handleSubmit}
        >
          <i className="fas fa-paper-plane mr-2"></i>
          Enviar para Resumo
        </Button>
        
        <p className="text-xs text-gray-500 mt-4 text-center">
          Seu livro será processado com IA para gerar resumos detalhados e estruturados
        </p>
      </Card>

      <Dialog open={webcamOpen} onOpenChange={setWebcamOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Capture a capa do livro</DialogTitle>
          <DialogDescription>Use a câmera para capturar a imagem da capa do livro.</DialogDescription>
          
          <div className="flex flex-col items-center">
            <div className="relative w-full">
              <video 
                ref={videoRef} 
                autoPlay 
                className="w-full rounded-md border border-gray-300"
              />
              {hasPhoto && (
                <div className="absolute inset-0 bg-white">
                  <canvas 
                    ref={photoRef} 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
            
            <div className="flex mt-4 space-x-2">
              {!hasPhoto ? (
                <Button 
                  className="bg-secondary hover:bg-secondary/90"
                  onClick={capturePhoto}
                >
                  <i className="fas fa-camera mr-2"></i>
                  Capturar
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={clearPhoto}
                  >
                    <i className="fas fa-redo mr-2"></i>
                    Recapturar
                  </Button>
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleCaptureConfirm}
                  >
                    <i className="fas fa-check mr-2"></i>
                    Confirmar
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadCard;
