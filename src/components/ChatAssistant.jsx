import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useT } from "../utils/i18n";
import { useQuote } from "../context/QuoteContext";
import { validateCarMake, getModelsForMake, getYearsForModel } from "../utils/validationLogic";
import { formatPlate } from "../utils/formatPlate";

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInitialButtons, setShowInitialButtons] = useState(true);

  // RESTORING: State to hold collected autofill data from the chat
  const [chatAutofillData, setChatAutofillData] = useState({});
  const [pendingConfirmation, setPendingConfirmation] = useState(null);

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

  const handleInitialClick = (type) => {
    setShowInitialButtons(false);
    let userMsg;
    let assistantMsg;
  
    switch (type) {
      case "autofill":
        userMsg = { role: "user", content: "Autofill Quote" };
        // This message will trigger the backend to start the autofill conversation
        setMessages((prev) => [...prev, userMsg]);
        // We manually trigger the API call here
        send("Autofill Quote", [...messages, userMsg]); 
        return;
  
      case "how_to_use":
        userMsg = { role: "user", content: "How to use CGS website" };
        assistantMsg = {
          role: "assistant",
          content: `1.  **Get a Quote:** After generating a quote, we **email** the details to you. The quote is automatically saved in your **Recent Quotes** section.
  2.  **Activate/Renew:** To proceed, click **"Renew Now"** from your Recent Quotes, the vehicle details and personal information is auto-filled from the quotation you have made but it is editable. Upon making a successful payment, the policy becomes active, and a confirmation including payment details is sent to your **Gmail** and stored in your **My Car Records**.
  3.  **Renewal Reminder:** The system monitors your policy expiry. When your policy is **expiring soon**, a reminder is sent, and a prompt will appear in **My Car Records** asking you to **"Renew Now."**
  4.  **Final Renewal:** You can click the **"Renew Now"** button directly in My Car Records which has stored all your car details to quickly make the payment and complete the renewal process.`
        };
        break;
  
      case "products":
        userMsg = { role: "user", content: "Insurance Products" };
        assistantMsg = {
          role: "assistant",
          content: `**${t('comprehensive_insurance')}**\n${t('comprehensive_description')}\n\n**${t('third_party_insurance')}**\n${t('third_party_fire_party_description')} ${t('no_protection')}\n\n**Third Party Only**\n${t('third_party_description')} ${t('no_protection')}`
        };
        
        break;
  
      default:
        return;
    }
  
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
  };
  const resetChat = () => {
    // Reset messages to the initial welcome message
    setMessages([{ role: "assistant", content: t("chat_welcome") }]);
    // Show the three initial buttons again
    setShowInitialButtons(true);
    // Clear any data collected in the previous session
    setChatAutofillData({});
    // Clear the user's input
    setPendingConfirmation(null); // Add this line
    setInput("");
    setIsLoading(false);
  };
  
  const send = async (initialMessage = null) => {
    setShowInitialButtons(false);
    const userInput = (initialMessage || input.trim()).toLowerCase();
    if (!userInput) return;
  
    const userMsg = { role: "user", content: userInput };
    let currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    setInput("");
    setIsLoading(true);
  
    // --- Confirmation Handling ---
    if (pendingConfirmation) {
      if (userInput === 'yes') {
        const { type, value, originalType } = pendingConfirmation;
        if (type === 'suggestion') {
          setChatAutofillData(prev => ({ ...prev, [originalType]: value }));
          setPendingConfirmation(null);

          // This is the fix: We create a new history that replaces the user's "yes"
          // with the corrected value ("Perodua"). `messages` here is the state
          // before "yes" was added.
          const correctedHistory = [...messages, { role: 'user', content: value }];

          // We update the UI to show this corrected history. This will make it look
          // like the user typed "Perodua" directly.
          setMessages(correctedHistory);

          // Finally, we call the API with the corrected value and the new history.
          await callChatApi(value, correctedHistory);

        } else {
          setChatAutofillData(prev => ({ ...prev, [type]: value }));
          setPendingConfirmation(null);
          await callChatApi(userInput, currentMessages);
        }
      } else if (userInput === 'no') {
        const { type, originalType } = pendingConfirmation;
        const itemType = type === 'suggestion' ? originalType : type;
        currentMessages.push({
          role: "assistant",
          content: `My mistake. Please provide your car's ${itemType} again.`,
        });
        setMessages(currentMessages);
        setPendingConfirmation(null);
        setIsLoading(false);
      } else {
        currentMessages.push({
          role: "assistant",
          content: "Please answer with 'Yes' or 'No'.",
        });
        setMessages(currentMessages);
        setIsLoading(false);
      }
      return;
    }
  
    // --- Validation for New Input ---
    // Find the last question asked by the assistant, not the user's last message
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
    let questionType = getQuestionType(lastAssistantMessage?.content);

  
    if (questionType) {
      const validationResult = validateAndFormat(questionType, userInput, chatAutofillData);
  
      if (validationResult.error) {
        currentMessages.push({ role: "assistant", content: validationResult.error });
        setMessages(currentMessages);
        setIsLoading(false);
        return;
      }
  
      if (validationResult.needsSuggestion) {
        setPendingConfirmation({
          type: 'suggestion',
          value: validationResult.suggestion,
          originalType: questionType
        });
        currentMessages.push({
          role: "assistant",
          content: `Invalid ${questionType}. Did you mean '${validationResult.suggestion}'? Please confirm.`,
        });
        setMessages(currentMessages);
        setIsLoading(false);
        return;
      }
  
      if (validationResult.needsConfirmation) {
        setPendingConfirmation({ type: questionType, value: validationResult.formattedValue });
        currentMessages.push({
          role: "assistant",
          content: `Got it. Is your plate number ${validationResult.formattedValue}? Please confirm.`,
        });
        setMessages(currentMessages);
        setIsLoading(false);
        return;
      }
      setChatAutofillData(prev => ({ ...prev, [questionType]: validationResult.formattedValue }));
      await callChatApi(validationResult.formattedValue, messages, userMsg);

    } else {
      // If it's a general question, just call the API
      await callChatApi(userInput, currentMessages);
    }
  };
  

  const callChatApi = async (message, history, lastUserMessage = null) => {

    let currentMessages = lastUserMessage ? [...history, lastUserMessage] : [...history];
    // Immediately update the UI to show the user's message
    setMessages(currentMessages);
    setIsLoading(true);

    try {
      // Send the API request
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // This is the key: send the `message` and the original `history`.
        // Do NOT send `currentMessages` here.
        body: JSON.stringify({ message, history }),
      });

      if (!res.ok) {
        throw new Error('API call failed');
      }

      const data = await res.json();
      if (data.message) {
        // Add the assistant's response and update the UI
        setMessages([...currentMessages, { role: 'assistant', content: data.message }]);
      }

    } catch (error) {
      console.error("Error calling chat API:", error);
      // Optionally, display an error message in the chat
      setMessages([...currentMessages, { role: 'assistant', content: "Sorry, something went wrong." }]);
    } finally {
      setIsLoading(false);
    }

  
    try {
      let apiResponseData;
      let functionWasCalled;
  
      do {
        let apiHistory = [...currentMessages];
        const lastMessageInHistory = apiHistory[apiHistory.length - 1];
        
        // This logic checks if the new message is just a repeat of the last thing
        // the user typed (including case-insensitive matches for formatted input).
        // If it is, we remove the last message from the history we send to the API
        // to prevent confusing the AI with a duplicate.
        if (
          lastMessageInHistory &&
          lastMessageInHistory.role === 'user' &&
          message &&
          lastMessageInHistory.content.toLowerCase() === message.toLowerCase()
        ) {
          apiHistory = apiHistory.slice(0, -1);
        }
        
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: message, history: apiHistory }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Something went wrong.");
        }
  
        apiResponseData = await response.json();
        functionWasCalled = false;
  
        if (apiResponseData.functionCall?.name === "fill_car_info") {
          const { arguments: newCarInfo } = apiResponseData.functionCall;
          if (newCarInfo) {
            setChatAutofillData(prev => ({ ...prev, ...newCarInfo }));
            const funcResponse = {
              role: "function",
              content: JSON.stringify({ status: "updated", data: newCarInfo }),
              name: "fill_car_info",
            };
            currentMessages.push(
              { role: "assistant", functionCall: apiResponseData.functionCall },
              funcResponse
            );
            functionWasCalled = true;
          }
        }
      } while (functionWasCalled);
  
      if (apiResponseData.reply) {
        if (apiResponseData.reply.includes("INFO_CONFIRMED")) {
          // ... (rest of the code is the same)
          const finalReplyText = "Great! Redirecting you to the form now...";
          currentMessages.push({ role: "assistant", content: finalReplyText });
  
          setQuoteDraft((prev) => ({
            ...prev,
            ...chatAutofillData,
            fromChat: true,
          }));
  
          setIsOpen(false);
          router.push("/manual-quote");
        } else {
          currentMessages.push({
            role: "assistant",
            content: apiResponseData.reply,
          });
        }
      }
      setMessages(currentMessages);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${error.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmationClick = (answer) => {
    // Hide the confirmation buttons after a choice is made
    // Call the send function with the user's choice
    send(answer);
  };
  

  const renderBoldText = (text) => {
    if (typeof text !== 'string') return text;
    
    return text.split('**').map((part, index) => 
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );
  };
  const getQuestionType = (messageContent) => {
    if (!messageContent) return null;
    const content = messageContent.toLowerCase();
    if (content.includes("plate number")) return "plate";
    if (content.includes("brand")) return "brand";
    if (content.includes("model")) return "model";
    if (content.includes("year")) return "year";
    return null;
  };
  
  const validateAndFormat = (questionType, userInput, context) => {
    switch (questionType) {
      case "plate": {
        const cleanInput = userInput.toUpperCase().replace(/\s/g, "");
      
        if (cleanInput.length > 10) {
          return { error: "Plate number cannot exceed 10 characters. Please try again." };
        }
        if (/[^A-Z0-9]/.test(cleanInput)) {
          return { error: "Plate number can only contain letters and numbers. Please try again." };
        }
        if (/[IO]/.test(cleanInput)) {
          return { error: "Plate numbers do not contain the letters 'I' or 'O'. Please try again." };
        }
      
        const finalFormattedValue = formatPlate(userInput);
        
        // Flag this as needing user confirmation
        return { formattedValue: finalFormattedValue, needsConfirmation: true };
      }
case "brand": {
  const result = validateCarMake(userInput);
  if (result.isValid) {
    return { formattedValue: result.suggestion || userInput };
  }
  if (result.suggestion) {
    // This is the key change: instead of an error, flag it for suggestion.
    return { needsSuggestion: true, suggestion: result.suggestion };
  }
  return { error: "Invalid car brand. Please try again." };
}

      case "model": {
        const { brand } = context;
        if (!brand) return { error: "Please provide a brand first." };
        const validModels = getModelsForMake(brand);
        const match = validModels.find(m => m.toLowerCase() === userInput.toLowerCase());
        if (match) return { formattedValue: match };
        return { error: `That doesn't look like a valid model for ${brand}. Please try again.` };
      }
      case "year": {
        const { brand, model } = context;
        if (!brand || !model) return { error: "Please provide a brand and model first." };
        const validYears = getYearsForModel(brand, model);
        if (!validYears.includes(Number(userInput))) {
          return { error: `Invalid year for ${brand} ${model}. Please try again.` };
        }
        return { formattedValue: userInput };
      }
      default:
        return { formattedValue: userInput };
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
  <div className="flex items-center space-x-3">
    <button 
        onClick={resetChat} 
        className="text-sm text-white/80 hover:text-white"
        title="Start New Conversation"
    >
        New Chat
    </button>
    <button
      onClick={() => setIsOpen(false)}
      className="text-white/80 hover:text-white"
      title="Close Chat"
    >
      ×
    </button>
  </div>
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
                  className={`inline-block px-3 py-2 rounded-lg max-w-[85%] text-sm whitespace-pre-wrap ${

                    m.role === "assistant"
                      ? "bg-blue-50 text-blue-900"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {renderBoldText(m.content)}
                </div>
              </div>
            ))}
            {showInitialButtons && (
  <div className="flex flex-col items-start space-y-2 mb-3">
    <button
      onClick={() => handleInitialClick("autofill")}
      className="bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
    >
      Autofill Quote
    </button>
    <button
      onClick={() => handleInitialClick("how_to_use")}
      className="bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
    >
      How to use CGS website
    </button>
    <button
      onClick={() => handleInitialClick("products")}
      className="bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
    >
      Insurance Products
    </button>
  </div>
)}

            {isLoading && (
              <div className="flex justify-start">
                <div className="w-2 h-2 rounded-full bg-blue-700 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-blue-700 animate-bounce delay-150 ml-1"></div>
                <div className="w-2 h-2 rounded-full bg-blue-700 animate-bounce delay-300 ml-1"></div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          {pendingConfirmation && (
  <div className="p-2 flex justify-center items-center space-x-3 bg-gray-50 border-t">
    <button
      onClick={() => handleConfirmationClick('yes')}
      className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
    >
      Yes
    </button>
    <button
      onClick={() => handleConfirmationClick('no')}
      className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
    >
      No
    </button>
  </div>
)}

          <div className="border-t p-2 flex items-center space-x-2">
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (e.target.value) setShowInitialButtons(false);
              }}              
              onKeyDown={(e) => e.key === "Enter" && !isLoading && send()}
              className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder={t("chat_placeholder")}
              disabled={isLoading || pendingConfirmation}
            />
            <button
              onClick={() => send()}
              className="px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded disabled:bg-gray-400"
              disabled={isLoading || pendingConfirmation}
            >
              {isLoading ? "..." : t("send")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
