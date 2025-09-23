import { useEffect, useRef, useState } from "react";

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatTyping, setIsChatTyping] = useState(false);
  const endRef = useRef(null);

  const [quoteDraft, setQuoteDraft] = useState({});

  const mockRouter = {
    push: (path) => {
      // Mock router to redirect to the correct page
      console.log(`Redirecting to: ${path}`);
    },
  };

  useEffect(() => {
    const latestBotMessage = chatMessages[chatMessages.length - 1];

    if (latestBotMessage && latestBotMessage.role === 'assistant') {
      try {
        const data = JSON.parse(latestBotMessage.content);
        if (data.action === 'fillForm') {
          if (data.plate) setQuoteDraft(prev => ({ ...prev, plate: data.plate }));
          if (data.make) setQuoteDraft(prev => ({ ...prev, brand: data.make }));
          if (data.model) setQuoteDraft(prev => ({ ...prev, model: data.model }));

          if (data.plate && data.make && data.model) {
            mockRouter.push("/manual-quote");
          }
        }
      } catch (e) {
        // If the reply is not JSON, it's a conversational answer. Do nothing.
      }
    }
  }, [chatMessages, setQuoteDraft]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsChatTyping(true);

    try {
      // NOTE: This URL is for local development with Firebase Emulators.
      // Change it back to the production URL before deploying.
      const response = await fetch('http://127.0.0.1:5001/codenection2025-19a07/us-central1/chatAssistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatInput }),
      });
      const data = await response.json();

      setChatMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);

    } catch (error) {
      console.error("Failed to fetch from chatbot API:", error);
      setChatMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsChatTyping(false);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isOpen]);

  useEffect(() => {
    if (chatMessages.length === 0) {
      setChatMessages([{ role: "assistant", content: "Hello! I'm your CGS Assistant. How can I help you today?" }]);
    }
  }, [chatMessages]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-blue-800 hover:bg-blue-900 shadow-lg flex items-center justify-center"
          aria-label="Open assistant"
        >
          <img
            src="/images/robot.png"
            alt="Chat Assistant"
            width={56}
            height={56}
            className="w-14 h-14 object-contain"
          />
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 h-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
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
            {chatMessages.map((m, idx) => (
              <div
                key={idx}
                className={`${m.role === "assistant" ? "text-blue-900" : "text-gray-900"} text-sm`}
              >
                <div
                  className={`inline-block px-3 py-2 rounded-lg ${m.role === "assistant" ? "bg-blue-50" : "bg-gray-100"} max-w-[85%]`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isChatTyping && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-lg bg-gray-200 animate-pulse">...</div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div className="border-t p-2 flex items-center space-x-2">
            <form onSubmit={handleChatSubmit} className="flex-1 flex space-x-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Type a message..."
                disabled={isChatTyping}
              />
              <button
                type="submit"
                className="px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded"
                disabled={isChatTyping}
              >
                {isChatTyping ? "..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
