// pages/api/generate-quote.js
import { generateQuotationAndSendEmail } from "../../lib/quotationService";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const quotationData = req.body;

      // Basic validation remains, as a first line of defense.
      if (!quotationData || !quotationData.email) {
        return res
          .status(400)
          .json({ error: "Invalid quotation data: email is missing." });
      }

      // The service now handles its own deep validation and will throw on error.
      // It returns { success: true } on success.
      await generateQuotationAndSendEmail(quotationData);

      // If the above line does not throw, it means success.
      console.log('Quotation successfully processed for:', quotationData.email);
      res.status(200).json({
        status: "success",
        message: "Quotation generated and email is being sent.",
      });

    } catch (error) {
      // This will catch any error thrown from the quotationService.
      console.error('Caught an error in /api/generate-quote handler:', error.message);
      res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
