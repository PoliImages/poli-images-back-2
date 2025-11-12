"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImage = generateImage;
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new genai_1.GoogleGenerativeAI(apiKey);
// Modelo correto de imagem
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});
// Função principal
async function generateImage(prompt) {
    try {
        const response = await model.generateContent([
            {
                text: `Gere uma imagem baseada nesse prompt: ${prompt}`,
            },
        ]);
        // ✅ (A mudança está aqui!)
        const buffer = response.response.image;
        if (!buffer) {
            throw new Error("Nenhuma imagem retornada pela API");
        }
        // Convertendo para base64
        const base64 = buffer.toString("base64");
        return `data:image/png;base64,${base64}`;
    }
    catch (error) {
        console.error("Erro ao gerar imagem:", error);
        throw new Error("Falha ao gerar imagem");
    }
}
