import { useEffect, useRef, useState } from 'react';

const FAQ_ENTRIES = [
  {
    q: /renew|expire|expiry|renewal/i,
    a: 'To renew, go to Dashboard → My Car Records and click Renew on your vehicle. We will pre-fill your details and show updated quotes.'
  },
  {
    q: /ncd|no claim|discount/i,
    a: 'NCD (No Claim Discount) is your premium discount for claim-free years. You can check it in Step 4 of the quote flow via “Check NCD”.'
  },
  {
    q: /update (address|postcode)/i,
    a: 'You can update your postcode in Step 4 (Personal information) of the 6-step quote flow.'
  },
  {
    q: /(add|remove) driver|named driver/i,
    a: 'Add or remove Named Driver in Step 3 (Additional protection). Toggle the Named Driver option.'
  },
  {
    q: /windscreen|special perils|towing|coverage/i,
    a: 'Extra coverages such as Windscreen, Special Perils and Towing are available in Step 3. Enable the ones you need before getting your estimate.'
  }
];

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m CGS Assistant. Ask me anything about updating your car insurance.' }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const findAnswer = (text) => {
    for (const item of FAQ_ENTRIES) {
      if (item.q.test(text)) return item.a;
    }
    return "I couldn't find an exact answer. You can start a new quote at Get Quotation or go to /manual-quote for the 6-step flow. Would you like quick links?";
  };

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg = { role: 'user', content: trimmed };
    const reply = { role: 'assistant', content: findAnswer(trimmed) };
    setMessages((m) => [...m, userMsg, reply]);
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-blue-700 hover:bg-blue-800 text-white shadow-lg flex items-center justify-center"
          aria-label="Open assistant"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
            <path d="M12 2a7 7 0 00-7 7v2.586A2 2 0 004.586 14L6 15.414V17a1 1 0 001.447.894L11 16h1a7 7 0 000-14z" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="bg-blue-700 text-white px-4 py-3 flex items-center justify-between">
            <div className="font-semibold">CGS Assistant</div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">×</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, idx) => (
              <div key={idx} className={`${m.role === 'assistant' ? 'text-blue-900' : 'text-gray-900'} text-sm`}>
                <div className={`inline-block px-3 py-2 rounded-lg ${m.role === 'assistant' ? 'bg-blue-50' : 'bg-gray-100'} max-w-[85%]`}>
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
              onKeyDown={(e) => e.key === 'Enter' && send()}
              className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Ask about renewal, NCD, drivers..."
            />
            <button onClick={send} className="px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded">Send</button>
          </div>
        </div>
      )}
    </div>
  );
}


