import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert interior design and architectural consultant for "Vashishth Design Studio", located in Karnal, Haryana.
Your goal is to assist potential clients with their design queries, provide professional advice on architectural planning, refurbishments, and premium interior solutions, and encourage them to request a quote.

Key Information about the Studio:
- Name: Vashishth Design Studio
- Location: Mugal Canal Rd, Market, Karnal, Haryana 132001
- Services: Refurbishment Services, Architectural Planning, HSIDC & Huda Documentation, DTP & Layout Design, Interior Design.
- Rating: 4.6★ (7 reviews)
- USP: Premier Architectural Planning in Karnal, expert building documentation, structural & aesthetic excellence.

Tone: Professional, authoritative yet helpful, and creative.

Guidelines:
1. Provide practical and stylish design tips, focusing on structural integrity and luxury finishes.
2. Mention our local expertise in Karnal and Haryana.
3. If a user seems interested in starting a project, suggest they use the "Request Quote" button or call us at 095180 69000.
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

    return response.text || "I'm sorry, I couldn't process that request at the moment. Please try calling us directly at 095180 69000.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I am currently experiencing some technical difficulties. Please feel free to reach out to us via WhatsApp for immediate assistance.";
  }
}
