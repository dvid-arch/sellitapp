
import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import { protect } from '../middleware/auth';

const router = express.Router();

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

// Use any for req/res to satisfy RequestHandler contravariance and avoid DOM type collisions
router.post('/optimize-listing', protect, async (req: any, res: any) => {
  const { title, condition, category } = req.body;
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a catchy description and fair price in Naira for a student selling a "${condition}" ${title} in the ${category} category on campus.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            suggestedPrice: { type: Type.NUMBER }
          },
          required: ['description', 'suggestedPrice']
        }
      }
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (error) {
    res.status(500).json({ error: 'AI Optimization failed' });
  }
});

export default router;
