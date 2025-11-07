// routes/images.js
import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const router = express.Router();

// Configure sua connection string do MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'poli_images_db';
const COLLECTION_NAME = 'images';

let db;

// Conecta ao MongoDB
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(DB_NAME);
    console.log('✅ Conectado ao MongoDB');
  })
  .catch(err => console.error('❌ Erro ao conectar MongoDB:', err));

// Middleware para verificar conexão com o banco
const checkDbConnection = (req, res, next) => {
  if (!db) {
    return res.status(503).json({ error: 'Banco de dados não conectado' });
  }
  next();
};

// POST - Salvar uma nova imagem
router.post('/images', checkDbConnection, async (req, res) => {
  try {
    const { subject, topic, style, base64String, createdAt } = req.body;

    if (!subject || !topic || !style || !base64String) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: subject, topic, style, base64String' 
      });
    }

    const newImage = {
      subject,
      topic,
      style,
      base64String,
      createdAt: createdAt || new Date().toISOString(),
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(newImage);
    
    console.log(`✅ Imagem salva: ${result.insertedId} - ${subject}: ${topic}`);
    
    res.status(201).json({ 
      success: true, 
      id: result.insertedId,
      message: 'Imagem salva com sucesso!' 
    });
  } catch (error) {
    console.error('❌ Erro ao salvar imagem:', error);
    res.status(500).json({ error: 'Erro ao salvar imagem no banco de dados' });
  }
});

// GET - Buscar todas as imagens
router.get('/images', checkDbConnection, async (req, res) => {
  try {
    const images = await db.collection(COLLECTION_NAME)
      .find({})
      .sort({ createdAt: -1 }) // Ordena por data (mais recentes primeiro)
      .toArray();

    console.log(`✅ ${images.length} imagens carregadas`);
    res.status(200).json(images);
  } catch (error) {
    console.error('❌ Erro ao buscar imagens:', error);
    res.status(500).json({ error: 'Erro ao buscar imagens' });
  }
});

// GET - Buscar imagens por matéria
router.get('/images/subject/:subject', checkDbConnection, async (req, res) => {
  try {
    const { subject } = req.params;
    
    const images = await db.collection(COLLECTION_NAME)
      .find({ subject })
      .sort({ createdAt: -1 })
      .toArray();

    console.log(`✅ ${images.length} imagens de ${subject} carregadas`);
    res.status(200).json(images);
  } catch (error) {
    console.error('❌ Erro ao buscar imagens por matéria:', error);
    res.status(500).json({ error: 'Erro ao buscar imagens' });
  }
});

// DELETE - Deletar uma imagem por ID
router.delete('/images/:id', checkDbConnection, async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const result = await db.collection(COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Imagem não encontrada' });
    }

    console.log(`✅ Imagem deletada: ${id}`);
    res.status(200).json({ 
      success: true, 
      message: 'Imagem deletada com sucesso!' 
    });
  } catch (error) {
    console.error('❌ Erro ao deletar imagem:', error);
    res.status(500).json({ error: 'Erro ao deletar imagem' });
  }
});

export default router;