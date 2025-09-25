import { createContext, useContext, useMemo, useState, useCallback } from "react";

const QuoteContext = createContext(null);

const initialState = {
  plate: "",
  brand: "",
  model: "",
  year: "",
  step: 1,
  fromGeran: false,
};

export function QuoteProvider({ children }) {
  const [quoteDraft, setQuoteDraft] = useState(initialState);

  const resetQuote = useCallback(() => {
    setQuoteDraft(initialState);
  }, []);
  const value = useMemo(
    () => ({ quoteDraft, setQuoteDraft, resetQuote }),
    [quoteDraft, resetQuote]
  );
  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used within QuoteProvider");
  return ctx;
}
