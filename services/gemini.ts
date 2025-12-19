
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  /*
   * According to latest guidelines, we create a new GoogleGenAI instance right before
   * making an API call to ensure we always use the most current API key from the context.
   */

  async generateDescription(itemName: string, condition: string): Promise<string> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a catchy, student-friendly 2-sentence description for a "${condition}" condition "${itemName}" to be sold on a college campus marketplace. Mention why it's a good deal for a student.`,
        config: {
          temperature: 0.7,
        },
      });
      /* Use the .text property directly instead of a method call */
      return response.text || "No description generated.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Unable to generate description at this time.";
    }
  }

  async suggestPrice(itemName: string, condition: string): Promise<number> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Suggest a fair second-hand price (in USD) for a "${condition}" condition "${itemName}" on a college campus. Return only the number.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              price: { type: Type.NUMBER }
            },
            required: ['price']
          }
        },
      });
      /* Use the .text property directly */
      const data = JSON.parse(response.text || '{"price": 0}');
      return data.price;
    } catch (error) {
      console.error("Gemini Price Suggestion Error:", error);
      return 0;
    }
  }
}

export const geminiService = new GeminiService();
