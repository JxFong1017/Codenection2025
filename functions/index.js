const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const { VertexAI } = require("@google-cloud/vertexai");

// Set the region for all functions in this file
setGlobalOptions({ region: "us-central1" });

// Initialize Vertex AI with your project and location
const vertex_ai = new VertexAI({
  project: "codenection2025-19a07",
  location: "us-central1",
});

const model = "gemini-1.5-flash-latest";

// Instantiate the model
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 1,
    topP: 1,
  },
});

exports.chatAssistant = onRequest({ cors: true }, async (request, response) => {
  // CORS is now handled automatically by the { cors: true } option.
  // The preflight OPTIONS request is also handled automatically.

  const { message } = request.body;

  if (!message) {
    console.error("No message provided in the request.");
    response.status(400).send({ error: "No message provided" });
    return;
  }

  try {
    const chat = generativeModel.startChat({});
    const streamResult = await chat.sendMessageStream(message);
    
    // Wait for the stream to complete and aggregate the response
    const aggregatedResponse = await streamResult.response;

    // Check for a valid response structure
    if (
      !aggregatedResponse.candidates ||
      !aggregatedResponse.candidates[0].content ||
      !aggregatedResponse.candidates[0].content.parts ||
      !aggregatedResponse.candidates[0].content.parts[0].text
    ) {
      console.error("Invalid response structure from Gemini:", JSON.stringify(aggregatedResponse, null, 2));
      throw new Error("Received an invalid response from the AI model.");
    }
    
    const botReply = aggregatedResponse.candidates[0].content.parts[0].text;
    response.send({ reply: botReply });

  } catch (error) {
    console.error("Error processing chat message:", error);
    // It's better to check if the response has already been sent
    if (!response.headersSent) {
      response.status(500).send({ error: "Failed to process chat message due to an internal error." });
    }
  }
});
