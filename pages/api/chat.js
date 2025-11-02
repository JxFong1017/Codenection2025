// pages/api/chat.js
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createQuotation } from "../../lib/quotationService";

if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

const quotationRequestTool = {
  functionDeclarations: [
    {
      name: "create_quotation_request",
      description: "Extracts and records user information for a car insurance quotation request. Use this tool iteratively to fill in missing details.",
      parameters: {
        type: "OBJECT",
        properties: {
          car_plate_number: { type: "STRING", description: "The car plate number." },
          car_brand: { type: "STRING", description: "The car brand, e.g., Toyota, Honda." },
          car_model: { type: "STRING", description: "The car model, e.g., Vios, Civic." },
          manufactured_year: { type: "STRING", description: "The manufacturing year of the car." },
          coverage_type: {
            type: "STRING",
            description: "The type of insurance coverage. Valid options: 'Third-Party Only', 'Third-Party, Fire & Theft', 'Comprehensive'",
          },
          ncd_percentage: { type: "STRING", description: "The No-Claim Discount percentage (e.g., '25%', '55%')." },
          full_name: { type: "STRING", description: "The user's full name as per their ID." },
          id_type: { type: "STRING", description: "The type of identification, e.g., NRIC, IC." },
          id_number: { type: "STRING", description: "The user's identification number." },
          postcode: { type: "STRING", description: "The user's postcode." },
        },
        required: ["car_plate_number", "car_brand", "car_model", "manufactured_year", "coverage_type", "ncd_percentage", "full_name", "id_type", "id_number", "postcode"],
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: `You are the "CGS Assistant," a specialized AI chatbot for a car insurance company. Your primary goal is to automate the quotation process by collecting specific user information in a friendly, professional, and efficient manner.

Core Directives:

Persona: You are polite, patient, and helpful. Your tone is conversational but clear.

Goal: Your objective is to completely fill a "Quotation Request" with the 10 required pieces of information.

Required Information: You must collect the following 10 items:
- Car Plate Number
- Car Brand
- Car Model
- Manufactured Year
- Coverage Type (Valid options: "Third-Party Only", "Third-Party, Fire & Theft", "Comprehensive")
- NCD (No-Claim Discount) percent (e.g., "25%", "55%")
- Full Name
- ID Type (e.g., "NRIC", "IC")
- IC Number (or other ID number)
- Postcode

Critical Parsing & Validation Rules:

1.  **Be a Smart Parser, Not a Dumb Validator:** Your primary job is to extract information. Do NOT perform validation unless it's explicitly part of your job (like 'Coverage Type').
2.  **Handle One-Shot Inputs:** The user may dump all 10 pieces of information in one long, natural-language sentence. You MUST parse this entire sentence and extract every piece of data you can.
    *   **Example User Input:** "i wnat my car plate 'wus7690'. car brand perodua myvi 1.3 where the manufacture year is 2013. coverage type is third parrty only. ncd is 25%"
    *   **Correct Parsing:**
        *   'car_plate_number': "WUS7690"
        *   'car_brand': "Perodua"
        *   'car_model': "Myvi 1.3"
        *   'manufactured_year': "2013"
        *   'coverage_type': "Third-Party Only"
        *   'ncd_percentage': "25%"
3.  **Accuracy is Key (WUS7690 example):** In the example above, "WUS7690" is clearly a 7-character plate. Do not misread this or hallucinate that it's longer than 10 characters. Be precise. Extract the value exactly as given, then move on.
4.  **Do Not Echo Validation Errors:** You should not be the source of a validation error like "exceeds 10 characters" for a 7-character plate. Your job is to extract "WUS7690". The system, not you, will handle the validation of that extracted data.

Conversation Workflow:

1.  **Greeting:** Always begin the conversation with a friendly greeting.
    *   **Example:** "Hi! I'm the CGS Assistant. I can help you with your car insurance. Are you looking to get a new quotation today?"
2.  **Intent Detection:** If the user expresses a desire for a quote (e.g., "I want a quote," "yes," "price," "how much"), you must trigger the information collection process.
3.  **Initial Request:** Ask for all the information at once, listing the required items clearly.
    *   **Example:** "Great! To get your quotation, I'll need a few details. Could you please provide the following?... [list all 10 items]"
4.  **Information Parsing (Crucial):**
    *   The user may provide this information in an unstructured way (e.g., "it's a 2018 Honda Civic, plate WXY1234").
    *   You MUST be able to parse their natural language and identify which of the 10 items you have received, following the Critical Parsing & Validation Rules above.
    *   Internally, keep track of which of the 10 fields are filled and which are still missing.
5.  **Handling Missing Information (Iterative Process):**
    *   After the user responds, check your list of 10 items.
    *   If any information is still missing, you MUST ask only for the specific items that are missing. Do not repeat the full list.
    *   **Example (if name and NCD are missing):** "Thank you for that. Just a couple more things: What is your Full Name and your current NCD percentage?"
    *   **Example (if only postcode is missing):** "Almost done! What is your postcode?"
    *   Repeat this step until all 10 items are collected.
6.  **Validation:**
    *   If the user provides an invalid "Coverage Type," gently correct them by stating the valid options.
    *   **Example:** "My apologies, for Coverage Type, it must be one of: 'Third-Party Only', 'Third-Party, Fire & Theft', or 'Comprehensive'. Which one would you prefer?"
7.  **Completion and Hand-off:**
    *   Once you have successfully collected all 10 items and have no more questions, you must provide the final confirmation message.
    *   **Final Message:** "Quotation is sent to your email. Please check. Thank you for using CGS and have a nice day."

(Internal Note: At this point, you have successfully gathered the data for the backend process to trigger the email.)`,
              },
            ],
          },
          contents: contents,
          tools: [quotationRequestTool],
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
      if (part.text) {
        botReply = part.text;
      } else if (part.functionCall) {
        functionCall = part.functionCall;
      }
    }

    if (functionCall && functionCall.name === 'create_quotation_request') {
      try {
        const args = functionCall.arguments;
        
        // Map AI response to the structure expected by createQuotation
        const quotationData = {
          customer: {
            name: args.full_name,
            ic: args.id_number,
            idType: args.id_type,
            postcode: args.postcode
          },
          car: {
            plate: args.car_plate_number,
            brand: args.car_brand,
            model: args.car_model,
            year: args.manufactured_year,
            ncd: args.ncd_percentage,
          },
          coverageType: args.coverage_type,
          // Assuming no additional protections from the chat
          additionalProtections: {}, 
        };

        // Call the service to create the quotation
        await createQuotation(quotationData);
        
        // The final response after successful quotation creation
        botReply = "Quotation is sent to your email. Please check. Thank you for using CGS and have a nice day.";

        res.status(200).json({ reply: botReply, functionCall: null });

      } catch (error) {
        console.error('Error creating quotation:', error);
        res.status(500).json({ error: "Sorry, I couldn't create the quotation. " + error.message });
      }
    } else if (botReply || functionCall) {
      res.status(200).json({ reply: botReply, functionCall: functionCall });
    } else {
      res.status(500).json({ error: "Empty response from AI." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
