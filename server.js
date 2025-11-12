const express = require('express');
const { GoogleGenAI } = require('@google/genai'); //SKD do gemini
const jwt = require('jsonwebtoken');
const dontenv = require('dotenv');
const cors = require('cors');
// const { default: ImageGenerator } = require('./gen_image');
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const dotenv = require("dotenv");
dotenv.config();

import generateImage  from "./gen_image.js";
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/generate-image", async (req, res) => {
  const { prompt } = req.body;

  try {
    const imageBase64 = await generateImage(prompt);
    console.log(imageBase64);
    res.json({ base64Image: imageBase64 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar imagem" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Servidor rodando na porta 3000");
});
