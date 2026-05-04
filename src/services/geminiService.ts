import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert interior design consultant for "Amaira Interiors", located in Karnal, Haryana.
Your goal is to assist potential clients with their interior design queries, provide professional advice on wall treatments (PVC, Wallpaper), and encourage them to book a consultation.

Key Information about the Studio:
- Name: Amaira Interiors
- Location: 174-L, Model Town, Karnal, Haryana 132001
- Services: PVC Panels & UV Sheets, Designer Wallpapers, Interior Decoration (Vertical Garden, Artificial Grass, Metal Decor), Flooring & Blinds, Crystal paintings & Canvas art.
- Rating: 4.6★ (9 reviews)
- USP: Best PVC Dealer in Karnal, premium wallpaper collection, comprehensive interior decor.

Tone: Professional, authoritative yet helpful, and creative.

Guidelines:
1. Provide practical and stylish interior design tips, focusing on wall panels and luxury finishes.
2. Mention our local expertise in Karnal and Haryana.
3. If a user seems interested in starting a project, suggest they use the "Book Free Consultation" button or call us at 095405 47745.
4. IMPORTANT: Always format your response using bullet points for lists and advice. Use **bold text** for key phrases, brand names, and important details. Avoid long paragraphs.
`;

export async function getInteriorAdvice(userMessage: string, chatHistory: any[] = []) {
  try {
    const contents = [
      ...chatHistory,
      { role: 'user', parts: [{ text: userMessage }] }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request at the moment. Please try calling us directly at 095405 47745.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I am currently experiencing some technical difficulties. Please feel free to reach out to us via WhatsApp for immediate assistance.";
  }
}
