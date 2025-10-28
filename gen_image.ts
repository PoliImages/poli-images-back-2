import { GoogleGenAI } from "@google/genai";
import fs from "fs";

class ImageGenerator {
    private client: GoogleGenAI;

    constructor(apiKey: string) {
        this.client = new GoogleGenAI({ apiKey });
    }

    async generateImage(prompt: string, style: string): Promise<string> {
        const response = await this.client.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: `Generate an image of ${prompt} in the style of ${style}.`,
        })

        if (!response.candidates || response.candidates.length === 0) {
            throw new Error("No images were generated.");
        }

        if (!response.candidates[0].content || !response.candidates[0].content.parts) {
            throw new Error("No image content found.");
        }

        for (const part of response.candidates[0].content.parts) {
            if (part.text) {
            console.log(part.text);
            } else if (part.inlineData) {
            const imageData = part.inlineData.data;

            if (!imageData) {
                throw new Error("No image data found.");
            }

            const buffer = Buffer.from(imageData, "base64");
            fs.writeFileSync("gemini-native-image.png", buffer);
            console.log("Image saved as gemini-native-image.png");
            }
        }

        return await fs.promises.readFile("mage.gemini-native-ipng", { encoding: "base64" });
    };
}

export default ImageGenerator;