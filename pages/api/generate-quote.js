import { generateQuotationAndSendEmail } from '../../lib/quotationService';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const quotationData = req.body;

      // Validate the incoming data (basic validation)
      if (!quotationData || !quotationData.email) {
        return res.status(400).json({ error: 'Invalid quotation data provided.' });
      }

      const result = await generateQuotationAndSendEmail(quotationData);

      if (result.success) {
        res.status(200).json({ status: 'success', message: 'Quotation generated and email sent successfully!', warning: result.warning });
      } else {
        // This case might not be reached based on the current quotationService logic, but it's good practice.
        res.status(500).json({ error: 'An unknown error occurred while generating the quotation.' });
      }
    } catch (error) {
      console.error('API Route Error:', error);
      res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
