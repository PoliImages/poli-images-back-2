import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ImageGenerator from "./gen_image";

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota principal para geração de imagem
app.post("/api/generate-image", async (req, res) => {
  const { prompt, style } = req.body;

  if (!prompt || !style) {
    return res.status(400).json({ error: "Parâmetros 'prompt' e 'style' são obrigatórios." });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    return res.status(500).json({ error: "Chave GEMINI_API_KEY não definida." });
  }

  try {
    const imageGen = new ImageGenerator(geminiApiKey);
    const imageBase64 = await imageGen.generateImage(prompt, style);

    // Retorna o Base64 da imagem
    res.json({ imageUrl: `data:image/png;base64,${imageBase64}` });
  } catch (error: any) {
    console.error("Erro ao gerar imagem:", error);
    res.status(500).json({ error: "Falha ao gerar a imagem." });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
