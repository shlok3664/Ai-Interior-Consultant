
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { AppMode, ChatMessage, ChatMode, DesignStyle, Palette, PriceReport, PriceReportItem, TrendReportData, WishlistItem } from './types';
import { AuthGate } from './components/AuthGate';
import { LoginPage } from './components/LoginPage';
import Header from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { ImageUploader } from './components/ImageUploader';
import { StyleCarousel } from './components/StyleCarousel';
import { ImageComparator } from './components/ImageComparator';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ChatInterface } from './components/ChatInterface';
import { CountrySelector } from './components/CountrySelector';
import { TrendReport } from './components/TrendReport';
import { RoomSelector } from './components/RoomSelector';
import { PaletteExplorer } from './components/PaletteExplorer';
import { PriceAnalyzer } from './components/PriceAnalyzer';
import { PriceReportDisplay } from './components/PriceReport';
import { Wishlist } from './components/Wishlist';
import { OnboardingTour } from './components/OnboardingTour';
import { generateImage, editImage, startChat, sendMessage, generateTrendReport, analyzeFloorPlan, generatePalette, generateComplementaryPalette, analyzeImageForPrice, resetAI } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import { DEFAULT_AGENT_SYSTEM_INSTRUCTION, LOADING_TEXTS_IMAGE, LOADING_TEXTS_PRICE, DESIGN_STYLES } from './constants';
import type { Chat } from '@google/genai';

// Fix: Declare aistudio on the window object to satisfy TypeScript, as per the guidelines.
declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const App: React.FC = () => {
    // Auth & App State
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasApiKey, setHasApiKey] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingText, setLoadingText] = useState<string[]>(LOADING_TEXTS_IMAGE);
    const [appMode, setAppMode] = useState<AppMode>('singleRoom');
    const [error, setError] = useState<string | null>(null);

    // Image & Design State
    const [originalImage, setOriginalImage] = useState<{ file: File, base64: string, mimeType: string } | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<DesignStyle | null>(null);
    
    // Chat State
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [chatMode, setChatMode] = useState<ChatMode>('edit');
    const [chatInstance, setChatInstance] = useState<Chat | null>(null);
    const [agentSystemInstruction, setAgentSystemInstruction] = useState(DEFAULT_AGENT_SYSTEM_INSTRUCTION);

    // Floor Plan State
    const [floorPlanRooms, setFloorPlanRooms] = useState<string[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

    // Trends State
    const [trendReport, setTrendReport] = useState<TrendReportData | null>(null);
    const [selectedCountry, setSelectedCountry] = useState<string>('');

    // Palette State
    const [activePalette, setActivePalette] = useState<Palette | null>(null);

    // Price & Wishlist State
    const [priceReport, setPriceReport] = useState<PriceReport | null>(null);
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

    // Tour State
    const [runTour, setRunTour] = useState(false);
    const styleCarouselRef = useRef<HTMLDivElement>(null);
    const imageComparatorRef = useRef<HTMLDivElement>(null);
    
    // API Key Check
    useEffect(() => {
        const checkApiKey = async () => {
            if (isLoggedIn) {
                setIsLoading(true);
                try {
                    const hasKey = await window.aistudio.hasSelectedApiKey();
                    setHasApiKey(hasKey);
                } catch (e) {
                    console.error("aistudio API not available. Running in local mode.", e);
                    setHasApiKey(true); // Assume key is set via env for local dev
                } finally {
                    setIsLoading(false);
                }
            }
        };
        checkApiKey();
    }, [isLoggedIn]);

    const handleApiError = (e: any) => {
        const errorMessage = e.message || 'An unknown error occurred.';
        console.error(errorMessage, e);
        setError(errorMessage);
        if (errorMessage.includes("Requested entity was not found.")) {
            setError("Your API Key is invalid. Please select a new one.");
            setHasApiKey(false);
            resetAI();
        }
    };
    
    const withLoading = async (loaderText: string[], fn: () => Promise<void>) => {
        setIsLoading(true);
        setLoadingText(loaderText);
        setError(null);
        try {
            await fn();
        } catch (e) {
            handleApiError(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectKey = async () => {
        try {
            await window.aistudio.openSelectKey();
            setHasApiKey(true); // Assume success as per guidelines
            resetAI(); // Re-initialize the AI service with the new key
        } catch (e) {
            console.error("Failed to open API key selection:", e);
            setError("Could not open the API key selection dialog.");
        }
    };

    const resetStateForNewUpload = () => {
        setGeneratedImage(null);
        setSelectedStyle(null);
        setChatHistory([]);
        setChatInstance(null);
        setFloorPlanRooms([]);
        setSelectedRoom(null);
        setTrendReport(null);
        setActivePalette(null);
        setPriceReport(null);
        setWishlist([]);
        setRunTour(false);
    };

    const handleImageUpload = useCallback(async (file: File) => {
        resetStateForNewUpload();
        const base64 = await fileToBase64(file);
        const imageData = { file, base64, mimeType: file.type };
        setOriginalImage(imageData);

        if (appMode === 'floorPlan') {
            await withLoading(LOADING_TEXTS_IMAGE, async () => {
                const rooms = await analyzeFloorPlan(imageData.base64, imageData.mimeType);
                setFloorPlanRooms(rooms);
            });
        } else if (appMode === 'palette') {
            await withLoading(LOADING_TEXTS_IMAGE, async () => {
                const palette = await generatePalette(imageData.base64, imageData.mimeType);
                setActivePalette(palette);
            });
        } else if (appMode === 'singleRoom') {
            // Start the tour after image is uploaded in single room mode
            setRunTour(true);
        }
    }, [appMode]);

    const handleStyleSelect = useCallback(async (style: DesignStyle) => {
        if (!originalImage) return;
        setSelectedStyle(style);

        await withLoading(LOADING_TEXTS_IMAGE, async () => {
            const prompt = appMode === 'floorPlan' && selectedRoom 
                ? `Generate an image of a ${selectedRoom} in a ${style.name} style. ${style.prompt}`
                : `Redesign this room in a ${style.name} style. ${style.prompt}`;

            const result = await generateImage(originalImage.base64, originalImage.mimeType, { ...style, prompt });
            setGeneratedImage(result);
            // Reset chat for new design
            setChatHistory([]);
            setChatInstance(startChat(agentSystemInstruction));
        });
    }, [originalImage, appMode, selectedRoom, agentSystemInstruction]);

    const handleSendMessage = useCallback(async (message: string) => {
        if (!chatInstance) return;
        setChatHistory(prev => [...prev, { sender: 'user', text: message }]);

        await withLoading([], async () => {
            let responseText: string;
            if (chatMode === 'edit' && generatedImage) {
                const newImage = await editImage(generatedImage, 'image/png', message);
                setGeneratedImage(newImage);
                responseText = "Here's the updated design.";
            } else {
                responseText = await sendMessage(chatInstance, message, chatHistory);
            }
            setChatHistory(prev => [...prev, { sender: 'bot', text: responseText }]);
        });
    }, [chatInstance, generatedImage, chatMode, chatHistory]);

    const handleSelectCountry = useCallback(async (country: string) => {
        setSelectedCountry(country);
        await withLoading(LOADING_TEXTS_IMAGE, async () => {
            const report = await generateTrendReport(country);
            setTrendReport(report);
        });
    }, []);
    
    const handleGenerateComplementaryPalette = useCallback(async (color: string) => {
        await withLoading(LOADING_TEXTS_IMAGE, async () => {
            const palette = await generateComplementaryPalette(color);
            setActivePalette(palette);
        });
    }, []);

    const handleApplyPalette = useCallback(() => {
        if (activePalette) {
            setAppMode('singleRoom');
            resetStateForNewUpload();
        }
    }, [activePalette]);
    
    const handleAnalyzePrice = useCallback(async (location: string) => {
        if (!generatedImage) return;
        await withLoading(LOADING_TEXTS_PRICE, async () => {
            const report = await analyzeImageForPrice(generatedImage, 'image/png', location);
            setPriceReport(report);
        });
    }, [generatedImage]);
    
    const handleAddToWishlist = (item: PriceReportItem) => {
        const newItem: WishlistItem = { ...item, id: `${item.item}-${Date.now()}` };
        setWishlist(prev => [...prev, newItem]);
    };

    const handleRemoveFromWishlist = (id: string) => {
        setWishlist(prev => prev.filter(item => item.id !== id));
    };

    const renderContent = () => {
        switch (appMode) {
            case 'trends':
                return (
                    <>
                        <CountrySelector onSelectCountry={handleSelectCountry} disabled={isLoading} />
                        {trendReport && <TrendReport report={trendReport} country={selectedCountry} />}
                    </>
                );
            case 'palette':
                return !originalImage ? (
                    <ImageUploader onImageUpload={handleImageUpload} disabled={isLoading} title="Discover a Color Palette" description="Upload any image to extract its color scheme and find complementary colors for your design projects."/>
                ) : (
                    activePalette && <PaletteExplorer sourceImage={originalImage.base64} palette={activePalette} onApplyPalette={handleApplyPalette} onGenerateComplementary={handleGenerateComplementaryPalette} disabled={isLoading} />
                );
            case 'floorPlan':
            case 'singleRoom':
            default:
                return !originalImage ? (
                     <ImageUploader 
                        onImageUpload={handleImageUpload} 
                        disabled={isLoading} 
                        title={appMode === 'floorPlan' ? "Visualize Your Floor Plan" : "Reimagine Your Room"}
                        description={appMode === 'floorPlan' ? "Upload a 2D floor plan image. Our AI will identify the rooms and help you generate design concepts for each space." : "Upload a photo of your room. Our AI will help you redesign it in various styles and refine the details."}
                    />
                ) : (
                    <div className="space-y-8">
                        {appMode === 'floorPlan' && (
                            <RoomSelector rooms={floorPlanRooms} selectedRoom={selectedRoom} onSelectRoom={setSelectedRoom} disabled={isLoading} />
                        )}
                        <div ref={styleCarouselRef}>
                          <StyleCarousel 
                              onStyleSelect={handleStyleSelect} 
                              onCustomStyleSubmit={(prompt) => handleStyleSelect({name: 'Custom', prompt})}
                              disabled={isLoading || (appMode === 'floorPlan' && !selectedRoom)} 
                              selectedStyleName={selectedStyle?.name} 
                              activePalette={activePalette}
                          />
                        </div>
                        <div ref={imageComparatorRef}>
                          <ImageComparator originalImage={originalImage.base64} generatedImage={generatedImage} isProcessing={isLoading}/>
                        </div>
                        {generatedImage && (
                          <>
                            <ChatInterface 
                                chatHistory={chatHistory} 
                                onSendMessage={handleSendMessage}
                                chatMode={chatMode}
                                onSetChatMode={setChatMode}
                                disabled={isLoading}
                                agentSystemInstruction={agentSystemInstruction}
                                onSetAgentSystemInstruction={setAgentSystemInstruction}
                            />
                            <PriceAnalyzer onAnalyze={handleAnalyzePrice} disabled={isLoading} />
                            {priceReport && <PriceReportDisplay report={priceReport} onAddToWishlist={handleAddToWishlist} wishlist={wishlist} disabled={isLoading} />}
                            {wishlist.length > 0 && <Wishlist wishlist={wishlist} onRemoveFromWishlist={handleRemoveFromWishlist} />}
                          </>
                        )}
                    </div>
                );
        }
    };
    
    if (!isLoggedIn) {
        return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
    }
    
    if (!hasApiKey) {
        return <AuthGate onSelectKey={handleSelectKey} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            <div className="relative container mx-auto px-4 py-8 max-w-7xl">
                {isLoading && originalImage && <LoadingSpinner texts={loadingText} />}
                <Header />
                <main>
                    <div className="my-8">
                        <ModeSelector currentMode={appMode} onSelectMode={(m) => { setAppMode(m); resetStateForNewUpload(); }} disabled={isLoading} />
                    </div>
                    {error && (
                        <div className="my-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg text-center dark:bg-red-900/30 dark:border-red-700/50 dark:text-red-300">
                            <strong>Error:</strong> {error}
                        </div>
                    )}
                    {renderContent()}
                </main>
                <OnboardingTour 
                  run={runTour} 
                  onComplete={() => setRunTour(false)}
                  refs={{ styleCarouselRef, imageComparatorRef }}
                />
            </div>
        </div>
    );
};

export default App;
