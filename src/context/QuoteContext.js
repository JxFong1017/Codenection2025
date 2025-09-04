import { createContext, useContext, useMemo, useState } from 'react';

const QuoteContext = createContext(null);

export function QuoteProvider({ children }) {
  const [quoteDraft, setQuoteDraft] = useState({
    plate: '',
    brand: '',
    model: '',
    year: '',
    step: 1
  });

  const value = useMemo(() => ({ quoteDraft, setQuoteDraft }), [quoteDraft]);
  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error('useQuote must be used within QuoteProvider');
  return ctx;
}


