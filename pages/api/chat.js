// pages/api/chat.js
import { NextApiRequest, NextApiResponse } from 'next';

const fillCarInfoTool = {
  functionDeclarations: [
    {
      name: 'fill_car_info',
      description: 'Based on the user\'s message, extract the car information and fill the form.',
      parameters: {
        type: 'OBJECT',
        properties: {
          plate: {
            type: 'STRING',
            description: 'The car plate number.',
          },
          brand: {
            type: 'STRING',
            description: 'The car brand, e.g., Toyota, Honda, etc.',
          },
          model: {
            type: 'STRING',
            description: 'The car model, e.g., Vios, Civic, etc.',
          },
          year: {
            type: 'STRING',
            description: 'The manufacturing year of the car.',
          },
        },
        required: [],
      },
    },
  ],
};

// A more robust function to prepare the conversation history for the Gemini API.
const buildApiContents = (history, newMessage) => {
  let contents = [];
  
  // Find the first user message and start from there.
  for (const msg of history) {
    if (msg.role === 'user') {
      contents.push({
        role: 'user',
        parts: [{ text: msg.content }],
      });
    }
    else if (msg.role === 'assistant')  {
      // This handles the AI's actual text response
      let parts = [];
      if (msg.content) {
        parts.push({ text: msg.content });
      }
      
      // If the message contains a function call instruction from the AI
      if (msg.functionCall) {
        parts.push({ functionCall: msg.functionCall });
      }
      
      // Only push a model turn if it has content or a function call
      if (parts.length > 0) {
        contents.push({ role: 'model', parts });
      }

    } else if (msg.role === 'function' && msg.name) {
      // This handles the client's confirmation that the function ran
      contents.push({
        role: 'function',
        parts: [{ 
          functionResponse: {
            name: msg.name,
            // Assuming msg.content is a stringified JSON object
            response: JSON.parse(msg.content)
          }
        }],
      });
    }
  }

  // Add the current user message
  contents.push({ role: 'user', parts: [{ text: newMessage }] });

  return contents;
};


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  // Use the robust function to build the conversation history
  const contents = buildApiContents(history || [], message);

  try {
    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
           parts: [{
           text: "You are a professional, friendly, and helpful car insurance expert. Your answers must be concise and to the point. When the user wants to get a quote or renew insurance, your role is to help them fill in the form. Use the `fill_car_info` function to extract the car information. **Once you have successfully collected the car's plate, brand, model, AND year, you MUST confirm the collected details with the user (e.g., 'I have all the details: [CAR INFO]. Is this correct?').** If the user confirms, you MUST reply with the exact phrase: 'INFO_CONFIRMED'. Ask for any missing information. If a question is not about car insurance, politely decline."
           }]
         },
        contents: contents, // Pass the full conversation history
        tools: [fillCarInfoTool],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.5,
          topP: 1,
        },
      }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("Gemini API Error Response:", errorText);
      throw new Error(`Gemini API Error: ${apiResponse.status} - ${errorText}`);
    }

    const data = await apiResponse.json();
    const parts = data?.candidates?.[0]?.content?.parts;

    if (!parts) {
      console.error("Invalid response structure from Gemini:", JSON.stringify(data, null, 2));
      throw new Error("Received an invalid response from the AI model.");
    }

    let botReply = null;
    let functionCall = null;

    for (const part of parts) {
      if (part.text) {
        botReply = part.text;
      } else if (part.functionCall) {
        functionCall = part.functionCall;
      }
    }

    if (botReply || functionCall) {
      res.status(200).json({ reply: botReply, functionCall: functionCall });
    } else {
      console.error("No valid parts in response:", JSON.stringify(data, null, 2));
      throw new Error("Received an empty response from the AI model.");
    }

  } catch (error) {
    console.error("Error processing chat message:", error);
    res.status(500).json({ error: "Failed to process chat message due to an internal error." });
  }
}
