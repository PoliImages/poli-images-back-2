import { GoogleGenAI } from "@google/genai";
import fs from "fs";

class ImageGenerator {
  private client: GoogleGenAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenAI({ apiKey });
  }

  // Recebe prompt e estilo separadamente
  async generateImage(prompt: string, style: string): Promise<string> {
    // Monta prompt final
    const finalPrompt = `${prompt} em estilo ${style}`;

    // Chama o modelo Gemini 2.5 para gerar imagem
    const response = await this.client.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [finalPrompt],
    });

    // Itera pelos outputs
    for (const item of response.output) {
      if (item.type === "image" && item.image?.imageBase64) {
        const imageBase64 = item.image.imageBase64;
        // Salva localmente (opcional)
        fs.writeFileSync("generated-image.png", Buffer.from(imageBase64, "base64"));
        console.log("Imagem salva como generated-image.png");
        return imageBase64; // retorna Base64 para o frontend
      }
    }

    throw new Error("Nenhuma imagem foi gerada pelo modelo.");
  }
}

export default ImageGenerator;
