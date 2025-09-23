const { VertexAI } = require('@google-cloud/vertexai');
const functions = require('firebase-functions');

exports.chatAssistant = functions.https.onRequest(async (request, response) => {
  // CORS handling
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET, POST");
  response.set("Access-Control-Allow-Headers", "Content-Type");
  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  const { message } = request.body;
  if (!message) {
    response.status(400).send({ error: "No message provided" });
    return;
  }

  try {
    const project = 'codenection2025-19a07'; // Replace with your actual project ID
    const location = 'us-central1';

    // Initialize Vertex AI with ADC
    const vertex_ai = new VertexAI({ project: project, location: location });

    const model = 'gemini-1.5-flash-latest';
    const generativeModel = vertex_ai.preview.getGenerativeModel({ model });

    const chat = generativeModel.startChat({});
    const streamResult = await chat.sendMessageStream(message);
    const aggregatedResponse = await streamResult.response;
    const botReply = aggregatedResponse.candidates[0].content.parts[0].text;

    response.send({ reply: botReply });
  } catch (error) {
    console.error("Error processing chat message:", error);
    response.status(500).send({ error: "Failed to process chat message" });
  }
});