
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Always use process.env.API_KEY directly when initializing the client as per instructions.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const aiService = {
  /**
   * Generates metadata for a bookmark URL if the user hasn't provided details.
   */
  async getBookmarkMetadata(url: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a title, a brief description, and 3 relevant tags for this URL: ${url}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "description", "tags"]
        }
      }
    });

    try {
      // Fix: Access response.text property directly as it is a getter, do not call it as a method.
      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("Failed to parse AI response", e);
      return null;
    }
  },

  /**
   * Suggests tags for a note based on its content.
   */
  async suggestTagsForNote(title: string, content: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest 3 to 5 concise tags for a note with the following title and content:
      Title: ${title}
      Content: ${content}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["tags"]
        }
      }
    });

    try {
      // Fix: Access response.text property directly.
      return JSON.parse(response.text || '{}').tags || [];
    } catch (e) {
      return [];
    }
  }
};
