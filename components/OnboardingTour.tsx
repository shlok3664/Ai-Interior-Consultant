import React, { useState, useEffect, useLayoutEffect } from 'react';

type TourStep = {
  target: string; // This will be the key in the refs object
  content: React.ReactNode;
  position: 'top' | 'bottom' | 'left' | 'right';
};

interface OnboardingTourProps {
  run: boolean;
  onComplete: () => void;
  refs: {
    [key: string]: React.RefObject<HTMLElement>;
  };
}

const TOUR_STEPS: TourStep[] = [
  {
    target: 'styleCarouselRef',
    content: 'Great! Now, choose a design style from this carousel to instantly reimagine your space.',
    position: 'bottom',
  },
  {
    target: 'imageComparatorRef',
    content: 'Your original photo and the new AI-generated design will appear here. Once a design is ready, a chat window will appear below for you to refine it further!',
    position: 'top', // Changed to 'top' for a better default position
  },
];

const getElementRect = (element: HTMLElement | null): DOMRect | null => {
    if (!element) return null;
    return element.getBoundingClientRect();
};

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ run, onComplete, refs }) => {
    const [stepIndex, setStepIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    
    const currentStep = TOUR_STEPS[stepIndex];
    const [currentPosition, setCurrentPosition] = useState(currentStep.position);

    useEffect(() => {
        setIsVisible(run);
        if (run) {
            setStepIndex(0);
        }
    }, [run]);
    
    // This effect dynamically adjusts the tooltip position to stay within the viewport
    useLayoutEffect(() => {
        if (!isVisible || !currentStep) return;

        const targetElement = refs[currentStep.target]?.current;
        if (!targetElement) return;

        const targetRect = getElementRect(targetElement);
        if (!targetRect) return;

        const preferredPosition = TOUR_STEPS[stepIndex].position;
        let newPosition = preferredPosition;

        const tooltipHeight = 160; // Approximate height of the tooltip box in pixels
        const margin = 10; // Margin from the element

        const { innerHeight } = window;

        // If preferred is bottom but it overflows, switch to top
        if (preferredPosition === 'bottom' && targetRect.bottom + tooltipHeight + margin > innerHeight) {
            newPosition = 'top';
        } 
        // If preferred is top but it overflows, switch to bottom
        else if (preferredPosition === 'top' && targetRect.top - tooltipHeight - margin < 0) {
            newPosition = 'bottom';
        }
        
        setCurrentPosition(newPosition);

    }, [stepIndex, isVisible, refs, currentStep]);

    const handleNext = () => {
        if (stepIndex < TOUR_STEPS.length - 1) {
            setStepIndex(stepIndex + 1);
        } else {
            handleComplete();
        }
    };
    
    const handleBack = () => {
        if (stepIndex > 0) {
            setStepIndex(stepIndex - 1);
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        onComplete();
    };

    useEffect(() => {
        if (isVisible && currentStep) {
            const targetElement = refs[currentStep.target]?.current;
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [stepIndex, isVisible, currentStep, refs]);

    if (!isVisible || !currentStep) {
        return null;
    }

    const targetElement = refs[currentStep.target]?.current;
    
    if (!targetElement) {
      return null;
    }
    
    const targetRect = getElementRect(targetElement);

    if (!targetRect) return null;
    
    const tooltipStyle: React.CSSProperties = {
        position: 'absolute',
        zIndex: 10001,
        ...getPositionStyles(targetRect, currentPosition) // Use the dynamically calculated position
    };
    
    const highlightStyle: React.CSSProperties = {
        position: 'fixed',
        top: `${targetRect.top - 4}px`,
        left: `${targetRect.left - 4}px`,
        width: `${targetRect.width + 8}px`,
        height: `${targetRect.height + 8}px`,
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
        borderRadius: '8px',
        zIndex: 10000,
        pointerEvents: 'none',
        transition: 'all 0.3s ease-in-out',
    };

    return (
        <div className="fixed inset-0 z-[9999]">
            <div style={highlightStyle} />
            <div style={tooltipStyle} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-2xl max-w-xs w-full text-gray-800 dark:text-gray-200">
                <div className="text-sm mb-4">{currentStep.content}</div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{stepIndex + 1} / {TOUR_STEPS.length}</span>
                    <div>
                        {stepIndex > 0 && <button onClick={handleBack} className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white mr-2">Back</button>}
                        <button onClick={handleNext} className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-700">
                            {stepIndex === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>
                 <button onClick={handleComplete} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

function getPositionStyles(rect: DOMRect, position: 'top' | 'bottom' | 'left' | 'right'): React.CSSProperties {
    switch (position) {
        case 'top':
            return { top: rect.top, left: rect.left + rect.width / 2, transform: 'translate(-50%, -100%) translateY(-10px)' };
        case 'bottom':
            return { top: rect.bottom, left: rect.left + rect.width / 2, transform: 'translate(-50%, 0) translateY(10px)' };
        case 'left':
            return { top: rect.top + rect.height / 2, left: rect.left, transform: 'translate(-100%, -50%) translateX(-10px)' };
        case 'right':
            return { top: rect.top + rect.height / 2, left: rect.right, transform: 'translate(0, -50%) translateX(10px)' };
        default:
            return {};
    }
}