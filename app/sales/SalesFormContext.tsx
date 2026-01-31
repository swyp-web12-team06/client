'use client';

import { createContext, useContext } from 'react';
import { SalesFormContextType } from './useSalesFormLogic';

export const SalesFormContext = createContext<SalesFormContextType | null>(null);

export function useSalesForm() {
    const context = useContext(SalesFormContext);
    if (context === null) {
        throw new Error('useSalesForm must be used within a SalesFormContext.Provider');
    }
    return context;
}