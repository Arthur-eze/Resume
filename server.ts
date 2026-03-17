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

const getGeminiAI = () => {
  const key = process.env.GEMINI_API_KEY;
  console.log('Checking GEMINI_API_KEY:', key ? 'Found' : 'Not Found');
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
};

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
  const gemini = getGeminiAI();

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

  if (gemini) {
    const response = await gemini.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text);
  }

  const missing = [];
  if (!process.env.GEMINI_API_KEY) missing.push('GEMINI_API_KEY');
  if (!process.env.NVIDIA_API_KEY) missing.push('NVIDIA_API_KEY');
  
  throw new Error(`No AI API Key found. Checked: ${missing.join(', ')}. Please ensure these are set in the Secrets menu.`);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/ai/parse", async (req, res) => {
    try {
      const { input, schema } = req.body;
      const result = await generateJSON(input, schema);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/evaluate", async (req, res) => {
    try {
      const { prompt, schema } = req.body;
      const result = await generateJSON(prompt, schema);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/refine", async (req, res) => {
    try {
      const { prompt, schema } = req.body;
      const result = await generateJSON(prompt, schema);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
