import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, ChatMode } from '../types';
import { AgentCustomizer } from './AgentCustomizer';

interface ChatInterfaceProps {
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  chatMode: ChatMode;
  onSetChatMode: (mode: ChatMode) => void;
  disabled: boolean;
  agentSystemInstruction: string;
  onSetAgentSystemInstruction: (instruction: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chatHistory,
  onSendMessage,
  chatMode,
  onSetChatMode,
  disabled,
  agentSystemInstruction,
  onSetAgentSystemInstruction,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };
  
  const getPlaceholder = () => {
    if (disabled) return "Waiting for response...";
    if (chatMode === 'edit') return "e.g., 'add a plant on the table' or 'change the wall color to light blue'";
    return "e.g., 'Where can I find a similar couch?' or 'What other colors would work here?'";
  };

  return (
    <>
      <div className="bg-white/30 dark:bg-slate-800/30 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden max-w-4xl mx-auto">
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-700/80 flex justify-between items-center bg-slate-50/10 dark:bg-slate-800/10">
          <div className="flex-grow flex justify-center">
            {/* Custom Toggle */}
            <div className="relative flex w-full max-w-sm bg-slate-200/80 dark:bg-slate-700/80 rounded-full p-1">
              <span 
                className={`absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-4px)] bg-white dark:bg-slate-600 shadow-md rounded-full transition-transform duration-300 ease-in-out`}
                style={{ transform: chatMode === 'edit' ? 'translateX(0%)' : 'translateX(100%)' }}
              />
              <button 
                onClick={() => onSetChatMode('edit')}
                className={`relative z-10 w-1/2 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${chatMode === 'edit' ? 'text-violet-600 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}
              >
                ✏️ Edit Image
              </button>
              <button 
                onClick={() => onSetChatMode('chat')}
                className={`relative z-10 w-1/2 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${chatMode === 'chat' ? 'text-violet-600 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}
              >
                💬 Chat About Design
              </button>
            </div>
          </div>
          <button 
            onClick={() => setIsCustomizerOpen(true)}
            title="Customize AI Agent"
            className="ml-2 text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400 p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.227l.268-.108a2.25 2.25 0 012.164 0l.269.108c.55.22.998.685 1.11 1.227l.128.56a2.25 2.25 0 002.434 2.434l.56.128c.542.09.997.56 1.227 1.11l.108.268a2.25 2.25 0 010 2.164l-.108.269c-.22.55-.685.998-1.227 1.11l-.56.128a2.25 2.25 0 00-2.434 2.434l-.128.56c-.09.542-.56 1.007-1.11 1.227l-.268.108a2.25 2.25 0 01-2.164 0l-.269-.108c-.55-.22-.998-.685-1.11-1.227l-.128-.56a2.25 2.25 0 00-2.434-2.434l-.56-.128c-.542-.09-.997-.56-1.227-1.11l-.108-.268a2.25 2.25 0 010-2.164l.108-.269c.22-.55.685-.998 1.227-1.11l.56-.128a2.25 2.25 0 002.434-2.434l.128-.56z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        <div ref={chatContainerRef} className="p-4 h-64 overflow-y-auto bg-slate-50/10 dark:bg-slate-900/10 space-y-4">
          {chatHistory.map((msg, index) => (
            <div key={index} 
                className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                style={{ animationDelay: '0.1s' }}
            >
              <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 shadow-sm ${
                  msg.sender === 'user' 
                  ? 'bg-gradient-to-br from-violet-600 to-rose-500 text-white rounded-t-2xl rounded-bl-2xl' 
                  : 'bg-slate-100 text-slate-800 rounded-t-2xl rounded-br-2xl border border-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {disabled && chatHistory[chatHistory.length - 1]?.sender === 'user' && (
              <div className="flex justify-start">
                  <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-t-2xl rounded-br-2xl bg-white border border-slate-200 text-slate-800 dark:bg-slate-700 dark:border-slate-600">
                      <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                          <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                  </div>
              </div>
          )}
        </div>
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-700/80 bg-white/30 dark:bg-slate-800/30">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={getPlaceholder()}
              disabled={disabled}
              className="flex-grow w-full px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 transition-shadow bg-white/80 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:ring-violet-400"
            />
            <button
              type="submit"
              disabled={disabled || !inputValue.trim()}
              className="bg-gradient-to-br from-violet-500 to-rose-600 text-white rounded-full p-3 shadow-md hover:from-violet-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:from-violet-300 disabled:to-rose-400 disabled:cursor-not-allowed transition-all transform hover:scale-110 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
      <AgentCustomizer 
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        currentInstruction={agentSystemInstruction}
        onSave={onSetAgentSystemInstruction}
      />
    </>
  );
};