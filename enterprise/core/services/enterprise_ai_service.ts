
import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
    try {
      // @ts-ignore
      const key = import.meta.env.VITE_GEMINI_API_KEY;
      if (key) return key;
    } catch (e) {
      console.warn("Vite Env Access Failed", e);
    }
    return ""; // Fail gracefully if no key
};

const API_KEY = getApiKey();
const genAI = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Enterprise AI Orchestrator
 * Handles complex reasoning tasks with strict JSON output enforcement.
 */
export const EnterpriseAiService = {

  /**
   * Generates a structured analysis based on a professional system prompt.
   * Enforces JSON parsing and error handling.
   */
  async generateAnalysis<T>(prompt: string, fallback: T): Promise<T> {
    if (!API_KEY) {
        console.warn("EnterpriseAI: No API Key. Returning fallback.");
        return fallback;
    }

    try {
      const model = "gemini-2.5-flash"; 
      
      // Wrap user prompt to enforce JSON
      const finalPrompt = `
        ${prompt}
        
        IMPORTANT: Output MUST be valid JSON only. Do not include markdown fencing like \`\`\`json.
      `;

      const response = await genAI.models.generateContent({
        model: model,
        contents: finalPrompt
      });

      const text = response.text || "";
      
      // Clean markdown if model ignores instruction
      const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      return JSON.parse(cleanText) as T;

    } catch (error) {
      console.error("EnterpriseAI Analysis Failed:", error);
      return fallback;
    }
  },

  /**
   * Specialized method for generating streaming text for documents
   * (Not implemented in this iteration, placeholder for DocumentGen)
   */
  async generateDocumentContent(prompt: string): Promise<string> {
      // Implementation for long-form content
      return "";
  }
};
