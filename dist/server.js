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
const generateImage_1 = __importDefault(require("./gen_image")); 

const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());

app.post("/api/generate-image", async (req, res) => {
    const { prompt, style } = req.body; 

    if (!prompt || !style) {
        return res.status(400).json({ error: "Faltando prompt ou style na requisição." });
    }

    try {
        const imageBase64 = await (0, generateImage_1.default)(prompt, style); 
        
        res.json({ base64Image: imageBase64 }); 
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao gerar imagem no servidor: " + err.message });
    }
});

app.listen(3000, () => {
    console.log("🚀 Servidor rodando na porta 3000");
});