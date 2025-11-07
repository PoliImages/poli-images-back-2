jest.mock('../auth.js', () => ({
    authenticateToken: (req, res, next) => {
        req.user = { email: 'teste@dominio.com' }; 
        next(); 
    }
}));

const mockGenerate = jest.fn(); 

jest.mock('../ImageService.js', () => {
    return jest.fn().mockImplementation(() => {
        return {
            generate: mockGenerate
        };
    });
});

const request = require('supertest');
const app = require('../server');
const ImageService = require('../ImageService.js'); 


// --- TESTES ---
describe('Funcionalidade: API de Geração de Imagem (BDD)', () => {
    beforeEach(() => {
        mockGenerate.mockClear();
    });
    
    // Cenário 1
    it.skip('Cenário: Usuário solicita uma imagem com dados válidos', async () => {

        const requestBody = {
            prompt: "Segunda Guerra Mundial",
            style: "Realista"
        };
        
        const mockServiceResult = { 
            imageUrl: 'https://exemplo.com/imagem_gerada.jpg' 
        };
        
        const expectedApiResponse = {
            imageUrl: 'https://exemplo.com/imagem_gerada.jpg',
            message: 'Imagem gerada com sucesso!'
        };
        
        mockGenerate.mockResolvedValue(mockServiceResult);

        const response = await request(app)
            .post('/api/generate-image')
            .send(requestBody);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedApiResponse);
        expect(mockGenerate).toHaveBeenCalledTimes(1);
        expect(mockGenerate).toHaveBeenCalledWith(requestBody.prompt, requestBody.style);
    });

    // Cenário 2
    it.skip('Cenário: Usuário solicita uma imagem sem um prompt', async () => {
        const requestBody = {
            style: "Realista"
        };

        const expectedErrorResponse = {
            error: 'Os campos "prompt" e "style" são obrigatórios.'
        };

        const response = await request(app)
            .post('/api/generate-image')
            .send(requestBody);

        expect(response.status).toBe(400);
        expect(response.body).toEqual(expectedErrorResponse);
        expect(mockGenerate).not.toHaveBeenCalled();
    });

    // Cenário 3
    it('Cenário: Usuário solicita uma imagem com prompt vazio', async () => {
        const requestBody = {
            prompt: "",
            style: "Anime"
        };

        const expectedErrorResponse = {
            error: "O campo 'prompt' não pode estar vazio."
        };

        const response = await request(app)
            .post('/api/generate-image')
            .send(requestBody);

        expect(response.status).toBe(400);
        expect(response.body).toEqual(expectedErrorResponse);
        expect(mockGenerate).not.toHaveBeenCalled();
    });
});