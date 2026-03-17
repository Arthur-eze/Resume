import { GoogleGenAI, Type } from "@google/genai";
import OpenAI from "openai";
import { ResumeData, EvaluationData } from "../types";

const getGeminiAI = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
};

const getNvidiaAI = () => {
  const key = process.env.NVIDIA_API_KEY;
  if (!key) return null;
  return new OpenAI({
    apiKey: key.startsWith('Bearer ') ? key.split(' ')[1] : key,
    baseURL: 'https://integrate.api.nvidia.com/v1',
    dangerouslyAllowBrowser: true
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

  throw new Error('No AI API Key found. Please set GEMINI_API_KEY or NVIDIA_API_KEY in the secrets menu.');
}

export async function parseResumeInput(input: string): Promise<ResumeData> {
  const prompt = `
    Extract resume information from the following natural language input. 
    If some information is missing, use reasonable placeholders or leave empty.
    
    Input:
    ${input}
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      personalInfo: {
        type: Type.OBJECT,
        properties: {
          fullName: { type: Type.STRING },
          email: { type: Type.STRING },
          phone: { type: Type.STRING },
          location: { type: Type.STRING },
          summary: { type: Type.STRING },
        },
        required: ["fullName", "email", "phone", "location", "summary"]
      },
      experience: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            company: { type: Type.STRING },
            position: { type: Type.STRING },
            duration: { type: Type.STRING },
            description: { type: Type.STRING },
          },
          required: ["company", "position", "duration", "description"]
        }
      },
      education: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            school: { type: Type.STRING },
            degree: { type: Type.STRING },
            year: { type: Type.STRING },
          },
          required: ["school", "degree", "year"]
        }
      },
      skills: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      languages: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      hobbies: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    },
    required: ["personalInfo", "experience", "education", "skills", "languages", "hobbies"]
  };

  return generateJSON(prompt, schema);
}

export async function evaluateResume(data: ResumeData): Promise<EvaluationData> {
  const prompt = `
    Evaluate the following resume data based on five criteria: Clarity, Skill, Experience, Education, and Work.
    Provide a score out of 100 for each, an overall score, and a brief professional feedback.
    
    Resume Data:
    ${JSON.stringify(data, null, 2)}
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      overallScore: { type: Type.NUMBER },
      criteria: {
        type: Type.OBJECT,
        properties: {
          clarity: { type: Type.NUMBER },
          skill: { type: Type.NUMBER },
          experience: { type: Type.NUMBER },
          education: { type: Type.NUMBER },
          work: { type: Type.NUMBER },
        },
        required: ["clarity", "skill", "experience", "education", "work"]
      },
      feedback: { type: Type.STRING }
    },
    required: ["overallScore", "criteria", "feedback"]
  };

  return generateJSON(prompt, schema);
}

export async function refineResumeContent(data: ResumeData): Promise<ResumeData> {
  const prompt = `
    Refine the following resume content to be more professional and impactful. 
    Keep the same structure but improve the language, especially the summary and experience descriptions.
    
    Resume Data:
    ${JSON.stringify(data, null, 2)}
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      personalInfo: {
        type: Type.OBJECT,
        properties: {
          fullName: { type: Type.STRING },
          email: { type: Type.STRING },
          phone: { type: Type.STRING },
          location: { type: Type.STRING },
          summary: { type: Type.STRING },
        }
      },
      experience: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            company: { type: Type.STRING },
            position: { type: Type.STRING },
            duration: { type: Type.STRING },
            description: { type: Type.STRING },
          }
        }
      },
      education: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            school: { type: Type.STRING },
            degree: { type: Type.STRING },
            year: { type: Type.STRING },
          }
        }
      },
      skills: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      languages: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      hobbies: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    },
    required: ["personalInfo", "experience", "education", "skills", "languages", "hobbies"]
  };

  return generateJSON(prompt, schema);
}
