// Fix: Populated with constants used throughout the application.
import type { DesignStyle } from './types';

export const DESIGN_STYLES: DesignStyle[] = [
  { name: 'Modern', prompt: 'A modern and minimalist interior design, clean lines, simple color palette, and materials like metal, glass, and steel.' },
  { name: 'Minimalist', prompt: 'A minimalist interior design, simplicity, clean lines, and a monochromatic palette with color used as an accent.' },
  { name: 'Industrial', prompt: 'An industrial interior design, raw and unfinished look, exposed brick, ductwork, and wood.' },
  { name: 'Scandinavian', prompt: 'A Scandinavian interior design, simplicity, minimalism, and functionality, with a gentle and airy feel.' },
  { name: 'Bohemian', prompt: 'A Bohemian interior design, carefree and adventurous, with a mix of patterns, textures, and colors.' },
  { name: 'Mid-Century Modern', prompt: 'A Mid-Century Modern interior design, retro-nostalgic feel, with organic shapes, and a focus on functionality.' },
  { name: 'Coastal', prompt: 'A Coastal interior design, light, airy, and beachy feel, with a color palette of white, blue, and sand.' },
];

export const DEFAULT_AGENT_SYSTEM_INSTRUCTION = "You are an expert interior designer. Your goal is to help users visualize and refine their dream space. Be helpful, creative, and provide insightful suggestions. If the user asks for an edit, provide a concise confirmation that you are processing it. If they ask a question, provide a detailed and helpful answer.";

export const COUNTRIES: string[] = [
    "United States", "Japan", "Brazil", "Italy", "Sweden", "India", "Morocco", "Australia", "Mexico", "South Korea"
];

export const LOADING_TEXTS_IMAGE = [
    "Reimagining your space...",
    "Consulting with our AI designer...",
    "Painting with pixels...",
    "Finding the perfect virtual furniture...",
    "Generating your new look..."
];

export const LOADING_TEXTS_PRICE = [
    "Scanning the room for items...",
    "Checking virtual price tags...",
    "Estimating costs for your area...",
    "Compiling your budget report...",
];