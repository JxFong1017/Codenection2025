"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import DecisionPopup from "../src/components/DecisionPopup.jsx";
import ManualQuoteSevenSteps from "../src/components/ManualQuoteSevenSteps";
import GeranImageUpload from "../src/components/GeranImageUpload";

export default function GetQuoteDecision() {
  const { status } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [autofillData, setAutofillData] = useState(null);
  const [hasMadeDecision, setHasMadeDecision] = useState(false); 
  const [showGeranModal, setShowGeranModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedDecision = sessionStorage.getItem("quoteDecision");
    const savedData = sessionStorage.getItem("autofillData");
  
    if (savedDecision === "geran" && savedData) {
      setAutofillData(JSON.parse(savedData));
      setShowForm(true);
      setShowGeranModal(false);
      setHasMadeDecision(true);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
      return;
    }
    if (status === "authenticated") {
      setIsAuthenticated(true);
      // Only open the popup if the component is first mounted and no decision has been made
      if (!hasMadeDecision) {
        setIsOpen(true);
      }
    }
  }, [status, router, hasMadeDecision]);

  
  // When user makes a decision
const handleDecision = (type, data) => {
  setHasMadeDecision(true);
  sessionStorage.setItem("quoteDecision", type); // save decision
  if (type === "manual") {
    setIsOpen(false);
    router.replace("/manual-quote");
  } else if (type === "geran") {
    if (isAuthenticated) {
      setAutofillData(null);
      setIsOpen(false);
      setShowGeranModal(true);
    } else {
      // Handle the case where the user is not authenticated
      console.log("User is not authenticated");
    }
  }
};

const [startStep, setStartStep] = useState(1);

// When OCR successfully extracts data
const handleFormDataExtracted = (data) => {
  setAutofillData(data);
  sessionStorage.setItem("autofillData", JSON.stringify(data));
  setShowForm(true);
  setShowGeranModal(false);
  setHasMadeDecision(true);
  setStartStep(2);
};


  const handleClose = () => {
    setIsOpen(false);
    setHasMadeDecision(true); // Prevent popup from reopening on close
  };

  return (
    <>
      <Head>
        <title>Get Quote - Choose Input Method</title>
      </Head>
      <div className="min-h-screen bg-black">
        <DecisionPopup
          isOpen={isOpen}
          onClose={handleClose}
          onDecision={handleDecision}
        />
        
        {showGeranModal && ( 
          <GeranImageUpload
            onClose={() => setShowGeranModal(false)}
            onFormDataExtracted={handleFormDataExtracted} 
          />
        )}      
        {showForm && autofillData && (
          <ManualQuoteSevenSteps
          autofillData={autofillData}
          startStep={startStep}
          />
        )}


      </div>
    </>
  );
}