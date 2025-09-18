import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error(
    "⛔️ API key is not set. Please add GEMINI_API_KEY to your .env file."
  );
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function performGeranExtraction(imagePath) {
  try {
    // 1. Read the image file and encode it in Base64.
    // The Gemini API requires image data to be sent as a Base64 string.
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString("base64");

    // 2. Craft the multimodal prompt for the Gemini Pro Vision model.
    // The prompt serves two purposes:
    // a) It acts as a guide for the OCR process.
    // b) It specifies the exact data points and output format.
    const prompt =
      "From this image of a Malaysian vehicle registration document (Geran), " +
      "extract the following details and return them as a JSON object: " +
      "the plate number ('No. Pendaftaran'), " +
      "the make and model ('Buatan/Nama Model'), " +
      "the engine displacement in cc ('Keupayaan Enjin'), " +
      "and the year of manufacture. " +
      "Use the following keys for the JSON object: " +
      "plateNumber (string), make (string), model (string), engineCC (number), year (number). " +
      "If any detail is missing, set its value to null.";

    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    // 3. Send the request to the Gemini API.
    // The request payload combines the text prompt and the image data.
    const result = await model.generateContent([
      prompt,
      { inlineData: { mimeType: "image/jpeg", data: base64Image } },
    ]);

    // 4. Process the response.
    // The model's response is a JSON string, which we parse into a JavaScript object.
    const response = await result.response;
    const rawJson = response.text();

    const extractedData = JSON.parse(rawJson);
    console.log("✅ Successfully extracted data:");
    console.log(extractedData);

    return extractedData;
  } catch (error) {
    console.error("❌ An error occurred during the OCR process:", error);
    if (
      error.message.includes("403 Forbidden") &&
      error.message.includes("API key not valid")
    ) {
      console.error(
        "Please check your API key and ensure it has the necessary permissions."
      );
    }
  }
}

// Replace 'geran.jpg' with the path to your Geran image file.
const imageFile = "geran.jpg";
performGeranExtraction(imageFile);
