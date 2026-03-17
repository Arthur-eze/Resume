import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, EvaluationData } from "../types";

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export async function parseResumeInput(input: string): Promise<ResumeData> {
  const prompt = `
    Extract resume information from the following natural language input. 
    If some information is missing, use reasonable placeholders or leave empty.
    
    Input:
    ${input}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
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
      }
    }
  });

  return JSON.parse(response.text);
}

export async function evaluateResume(data: ResumeData): Promise<EvaluationData> {
  const prompt = `
    Evaluate the following resume data based on five criteria: Clarity, Skill, Experience, Education, and Work.
    Provide a score out of 100 for each, an overall score, and a brief professional feedback.
    
    Resume Data:
    ${JSON.stringify(data, null, 2)}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
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
      }
    }
  });

  return JSON.parse(response.text);
}

export async function refineResumeContent(data: ResumeData): Promise<ResumeData> {
  const prompt = `
    Refine the following resume content to be more professional and impactful. 
    Keep the same structure but improve the language, especially the summary and experience descriptions.
    
    Resume Data:
    ${JSON.stringify(data, null, 2)}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
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
      }
    }
  });

  return JSON.parse(response.text);
}
