import React from 'react';

interface RoomSelectorProps {
    rooms: string[];
    selectedRoom: string | null;
    onSelectRoom: (room: string) => void;
    disabled: boolean;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

export const RoomSelector: React.FC<RoomSelectorProps> = ({ rooms, selectedRoom, onSelectRoom, disabled }) => {
    if (rooms.length === 0) {
        return (
            <div className="text-center p-4 bg-amber-100 border border-amber-200 rounded-lg text-amber-900 dark:bg-amber-900/20 dark:border-amber-700/50 dark:text-amber-300 animate-fade-in-up">
                <p className="font-semibold">Could not identify distinct rooms.</p>
                <p className="text-sm mt-1">Please try a clearer floor plan or continue by selecting a style for a general visualization of the main area.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-wrap gap-3 p-2 justify-center">
                {rooms.map((room, index) => {
                    const isSelected = selectedRoom === room;
                    return (
                        <button
                            key={room}
                            onClick={() => onSelectRoom(room)}
                            disabled={disabled}
                            className={`flex items-center justify-center px-4 py-2 rounded-lg border text-sm font-semibold transition-all duration-200 transform active:scale-95
                            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                            ${isSelected
                                ? 'bg-indigo-600 text-white border-transparent shadow-md'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-slate-400 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-500 dark:hover:bg-slate-600 dark:hover:border-slate-400'
                            }
                            animate-fade-in-up
                            `}
                            style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
                        >
                            {isSelected && <CheckIcon />}
                            {room}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};