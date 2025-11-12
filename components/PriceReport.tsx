
import React from 'react';
import type { PriceReport, PriceReportItem, WishlistItem } from '../types';

interface PriceReportProps {
  report: PriceReport;
  onAddToWishlist: (item: PriceReportItem) => void;
  wishlist: WishlistItem[];
  disabled: boolean;
}

const AddIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

export const PriceReportDisplay: React.FC<PriceReportProps> = ({ report, onAddToWishlist, wishlist, disabled }) => {
    if (!report || report.length === 0) {
        return <p>No price report available.</p>;
    }

    const isInWishlist = (item: PriceReportItem) => {
        return wishlist.some(w => w.item === item.item && w.description === item.description);
    };

    return (
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 animate-fade-in-up mt-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 text-center">Estimated Budget Report</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100/50 dark:bg-slate-700/50 dark:text-slate-300">
                        <tr>
                            <th scope="col" className="px-6 py-3 rounded-l-lg">Item</th>
                            <th scope="col" className="px-6 py-3">Description</th>
                            <th scope="col" className="px-6 py-3">Estimated Price (USD)</th>
                            <th scope="col" className="px-6 py-3 rounded-r-lg text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.map((item, index) => (
                            <tr key={index} className="bg-white/80 dark:bg-slate-800/80 border-b dark:border-slate-700/80 last:border-0">
                                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">{item.item}</th>
                                <td className="px-6 py-4">{item.description}</td>
                                <td className="px-6 py-4 font-semibold">{item.priceRange}</td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => onAddToWishlist(item)}
                                        disabled={disabled || isInWishlist(item)}
                                        className={`flex items-center justify-center w-full px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 
                                            ${isInWishlist(item)
                                                ? 'bg-green-100 text-green-700 cursor-default dark:bg-green-900/50 dark:text-green-300'
                                                : 'bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/50 dark:text-violet-300 dark:hover:bg-violet-900/80 disabled:opacity-50'
                                            }`}
                                    >
                                        {isInWishlist(item) ? <><CheckIcon /> Added</> : <><AddIcon /> Add</>}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
