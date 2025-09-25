import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useT } from "../utils/i18n";
import { useQuote } from "../context/QuoteContext";

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useState(false);
  const endRef = useRef(null);
  const t = useT();
  const { quoteDraft, setQuoteDraft } = useQuote();
  const router = useRouter();

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: t("chat_welcome") }]);
    }
  }, [t, messages.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const send = async () => {
       const trimmed = input.trim();
       if (!trimmed) return;
    
       // --- 1. CONFIRMATION REDIRECTION CHECK ---
       // Check if the user's current message is a confirmation to the AI's question.
       if (isAwaitingConfirmation) {
        // A simple check for common confirmation keywords.
        const confirmationKeywords = ['yes', 'correct', 'yup', 'confirm', 'sure', 'ok'];
        const userConfirmed = confirmationKeywords.some(keyword => trimmed.toLowerCase().includes(keyword));
    
        if (userConfirmed) {
          // Display the final friendly message BEFORE redirecting
          const finalReplyText = "Great! Redirecting you to the form now...";
          const finalReplyMessage = { role: "assistant", content: finalReplyText };
          
          // Append the message and update the chat state
          setMessages((prevMessages) => [...prevMessages, finalReplyMessage]);

          // Add a small delay (e.g., 100ms) to ensure the global state is fully committed
          setTimeout(() => {
              setIsAwaitingConfirmation(false);
              setIsOpen(false);
              router.push("/manual-quote");
          }, 100); 

          setIsLoading(false);
           return; }
        // If the user said 'No' or a correction, the flow continues to the API call below.
        setIsAwaitingConfirmation(false); // Reset the flag so the AI handles the correction.
       }
       // --- END CONFIRMATION REDIRECTION CHECK ---
    
       const userMsg = { role: "user", content: trimmed };
       let currentMessages = [...messages, userMsg]; 
       setMessages(currentMessages);
       setInput("");
       setIsLoading(true);
    
       try {
        let apiResponseData;
        let functionWasCalled;
    
       // --- 2. Multi-Turn API Call Loop ---
         do {
       // Use the whole message array for history, since the latest user message is already added
       const history = currentMessages.slice(1); // Skip initial welcome message
    
       const response = await fetch("/api/chat", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ message: trimmed, history }),
       });
    
       if (!response.ok) throw new Error("Something went wrong with the API.");
    
       apiResponseData = await response.json();
       functionWasCalled = false; // Reset for the next iteration
    
       // --- 2a. Handle Function Call ---
       if (apiResponseData.functionCall && apiResponseData.functionCall.name === "fill_car_info") {
       const { arguments: newCarInfo } = apiResponseData.functionCall;
       
       if (newCarInfo) {
       setQuoteDraft((prevDraft) => {
       const updatedDraft = { ...prevDraft, ...newCarInfo };
       
       // If all fields are complete, set flag to await confirmation text from AI
       if (updatedDraft.plate && updatedDraft.brand && updatedDraft.model && updatedDraft.year) {
       setIsAwaitingConfirmation(true);
       }
       return updatedDraft;
       });
    
       // 🔑 CRITICAL: Add the Function Response to history and loop again
       const functionResponsePart = {
       role: "function",
       content: JSON.stringify({ status: "updated", data: newCarInfo }),
       name: "fill_car_info",
        };
       
       currentMessages.push(
       { role: "assistant", functionCall: apiResponseData.functionCall }, // AI instruction
       functionResponsePart // Client response
       );
       functionWasCalled = true; // Loop again immediately
       }
       }
       } while (functionWasCalled); // Loop until the AI gives a final text response
    
       // --- 2b. Handle Final Text Reply ---
       if (apiResponseData.reply) {
       // Check for the AI's final confirmation signal
       if (apiResponseData.reply.includes("INFO_CONFIRMED")) {
       // The AI signals the user has confirmed and redirection should happen.
       // 1. Display a final friendly message (not the technical keyword)
       const finalReplyText = "Great! Redirecting you to the form now...";
       currentMessages.push({ role: "assistant", content: finalReplyText });
       
       // 2. Perform the final action (This block should theoretically not be hit 
       // because the earlier confirmation check handles it, but kept for robustness)
      setIsAwaitingConfirmation(false);
      setIsOpen(false);
      router.push("/manual-quote"); 
       } else {
       // Standard text reply
      currentMessages.push({ role: "assistant", content: apiResponseData.reply });
     }
       }
    
       setMessages(currentMessages);
       } catch (error) {
       console.error("Client Error:", error);
       const reply = {
       role: "assistant",
       content: "Sorry, I'm having trouble with that request. Please try again later.",
       };
       setMessages((m) => [...currentMessages, reply]);
       } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-transparent hover:bg-blue-800 shadow-lg flex items-center justify-center"
          aria-label="Open assistant"
        >
          <Image
            src="/images/robot.png"
            alt="Chat Assistant"
            width={56}
            height={56}
            className="w-14 h-14 object-contain"
            priority
          />
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 h-[450px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="bg-blue-700 text-white px-4 py-3 flex items-center justify-between">
            <div className="font-semibold">CGS Assistant</div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white"
            >
              ×
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`inline-block px-3 py-2 rounded-lg max-w-[85%] text-sm ${
                    m.role === "assistant"
                      ? "bg-blue-50 text-blue-900"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-2 h-2 rounded-full bg-blue-700 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-blue-700 animate-bounce delay-150 ml-1"></div>
                <div className="w-2 h-2 rounded-full bg-blue-700 animate-bounce delay-300 ml-1"></div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div className="border-t p-2 flex items-center space-x-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && send()}
              className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder={t("chat_placeholder")}
              disabled={isLoading}
            />
            <button
              onClick={send}
              className="px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? "..." : t("send")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
