import { GoogleGenAI } from "@google/genai";

async function generateImage(userPrompt, style) { 
  
  if (!userPrompt) {
    throw new Error("O prompt do usuário é obrigatório.");
  }
  
  const ai = new GoogleGenAI({});

  const prompt = `Gere uma imagem de: "${userPrompt}", no estilo artístico: ${style}. Por favor, crie uma imagem vibrante e didática, adequada para contexto escolar.`;
  
  console.log(`Prompt final enviado para a IA: ${prompt}`);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        console.log("Imagem gerada com sucesso. Retornando Base64.");
        return imageData; 
      }
    }
    
    throw new Error("A resposta da IA não contém dados de imagem Base64.");

  } catch (error) {
    console.error("Erro na geração da imagem:", error.message);
    throw new Error("Falha ao se comunicar com o serviço de IA para geração da imagem.");
  }
}

export default generateImage;