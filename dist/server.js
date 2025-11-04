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
const gen_image_1 = require("./gen_image");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.post("/api/generate-image", async (req, res) => {
    const { prompt } = req.body;
    try {
        const imageBase64 = await (0, gen_image_1.generateImage)(prompt);
        res.json({ image: imageBase64 });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao gerar imagem" });
    }
});
app.listen(3000, () => {
    console.log("🚀 Servidor rodando na porta 3000");
});
