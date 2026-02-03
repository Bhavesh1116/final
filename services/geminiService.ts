
import { GoogleGenAI, Type } from "@google/genai";
import { MENU_ITEMS, RESTAURANT_INFO } from '../constants';

// Fix: Always initialize with process.env.API_KEY and assume it is pre-configured per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- 1. Dish Recommendation ---
export const getDishRecommendation = async (userMood: string) => {
  const menuContext = MENU_ITEMS.map(item => 
    `${item.id}: ${item.name} (${item.category}) - ${item.description}. Tags: ${item.isVegetarian ? 'Veg' : 'Non-Veg'}.`
  ).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a knowledgeable server at "Swan Oyster Depot", a historic seafood counter in San Francisco since 1912.
      
      Key Traits:
      1. We are famous for fresh seafood, especially Crab Back and Oysters.
      2. We are CASH ONLY.
      3. The atmosphere is casual, no-frills, and historic.
      4. We do not take reservations.
      
      Menu:
      ${menuContext}

      Customer Mood: "${userMood}"

      Task: Recommend 1-3 dishes.
      Output: JSON only.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendationText: { type: Type.STRING },
            recommendedDishIds: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    // Access the text property directly as per guidelines
    if (response.text) return JSON.parse(response.text);
    throw new Error("No response");
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      recommendationText: "You can't go wrong with our Mixed Oysters.",
      recommendedDishIds: ['1']
    };
  }
};

// --- 2. General Agent (Conversational) ---
export const askRestaurantAgent = async (question: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: `User Question: "${question}"
      
      Context: You are the concierge at "Swan Oyster Depot" located at 1517 Polk St, San Francisco, CA.
      Important Info: We are CASH ONLY. We are closed on Sundays. We are open Mon-Sat 8am-2:30pm.
      
      Use Google Maps to find the answer if it relates to location, traffic, or nearby places.
      `,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    // Access the text property directly as per guidelines
    let answer = response.text || "I couldn't find that information.";

    if (groundingMetadata?.groundingChunks) {
      const links = groundingMetadata.groundingChunks
        .map((chunk: any) => chunk.web?.uri || chunk.maps?.uri)
        .filter(Boolean);
      
      if (links.length > 0) {
        answer += `\n\n(Source: Google Maps)`;
      }
    }

    return answer;

  } catch (error) {
    console.error("Maps Agent Error:", error);
    return "I am currently having trouble accessing the map satellites. Note that we are open Mon-Sat until 2:30 PM.";
  }
};

// --- 3. Live Dashboard Status (One-Click Real-Time Check) ---
export const getLiveStatus = async (): Promise<{text: string, source: string | null}> => {
   try {
     const response = await ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: `What is the current traffic situation around Swan Oyster Depot (1517 Polk St, SF) right now? 
       Use Google Maps to verify traffic on Polk Street.
       
       Task: Provide a short, punchy status update (max 30 words) for a website dashboard. 
       Format: "🚦 Traffic: [Heavy/Light]. 📍 Vibe: [Description]."`,
       config: {
         tools: [{ googleMaps: {} }],
       },
     });
     
     // Access the text property directly as per guidelines
     const text = response.text || "Traffic info currently unavailable.";
     
     // Extract Google Maps Source Link from grounding chunks
     const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
     let source: string | null = null;
     
     if (chunks) {
        const mapChunk = chunks.find((c: any) => c.maps?.uri);
        if (mapChunk?.maps?.uri) {
           source = mapChunk.maps.uri;
        }
     }

     return { text, source };

   } catch (error) {
     console.error("Live Status Error:", error);
     return { text: "Unable to connect to live satellites. Assume a wait exists!", source: null };
   }
};
