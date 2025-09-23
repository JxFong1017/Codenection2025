"use client";
import React, { createContext, useContext } from "react";
import { useRestore } from "../hooks/useRestore";

const QuoteContext = createContext();

export const useQuote = () => useContext(QuoteContext);

export const QuoteProvider = ({ children }) => {
  const [quoteDraft, setQuoteDraft] = useRestore("quoteDraft", {
    plate: "",
    brand: "",
    model: "",
    year: "",
    coverageType: "",
    protections: {},
    name: "",
    ic: "",
    postcode: "",
    ncd: 20,
    fromGeran: false,
  });

  return (
    <QuoteContext.Provider value={{ quoteDraft, setQuoteDraft }}>
      {children}
    </QuoteContext.Provider>
  );
};
