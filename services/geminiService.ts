import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { fetchDoctorData } from './sheetService';

// Helper to get a fresh client instance (in case key changes, though env is static usually)
const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePlanResponse = async (
  userMessage: string, 
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  const ai = getClient();
  
  // 1. Fetch fresh data from the sheet
  let sheetContext = "";
  try {
    const jsonData = await fetchDoctorData();
    sheetContext = `\n\n--- LIVE DOCTOR DATABASE ---\n${jsonData}\n----------------------------\n\n`;
  } catch (e: any) {
    sheetContext = `\n\n[SYSTEM ERROR]: Could not fetch live data. Error: ${e.message}\n\n`;
  }

  // 2. Get Current Date & Time
  const now = new Date();
  const currentDateTime = now.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
  
  // Explicitly tell the model the current time
  const timeContext = `\n\n--- CURRENT DATE & TIME (Use this for planning) ---\n${currentDateTime}\n---------------------------------------------------\n`;

  // 3. Prepare the prompt
  // We inject the fresh data and time into the latest message.
  const augmentedMessage = `${userMessage}\n${sheetContext}${timeContext}`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            ...history, // Previous conversation context
            {
                role: 'user',
                parts: [{ text: augmentedMessage }]
            }
        ],
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7, // Balanced creativity/accuracy
        }
    });

    return response.text || "I couldn't generate a plan at this moment. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};