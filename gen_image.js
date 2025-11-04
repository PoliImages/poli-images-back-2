import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function generateImage() {

  const ai = new GoogleGenAI({});

  // TODO: trocar o prompt fixo para o prompt recebido por parâmetro
  const prompt =
    "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme";

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image", // talvez trocar para outro modelocaso esse falhe
    contents: prompt,
  });
  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("gemini-native-image.png", buffer);
      const base64 = buffer.toString("base64");
      console.log("Image saved as gemini-native-image.png"); // TODO: mudar para retornar o base64 da imagem, não salvar localmente
      return base64;
    }
  }

  console.log("Image generation completed.");
}

export default generateImage;