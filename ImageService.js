class ImageService {
    constructor(aiClient) {
        this.ai = aiClient;
    }
    
    async generate(prompt, style) {
        const finalPrompt = `Imagem educacional para o tema "${prompt}" no estilo "${style}".`;
        const simulatedImageUrl = `https://picsum.photos/600/400?prompt=${encodeURIComponent(finalPrompt)}`;
        return { imageUrl: simulatedImageUrl };
    }
}

module.exports = ImageService;