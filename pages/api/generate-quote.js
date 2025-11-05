    // pages/api/generate-quote.js
    import { generateQuotationAndSendEmail } from "../../lib/quotationService";

    export default async function handler(req, res) {
      console.log('API hit: /api/generate-quote - Method:', req.method); // Crucial log
      if (req.method === "POST") {
        try {
          const quotationData = req.body;
          console.log('Received quotationData from client:', quotationData); // Crucial log

          // Validate the incoming data (basic validation)
          if (!quotationData || !quotationData.email) {
            console.error('Validation failed: Missing quotationData or email in request body.'); // Crucial log
            return res
              .status(400)
              .json({ error: "Invalid quotation data provided." });
          }

          console.log('Attempting to call generateQuotationAndSendEmail with:', quotationData.email); // Crucial log
          const result = await generateQuotationAndSendEmail(quotationData);
          console.log('Result from generateQuotationAndSendEmail:', result); // Crucial log

          if (result.success) {
            console.log('Quotation successfully generated and email process initiated.'); // Crucial log
            res.status(200).json({
              status: "success",
              message: "Quotation generated and email sent successfully!",
              warning: result.warning,
            });
          } else {
            console.error('generateQuotationAndSendEmail reported an error:', result.error); // Crucial log
            res.status(500).json({
              error: result.error || 'An unknown error occurred while generating the quotation.',
            });
          }
        } catch (error) {
          // THIS IS THE MOST IMPORTANT LOG FOR CATCHING UNEXPECTED ERRORS IN THE API ROUTE
          console.error('Caught an unexpected error in /api/generate-quote handler:', error);
          res.status(500).json({ error: error.message || 'An internal server error occurred.' });
        }
      } else {
        console.warn('Method Not Allowed: Received', req.method); // Crucial log
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    }
