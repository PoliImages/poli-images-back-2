import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import generateImage from "./gen_image.js";
import imagesRouter from "./routes/images.js"; // 🆕 NOVO: Importa as rotas de imagens

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
// 🆕 IMPORTANTE: Aumentar o limite para aceitar Base64 de imagens grandes
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Rota existente de geração de imagem
app.post("/api/generate-image", async (req, res) => {
  const { prompt, style } = req.body;

  if (!prompt || !style) {
    return res.status(400).json({ 
      error: "Campos obrigatórios: prompt e style" 
    });
  }

  try {
    const imageBase64 = await generateImage(prompt, style);
    console.log(`✅ Imagem gerada para: ${prompt} em estilo ${style}`);
    res.json({ base64Image: imageBase64 });
  } catch (err) {
    console.error('❌ Erro ao gerar imagem:', err);
    res.status(500).json({ 
      error: "Erro ao gerar imagem: " + err.message 
    });
  }
});

// 🆕 NOVO: Rotas do MongoDB para galeria de imagens
app.use("/api", imagesRouter);

// Rota de health check (opcional, mas útil)
app.get("/", (req, res) => {
  res.json({ 
    status: "online", 
    message: "Poli Images Backend API" 
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 API disponível em: http://localhost:${PORT}`);
  console.log(`🖼️  Geração de imagens: POST /api/generate-image`);
  console.log(`🗂️  Galeria de imagens: GET /api/images`);
});