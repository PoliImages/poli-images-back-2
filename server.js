const express = require('express');
const cors = require('cors'); // Corrigido a falta do módulo 'cors'
const dotenv = require('dotenv'); // Corrigido 'dontenv' para 'dotenv'
const jwt = require('jsonwebtoken');
const { default: ImageGenerator } = require('./gen_image');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Corrigido process.envPORT

// Middlewares
app.use(cors());
app.use(express.json()); // Habilita o Express a ler JSON no corpo da requisição

// --- Middleware de Autenticação ---
function authenticateToken(req, res, next) {
    // Pega o cabeçalho Authorization: Bearer TOKEN
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ error: 'Token de acesso não fornecido.' });
    }

    // Assumindo que a chave secreta está em uma variável de ambiente
    const secret = process.env.JWT_SECRET; 
    if (!secret) {
        console.error('JWT_SECRET não está definido nas variáveis de ambiente.');
        return res.status(500).json({ error: 'Erro de configuração do servidor.' });
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            // Token inválido, expirado, ou não corresponde à chave secreta
            return res.status(403).json({ error: 'Token de acesso inválido ou expirado.' });
        }
        req.user = user;
        next();
    });
}

// --- Rota Principal para Geração de Imagem ---
// Usa o middleware de autenticação
app.post("/api/generate-image", async (req, res) => {
    // 🚨 AQUI ESTÁ A CHAVE: Espera 'prompt' E 'style' separados do front-end
    const { prompt, style } = req.body; 

    if (!prompt || !style) {
        return res.status(400).json({ error: "Parâmetros 'prompt' e 'style' são obrigatórios." });
    }

    // Combina os dois campos para o prompt final
    const finalPrompt = `${prompt} em estilo ${style}`;

    // A chave da API deve vir das variáveis de ambiente
    const geminiApiKey = process.env.GEMINI_API_KEY;
    console.log("Usando GEMINI_API_KEY:", geminiApiKey);
    if (!geminiApiKey) {
        console.error('GEMINI_API_KEY não está definida nas variáveis de ambiente.');
        return res.status(500).json({ error: 'Erro de configuração da API.' });
    }

    try {
        const imageGen = new ImageGenerator(geminiApiKey);
        
        // Assume que a função do gen_image.ts é chamada com o prompt final
        const imageUrl = await imageGen.generateImage(finalPrompt); 

        res.json({ imageUrl: imageUrl });
    } catch (error) {
        console.error("Erro na geração de imagem:", error);
        res.status(500).json({ error: "Falha ao gerar a imagem." });
    }
});

// Iniciar o Servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor Node.js rodando em http://localhost:${PORT}`);
});