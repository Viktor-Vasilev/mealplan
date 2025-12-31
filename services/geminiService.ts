
import { GoogleGenAI, Type } from "@google/genai";
import { Meal } from "../types";

export const parseMenuWithGemini = async (input: string | { data: string, mimeType: string }): Promise<Meal[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const contents = typeof input === 'string' 
    ? input 
    : { parts: [{ text: "Extract all meal items from this menu image." }, { inlineData: input }] };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Name of the meal" },
            category: { type: Type.STRING, description: "Category like Main, Side, Dessert" },
            description: { type: Type.STRING, description: "Short description" }
          },
          required: ["name"]
        }
      }
    }
  });

  try {
    const rawMeals = JSON.parse(response.text || "[]");
    return rawMeals.map((m: any, index: number) => ({
      ...m,
      id: `meal-${Date.now()}-${index}`
    }));
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
};
