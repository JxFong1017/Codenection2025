import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQuote } from "../context/QuoteContext";
import { useT } from "../utils/i18n";

const FAQ_ENTRIES = [
  {
    q: /renew|expire|expiry|renewal/i,
    a: "To renew, go to Dashboard → My Car Records and click Renew on your vehicle. We will pre-fill your details and show updated quotes.",
  },
  {
    q: /ncd|no claim|discount/i,
    a: "NCD (No Claim Discount) is your premium discount for claim-free years. You can check it in Step 4 of the quote flow via “Check NCD”.",
  },
  {
    q: /update (address|postcode)/i,
    a: "You can update your postcode in Step 4 (Personal information) of the 6-step quote flow.",
  },
  {
    q: /(add|remove) driver|named driver/i,
    a: "Add or remove Named Driver in Step 3 (Additional protection). Toggle the Named Driver option.",
  },
  {
    q: /windscreen|special perils|towing|coverage/i,
    a: "Extra coverages such as Windscreen, Special Perils and Towing are available in Step 3. Enable the ones you need before getting your estimate.",
  },
];

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

  const tryParseIntent = (text) => {
    // Very lightweight parsing for demo: brand, model, year, renew intent, plate optional
    const lower = text.toLowerCase();
    const renew = /(renew|renewal)/.test(lower);
    const yearMatch = lower.match(/\b(19|20)\d{2}\b/);
    // Malaysian-like plates: 1-3 letters + optional space/hyphen + 1-4 digits
    // Use word boundaries to avoid matching inside words like 'Vios 2015'.
    const plateMatch = text.match(/\b[A-Za-z]{1,3}[ -]?\d{1,4}\b/);
    // Simple brand/model extraction for Toyota Vios, Honda City, Perodua Myvi etc.
    const knownBrands = [
      "toyota",
      "honda",
      "perodua",
      "proton",
      "nissan",
      "mazda",
      "bmw",
      "mercedes",
    ];
    const brand = knownBrands.find((b) => lower.includes(b));
    const models = [
      "vios",
      "yaris",
      "corolla",
      "city",
      "civic",
      "accord",
      "myvi",
      "axia",
      "saga",
      "wira",
      "almera",
    ];
    const model = models.find((m) => lower.includes(m));
    const year = yearMatch ? yearMatch[0] : "";
    const plate = plateMatch
      ? plateMatch[0].toUpperCase().replace(/\s+/, " ")
      : "";

    if (renew && (brand || plate || model || year)) {
      setQuoteDraft((prev) => ({
        ...prev,
        plate: plate || prev.plate,
        brand: brand
          ? brand.charAt(0).toUpperCase() + brand.slice(1)
          : prev.brand,
        model: model
          ? model.charAt(0).toUpperCase() + model.slice(1)
          : prev.model,
        year: year || prev.year,
        step: 2,
      }));
      router.push("/manual-quote");
      return t("chat_got_it");
    }
    return null;
  };

  const findAnswer = (text) => {
    for (const item of FAQ_ENTRIES) {
      if (item.q.test(text)) return item.a;
    }
    return t("chat_no_answer");
  };

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg = { role: "user", content: trimmed };
    const intentReply = tryParseIntent(trimmed);
    const reply = {
      role: "assistant",
      content: intentReply || findAnswer(trimmed),
    };
    setMessages((m) => [...m, userMsg, reply]);
    setInput("");
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
            className="w-14 h-14 object-contain"
            width={56}
            height={56}
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
