
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  }

  async generateDescription(title: string, condition: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a professional campus marketplace seller. Generate a catchy, concise, and persuasive description for a "${condition}" ${title}. Focus on features students care about.`,
      });
      return response.text || "No description generated.";
    } catch (error) {
      console.error('Gemini Description Error:', error);
      return "An error occurred while generating the description.";
    }
  }

  async suggestPrice(title: string, condition: string): Promise<number> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Suggest a fair second-hand price in Nigerian Naira (₦) for a "${condition}" ${title} being sold on a university campus. Return only the number.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.NUMBER,
            description: "The suggested price value"
          }
        }
      });
      return parseFloat(response.text || "0");
    } catch (error) {
      console.error('Gemini Price Error:', error);
      return 0;
    }
  }

  // Updated to include sources from googleSearch grounding chunks as required by the UI
  async getSmartAdvice(query: string, history: any[]) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: {
          tools: [{googleSearch: {}}],
          systemInstruction: "You are the Sellit Campus Assistant. Help students with buying/selling advice, pricing, and safety tips. Be friendly and use campus slang occasionally."
        }
      });
      
      // Extract grounding sources from grounding metadata for web results
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.filter(chunk => chunk.web)
        ?.map(chunk => ({
          web: {
            uri: chunk.web!.uri,
            title: chunk.web!.title
          }
        }));

      return { 
        text: response.text || "I'm not sure how to help with that.",
        sources: sources || []
      };
    } catch (error) {
      console.error('Gemini Advice Error:', error);
      return { 
        text: "I'm having trouble connecting to my brain right now!",
        sources: [] 
      };
    }
  }
}

export const geminiService = new GeminiService();
