
import React from 'react';
import type { WishlistItem } from '../types';

interface WishlistProps {
  wishlist: WishlistItem[];
  onRemoveFromWishlist: (id: string) => void;
}

const RemoveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const Wishlist: React.FC<WishlistProps> = ({ wishlist, onRemoveFromWishlist }) => {
    if (wishlist.length === 0) {
        return null; // Don't render if empty
    }

    const calculateTotal = () => {
        const ranges = wishlist.map(item =>
            item.priceRange.replace(/[^0-9-]/g, '').split('-').map(Number)
        );
        const minTotal = ranges.reduce((acc, range) => acc + (range[0] || 0), 0);
        const maxTotal = ranges.reduce((acc, range) => acc + (range[1] || range[0] || 0), 0);
        
        if (minTotal === maxTotal) {
            return `$${minTotal.toLocaleString()}`;
        }
        return `$${minTotal.toLocaleString()} - $${maxTotal.toLocaleString()}`;
    };

    return (
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 animate-fade-in-up mt-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 text-center">My Wishlist</h2>
            <ul className="space-y-3">
                {wishlist.map((item) => (
                    <li key={item.id} className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-700/30 p-3 rounded-lg border border-slate-200/80 dark:border-slate-600/80">
                        <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-100">{item.item}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="font-semibold text-slate-700 dark:text-slate-200">{item.priceRange}</p>
                            <button
                                onClick={() => onRemoveFromWishlist(item.id)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                title="Remove item"
                            >
                                <RemoveIcon />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-600/80 flex justify-end items-center">
                <p className="text-slate-600 dark:text-slate-300 font-semibold">Estimated Total:</p>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-100 ml-3">{calculateTotal()}</p>
            </div>
        </div>
    );
};
