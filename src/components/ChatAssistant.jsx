
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQuote } from "../context/QuoteContext";
import { useT } from "../utils/i18n";

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "" },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  const router = useRouter();
  const { setQuoteDraft } = useQuote();
  const t = useT();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    if (messages.length === 1 && messages[0].content === "") {
      setMessages([{ role: "assistant", content: t("chat_welcome") }]);
    }
  }, [t, messages]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg = { role: "user", content: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      const reply = { role: "assistant", content: data.reply };
      setMessages((m) => [...m, reply]);
    } catch (error) {
      console.error(error);
      const reply = {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting. Please try again later.",
      };
      setMessages((m) => [...m, reply]);
    }
  };


  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
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

      {/* Chat Window */}
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
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`${
                  m.role === "assistant" ? "text-blue-900" : "text-gray-900"
                } text-sm`}
              >
                <div
                  className={`inline-block px-3 py-2 rounded-lg ${
                    m.role === "assistant" ? "bg-blue-50" : "bg-gray-100"
                  } max-w-[85%]`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="border-t p-2 flex items-center space-x-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder={t("chat_placeholder")}
            />
            <button
              onClick={send}
              className="px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded"
            >
              {t("send")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
