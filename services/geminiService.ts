
// Fix: Implemented Gemini service to handle API calls according to guidelines.
import { GoogleGenAI, Modality, GenerateContentResponse, Chat, Type, Part } from '@google/genai';
import type { DesignStyle, ChatMessage, Palette, PriceReport } from '../types';

let ai: GoogleGenAI;

const getAI = () => {
    if (!ai) {
        // Correct initialization with named parameter
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    }
    return ai;
};

// Function to reset the AI instance, useful if the key changes
export const resetAI = () => {
    // A new instance will be created on the next getAI() call.
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
}

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64.split(',')[1],
      mimeType
    },
  };
};

export const generateImage = async (base64Image: string, mimeType: string, style: DesignStyle): Promise<string> => {
    const ai = getAI();
    const imagePart = fileToGenerativePart(base64Image, mimeType);
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                imagePart,
                { text: style.prompt }
            ]
        },
        config: {
            responseModalities: [Modality.IMAGE],
        }
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }

    throw new Error('No image generated.');
};


export const editImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
    const ai = getAI();
    const imagePart = fileToGenerativePart(base64Image, mimeType);
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                imagePart,
                { text: prompt }
            ]
        },
        config: {
            responseModalities: [Modality.IMAGE],
        }
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    
    throw new Error('No image edited.');
};


export const startChat = (systemInstruction: string): Chat => {
    const ai = getAI();
    const chat = ai.chats.create({
        model: 'gemini-2.5-pro',
        config: {
            systemInstruction: systemInstruction,
        }
    });
    return chat;
};

export const sendMessage = async (chat: Chat, message: string, history: ChatMessage[], imageBase64?: string, mimeType?: string): Promise<string> => {
    
    const parts: Part[] = [{ text: message }];
    if (imageBase64 && mimeType) {
        parts.unshift(fileToGenerativePart(imageBase64, mimeType));
    }

    // Fix: The `chat.sendMessage` method expects an array of Parts directly.
    const response: GenerateContentResponse = await chat.sendMessage(parts);
    return response.text;
};

export const generateTrendReport = async (country: string): Promise<{ text: string; imageUrl: string }> => {
    const ai = getAI();
    const textPrompt = `Generate a concise trend report for interior design in ${country}. The report should include:
- A main heading '## Key Characteristics'. Under this, list 3-4 bullet points of the defining features.
- A main heading '## Color Palette'. Under this, list 3-4 bullet points describing the popular colors.
- A main heading '## Materials and Textures'. Under this, list 3-4 bullet points of common materials.
Format the output as simple markdown with '##' for headings and '*' for bullet points.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: `Generate a visually appealing mood board image that represents the current interior design trends in ${country}.` },
                { text: textPrompt }
            ]
        },
        config: {
            responseModalities: [Modality.IMAGE],
        }
    });
    
    let text = '';
    let imageUrl = '';

    for (const part of response.candidates[0].content.parts) {
        if (part.text) {
            text = part.text;
        } else if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    
    if (!text || !imageUrl) {
        throw new Error('Failed to generate trend report.');
    }
    
    return { text, imageUrl };
};

export const analyzeFloorPlan = async (base64Image: string, mimeType: string): Promise<string[]> => {
    const ai = getAI();
    const imagePart = fileToGenerativePart(base64Image, mimeType);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: {
            parts: [
                imagePart,
                { text: "Analyze this floor plan image. Identify the names of all distinct rooms and labeled areas (e.g., 'Living Room', 'Kitchen', 'Bedroom 1', 'Patio', 'W.I.C.'). Use architectural common sense: expand common abbreviations (e.g., 'M. Bed' to 'Master Bedroom', 'W.I.C' to 'Walk-in Closet'), identify unlabeled but obvious areas like hallways or foyers if they are distinct, and group open-plan spaces logically. Also, identify attached outdoor spaces like balconies or patios. Ignore any dimension lines, furniture labels, or technical annotations. Return the names as a single, clean JSON array of strings. For example: [\"Living Room\", \"Kitchen\", \"Master Bedroom\", \"Walk-in Closet\", \"Balcony\"]. Do not include any other text, formatting, or markdown." }
            ]
        },
    });

    try {
        const jsonText = response.text.trim().replace(/```json|```/g, '');
        const rooms = JSON.parse(jsonText);
        if (Array.isArray(rooms) && rooms.every(r => typeof r === 'string')) {
            return rooms;
        }
        return [];
    } catch (e) {
        console.error("Failed to parse rooms from floor plan:", e);
        return [];
    }
};

const PALETTE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: 'A creative name for the color palette inspired by the image.' },
        colors: {
            type: Type.ARRAY,
            description: 'An array of 5 hex color codes that are dominant and harmonious in the image.',
            items: { type: Type.STRING }
        }
    },
    required: ['name', 'colors']
};

export const generatePalette = async (base64Image: string, mimeType: string): Promise<Palette> => {
    const ai = getAI();
    const imagePart = fileToGenerativePart(base64Image, mimeType);
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: {
            parts: [
                imagePart,
                { text: "Analyze the colors in this image and generate a cohesive color palette. The palette should have a creative name and include 5 hex color codes. Provide the response in the specified JSON format." }
            ]
        },
        config: {
            responseMimeType: 'application/json',
            responseSchema: PALETTE_SCHEMA
        }
    });

    try {
        const jsonText = response.text.trim();
        const palette = JSON.parse(jsonText);
        return palette;
    } catch (e) {
        console.error("Failed to parse palette:", e);
        throw new Error("Could not generate a color palette.");
    }
}

export const generateComplementaryPalette = async (baseColor: string): Promise<Palette> => {
    const ai = getAI();
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `Generate a new, harmonious 5-color interior design palette that complements the base color ${baseColor}. The first color in the array must be the provided base color. Give the palette a creative name.`,
        config: {
            responseMimeType: 'application/json',
            responseSchema: PALETTE_SCHEMA
        }
    });

    try {
        const jsonText = response.text.trim();
        const palette = JSON.parse(jsonText);
        return palette;
    } catch (e) {
        console.error("Failed to parse complementary palette:", e);
        throw new Error("Could not generate a complementary palette.");
    }
};

const PRICE_ANALYSIS_SCHEMA = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            item: { type: Type.STRING, description: 'The name of the furniture or decor item.' },
            description: { type: Type.STRING, description: 'A brief, one-sentence description of the item.' },
            priceRange: { type: Type.STRING, description: 'The estimated price range for this item in USD (e.g., "$500 - $1500").' }
        },
        required: ['item', 'description', 'priceRange']
    }
};

export const analyzeImageForPrice = async (base64Image: string, mimeType: string, location: string): Promise<PriceReport> => {
    const ai = getAI();
    const imagePart = fileToGenerativePart(base64Image, mimeType);
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: {
            parts: [
                imagePart,
                { text: `Analyze this image of a redesigned room. Identify 5-7 key furniture and decor items. For each item, provide a brief description and an estimated price range in USD, appropriate for the following location: ${location}. Base your estimates on typical consumer-grade products, not high-end luxury goods. Return the result as a JSON object adhering to the specified schema.` }
            ]
        },
        config: {
            responseMimeType: 'application/json',
            responseSchema: PRICE_ANALYSIS_SCHEMA
        }
    });

    try {
        const jsonText = response.text.trim();
        const report = JSON.parse(jsonText);
        return report;
    } catch (e) {
        console.error("Failed to parse price report:", e);
        throw new Error("Could not generate a price report.");
    }
};
