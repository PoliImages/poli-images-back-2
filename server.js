const express = require('express');
const { GoogleGenAI } = require('@google/genai'); //SKD do gemini
const jwt = require('jsonwebtoken');
const dontenv = require('dotenv');
const cors = require('cors');
const { default: ImageGenerator } = require('./gen_image');
// const ImageGenerator = require('./gen_image').default;

dontenv.config();

const app = express();
const PORT = process.env.PORT
const JWT_SECRET = process.env.JWT_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY}); // inicializa o cliente gemini com a chave

app.use(express.json());
app.use(cors()); //acesso do frontend


// --- Middleware de Autenticação JWT ---
function authenticateToken(req, res, next) {
    // 1. Pega o token do cabeçalho
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ error: 'Token de acesso não fornecido.' });
    }

    // 2. Valida o token usando a mesma chave secreta do backend Dart
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // Se o token for inválido, vencido, etc.
            return res.status(403).json({ error: 'Token inválido ou expirado.' });
        }
        
        req.user = user; // Adiciona os dados do usuário na requisição
        next(); // Continua para a próxima função (a rota de geração de imagem)
    });
}

// --- Rota de Geração de Imagem com Autenticação ---
// URL de exemplo: POST /api/generate-image
app.post('/api/generate-image', authenticateToken, async (req, res) => {
    // Neste ponto, o req.user contém o role e o email do usuário logado!
    const { prompt, style } = req.body;
    
    if (!prompt || !style) {
        return res.status(400).json({ error: 'Os campos "prompt" e "style" são obrigatórios.' });
    }

    // Cria o prompt final, priorizando o contexto escolar
    const finalPrompt = `Imagem educacional para o tema "${prompt}" no estilo "${style}".`;
    
    try {
        // --- CHAMADA À API GEMINI (IMAGEN) ---
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002', // Modelo para geração de imagens
            prompt: finalPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9', // Tamanho padrão bom para conteúdo escolar
            },
        });

        // A API Gemini retorna a imagem em formato base64
        const imageResult = response.generatedImages[0].image.imageBytes;

        // Se você não tem um serviço de hospedagem (como AWS S3 ou Firebase Storage),
        // pode retornar o Base64 diretamente para o Flutter, mas a URL é melhor.
        // A melhor prática é enviar o Base64 para um Storage e retornar a URL pública.
        // Por simplicidade, vamos usar um placeholder que simula o sucesso.
        
        // **SUBSTITUA ESTE TRECHO PELO SEU CÓDIGO REAL DE UPLOAD DE IMAGEM E RETORNO DE URL**

        // Exemplo: Simulação de sucesso para testes iniciais
        const simulatedImageUrl = `https://picsum.photos/600/400?prompt=${encodeURIComponent(finalPrompt)}`;

        res.status(200).json({ 
            imageUrl: simulatedImageUrl,
            message: 'Imagem gerada com sucesso!',
            // Se for retornar o Base64: imageBase64: imageResult
        });

    } catch (e) {
        console.error('Erro ao chamar a API Gemini:', e);
        res.status(500).json({ error: 'Falha ao gerar a imagem através da API Gemini.' });
    }
});

// {
//     prompt: "A beautiful sunset over the mountains",
//     style: "Realistic"
// }

app.post("/generate-image", async (req, res) => {
    const { prompt, style } = req.body;

    try {
        const imageGen = new ImageGenerator(GEMINI_API_KEY);
        const imageUrl = await imageGen.generateImage(prompt, style);
        res.json({ imageUrl });
    } catch (error) {
        console.error("Erro ao gerar imagem:", error);
        res.status(500).json({ error: "Erro ao gerar imagem" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor Node.js rodando em http://localhost:${PORT}`);
});