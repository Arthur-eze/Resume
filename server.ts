import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

console.log('Available Environment Variables:', Object.keys(process.env).filter(k => !k.startsWith('npm_') && !k.startsWith('NODE_')));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getNvidiaAI = () => {
  const key = process.env.NVIDIA_API_KEY;
  console.log('Checking NVIDIA_API_KEY:', key ? 'Found' : 'Not Found');
  if (!key) return null;
  return new OpenAI({
    apiKey: key.startsWith('Bearer ') ? key.split(' ')[1] : key,
    baseURL: 'https://integrate.api.nvidia.com/v1',
  });
};

async function generateJSON(prompt: string, schema: any): Promise<any> {
  const nvidia = getNvidiaAI();

  if (nvidia) {
    const response = await nvidia.chat.completions.create({
      model: "meta/llama-3.1-405b-instruct",
      messages: [
        { role: "system", content: "You are a professional resume assistant. Always respond with valid JSON matching the requested schema." },
        { role: "user", content: `${prompt}\n\nPlease return the response as a JSON object matching this schema: ${JSON.stringify(schema)}` }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content || "{}");
  }

  throw new Error(`NVIDIA_API_KEY not found on server. Please ensure it is set in the Secrets menu.`);
}

async function startServer() {
  console.log('Starting server initialization...');
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Request logger
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Debug Route
  app.get("/api/debug/env", (req, res) => {
    console.log('Debug route hit');
    res.json({
      keys: Object.keys(process.env).filter(k => !k.startsWith('npm_') && !k.startsWith('NODE_')),
      hasGemini: !!process.env.GEMINI_API_KEY,
      hasNvidia: !!process.env.NVIDIA_API_KEY,
      nodeEnv: process.env.NODE_ENV,
    });
  });

  // API Routes
  app.post("/api/ai/:action", async (req, res) => {
    const { action } = req.params;
    console.log(`POST /api/ai/${action} hit`);
    try {
      const { prompt, schema } = req.body;
      const result = await generateJSON(prompt, schema);
      res.json(result);
    } catch (error: any) {
      console.error(`Error in /api/ai/${action}:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log('Initializing Vite middleware...');
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log('Vite middleware initialized');
    } catch (e) {
      console.error('Failed to initialize Vite middleware:', e);
    }
  } else {
    console.log('Serving static files from dist/');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is listening on 0.0.0.0:${PORT}`);
  });
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
