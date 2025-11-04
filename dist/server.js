"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// 💡 MUDANÇA 1: Importar o generateImage como default se for um módulo ES (usando o gen_image.js que sugeri)
const generateImage_1 = __importDefault(require("./gen_image")); 

const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());

app.post("/api/generate-image", async (req, res) => {
    // ✅ CORREÇÃO 1: Capturar 'prompt' E 'style' do corpo da requisição
    const { prompt, style } = req.body; 

    // Adicionado validação básica
    if (!prompt || !style) {
        return res.status(400).json({ error: "Faltando prompt ou style na requisição." });
    }

    try {
        // ✅ CORREÇÃO 2: Passar 'prompt' E 'style' para a função de geração de imagem
        const imageBase64 = await (0, generateImage_1.default)(prompt, style); 
        
        // ✅ CORREÇÃO 3: Retornar a chave esperada pelo Flutter ('base64Image')
        res.json({ base64Image: imageBase64 }); 
    }
    catch (err) {
        console.error(err);
        // Garante que a resposta de erro também é JSON
        res.status(500).json({ error: "Erro ao gerar imagem no servidor: " + err.message });
    }
});

// A porta deve ser a mesma configurada no BASE_URL do Flutter (se você estiver usando .env)
app.listen(3000, () => {
    console.log("🚀 Servidor rodando na porta 3000");
});