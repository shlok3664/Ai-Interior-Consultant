import React, { useState, useEffect } from 'react';
import { DEFAULT_AGENT_SYSTEM_INSTRUCTION } from '../constants';

interface AgentCustomizerProps {
    isOpen: boolean;
    onClose: () => void;
    currentInstruction: string;
    onSave: (newInstruction: string) => void;
}

export const AgentCustomizer: React.FC<AgentCustomizerProps> = ({ isOpen, onClose, currentInstruction, onSave }) => {
    const [instruction, setInstruction] = useState(currentInstruction);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setInstruction(currentInstruction);
            setIsClosing(false);
        }
    }, [currentInstruction, isOpen]);

    if (!isOpen && !isClosing) {
        return null;
    }

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 300); // Match animation duration
    };

    const handleSave = () => {
        onSave(instruction);
        handleClose();
    };

    const handleReset = () => {
        setInstruction(DEFAULT_AGENT_SYSTEM_INSTRUCTION);
    };

    const animationClass = isOpen && !isClosing ? 'animate-fade-in-up' : 'animate-fade-out-down';

    return (
        <div 
            className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
            onClick={handleClose}
        >
            <style>
                {`
                    @keyframes fade-out-down {
                        from { opacity: 1; transform: translateY(0); }
                        to { opacity: 0; transform: translateY(20px); }
                    }
                    .animate-fade-out-down { animation: fade-out-down 0.3s ease-out forwards; }
                `}
            </style>
            <div 
                className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full transition-all duration-300 ${animationClass}`} 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Customize Your AI Agent</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Define the personality and expertise of your design consultant by editing its system instructions.
                    </p>
                </div>
                <div className="p-6">
                    <textarea
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                        className="w-full h-48 p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                        placeholder="e.g., You are a witty interior designer who loves puns and focuses on budget-friendly ideas."
                    />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl flex justify-between items-center">
                    <button
                        onClick={handleReset}
                        className="text-sm font-semibold text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 transition-all active:scale-95"
                    >
                        Reset to Default
                    </button>
                    <div className="space-x-2">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-all active:scale-95 dark:bg-slate-600 dark:text-slate-100 dark:border-slate-500 dark:hover:bg-slate-500"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all active:scale-95"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};