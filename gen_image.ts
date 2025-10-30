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
            contents: prompt,
      });
      console.log(response)
        // const model = this.client.getGenerativeModel({ model: 'gemini-2.0-flash-preview-image-generation'});

        // const prompt = "Write a story about a magic backpack."

        // const result = await model.ge
        // const response = result.response;
        // const text = response.text();
        // console.log(text); 
        // console.log(await this.client.models.list());
        // const model = this.client.models.get({model: "models/gemini-2.5-pro"});
        // const response = await this.client.models.generateImages({

        //     model: "models/gemini-2.5-pro",
        //     prompt: `Generate an image of ${prompt} in the style of ${style}.`,
           
        // })
        // console.log("Image generation response:", response);
        // if (!response.generatedImages || response.generatedImages.length === 0) {
        //     throw new Error("No images were generated.");
        // }

        // if (!response.generatedImages[0]|| !response.generatedImages[0]) {
        //     throw new Error("No image content found.");
        // }

        // // for (const part of response.generatedImages) {
        // //     if (part) {
        // //     console.log(part.text);
        // //     } else if (part.inlineData) {
        // //     const imageData = part.inlineData.data;

        // //     if (!imageData) {
        // //         throw new Error("No image data found.");
        // //     }

        // //     const buffer = Buffer.from(imageData, "base64");
        // //     fs.writeFileSync("gemini-native-image.png", buffer);
        // //     console.log("Image saved as gemini-native-image.png");
        // //     }
        // // }

        return await fs.promises.readFile("mage.gemini-native-ipng", { encoding: "base64" });
    };
}

export default ImageGenerator;