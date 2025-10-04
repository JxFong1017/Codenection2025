
import { generateQuotationAndSendEmail } from '../../lib/quotationService';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const result = await generateQuotationAndSendEmail(req.body);
      // If the service function completes, it means the quote was saved.
      // It might return a warning if the email failed, but that's handled here.
      if (result.success) {
        res.status(200).json({ success: true, message: result.warning || 'Quotation generated and sent successfully.' });
      } else {
        // This path should ideally not be taken if errors are thrown.
        res.status(500).json({ success: false, error: result.error || 'An unknown error occurred in the service.' });
      }
    } catch (error) {
      console.error('--- Critical Error in generate-quote API ---', error);
      // CRITICAL CHANGE: Expose the actual error message to the client.
      // This will reveal the true underlying cause of the Firestore save failure.
      res.status(500).json({
        success: false, 
        error: `Server-Side Error: ${error.message}` // Return the specific error message.
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
