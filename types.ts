
// Fix: Populated with type definitions used throughout the application.

export type AppMode = 'singleRoom' | 'floorPlan' | 'trends' | 'palette';

export type ChatMode = 'edit' | 'chat';

export interface DesignStyle {
  name: string;
  prompt: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export interface TrendReportData {
    text: string;
    imageUrl: string;
}

export interface Palette {
    name: string;
    colors: string[];
}

export interface PriceReportItem {
    item: string;
    description: string;
    priceRange: string;
}

export type PriceReport = PriceReportItem[];

export interface WishlistItem extends PriceReportItem {
    id: string;
}
