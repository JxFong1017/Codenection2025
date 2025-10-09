// pages/api/chat.js

const fillCarInfoTool = {
  functionDeclarations: [
    {
      name: "fill_car_info",
      description:
        "Based on the user's message, extract the car information and fill the form.",
      parameters: {
        type: "OBJECT",
        properties: {
          plate: {
            type: "STRING",
            description: "The car plate number.",
          },
          brand: {
            type: "STRING",
            description: "The car brand, e.g., Toyota, Honda, etc.",
          },
          model: {
            type: "STRING",
            description: "The car model, e.g., Vios, Civic, etc.",
          },
          year: {
            type: "STRING",
            description: "The manufacturing year of the car.",
          },
        },
        required: [],
      },
    },
  ],
};

const buildApiContents = (history, newMessage) => {
  let contents = [];

  for (const msg of history) {
    if (msg.role === "user") {
      contents.push({ role: "user", parts: [{ text: msg.content }] });
    } else if (msg.role === "assistant") {
      let parts = [];
      if (msg.content) {
        parts.push({ text: msg.content });
      }
      if (msg.functionCall) {
        parts.push({ functionCall: msg.functionCall });
      }
      if (parts.length > 0) {
        contents.push({ role: "model", parts });
      }
    } else if (msg.role === "function" && msg.name) {
      contents.push({
        role: "function",
        parts: [
          {
            functionResponse: {
              name: msg.name,
              response: JSON.parse(msg.content),
            },
          },
        ],
      });
    }
  }

  contents.push({ role: "user", parts: [{ text: newMessage }] });
  return contents;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured." });
  }

  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  const contents = buildApiContents(history || [], message);

  try {
    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: `You are a professional, friendly, and helpful car insurance expert. Your answers must be concise and to the point. When the user wants to get a quote, your role is to help them fill in the form by asking for information **one piece at a time**. Use the \`fill_car_info\` function to extract the car information as it's provided.

**Follow this exact sequence:**
1. First, ask only for the car's plate number.
2. Once the user provides the plate number, then ask for the car's brand.
3. Once the user provides the brand, then ask for the car's model.
4. Once the user provides the model, then ask for the car's manufactured year.

After you have successfully collected the car's plate, brand, model, AND year, you MUST confirm all the collected details with the user (e.g., 'I have all the details: [CAR INFO]. Is this correct?'). If the user confirms, you MUST reply with the exact phrase: 'INFO_CONFIRMED'.

If a question is not about car insurance, politely decline. You are also a professional expert in car insurance, answer in short and correct.`

              },
            ],
          },
          contents: contents,
          tools: [fillCarInfoTool],
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.5,
            topP: 1,
          },
        }),
      }
    );

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      let detailedError = `API Error (${apiResponse.status}): ${errorText}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error && errorJson.error.message) {
          detailedError = errorJson.error.message;
        }
      } catch (e) {}
      return res.status(500).json({ error: detailedError });
    }

    const data = await apiResponse.json();
    const parts = data?.candidates?.[0]?.content?.parts;

    if (!parts) {
      return res.status(500).json({ error: "Invalid response structure from AI." });
    }

    let botReply = null;
    let functionCall = null;
    for (const part of parts) {
      if (part.text) botReply = part.text;
      else if (part.functionCall) functionCall = part.functionCall;
    }

    if (botReply || functionCall) {
      res.status(200).json({ reply: botReply, functionCall: functionCall });
    } else {
      res.status(500).json({ error: "Empty response from AI." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}