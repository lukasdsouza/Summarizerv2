import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import { insertSummarySchema, validImageMimeTypes } from "@shared/schema";
import multer from "multer";
import axios from "axios";
import { Buffer } from "buffer";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    if (validImageMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de arquivo inválido. Apenas imagens são permitidas."));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // Create upload route
  app.post("/api/upload", upload.single("data"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          message: "Nenhum arquivo foi enviado" 
        });
      }

      // Extract file information
      const fileBuffer = req.file.buffer;
      const fileName = req.file.originalname || "book-cover";
      
      // Create a new summary entry in storage
      const newSummary = await storage.createSummary({
        bookName: fileName,
        imageUrl: `data:${req.file.mimetype};base64,${fileBuffer.toString("base64")}`,
        statusProcessing: true
      });

      // Forward the file to n8n webhook
      try {
        const formData = new FormData();
        const blob = new Blob([fileBuffer], { type: req.file.mimetype });
        formData.append("data", blob, fileName);

        // Send to n8n webhook
        await axios.post("https://olukasouza000000.app.n8n.cloud/webhook/upload-livro", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Return the created summary
        return res.status(200).json({ 
          message: "Arquivo enviado com sucesso",
          id: newSummary.id
        });
      } catch (error) {
        console.error("Error forwarding to n8n:", error);
        return res.status(500).json({
          message: "Erro ao enviar para processamento",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    } catch (error) {
      console.error("Error in upload route:", error);
      return res.status(500).json({
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Route to check processing status
  app.get("/api/summary/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const summary = await storage.getSummary(id);
      if (!summary) {
        return res.status(404).json({ message: "Resumo não encontrado" });
      }

      return res.status(200).json(summary);
    } catch (error) {
      console.error("Error in get summary route:", error);
      return res.status(500).json({
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Route to update summary status (for webhook callback)
  app.post("/api/summary/:id", express.json(), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const summary = await storage.getSummary(id);
      if (!summary) {
        return res.status(404).json({ message: "Resumo não encontrado" });
      }

      const updatedSummary = await storage.updateSummary(id, {
        statusProcessing: false,
        generatedSummary: req.body.summary || null
      });

      return res.status(200).json(updatedSummary);
    } catch (error) {
      console.error("Error in update summary route:", error);
      return res.status(500).json({
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  return httpServer;
}
