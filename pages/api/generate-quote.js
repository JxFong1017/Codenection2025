
import { generateQuotationAndSendEmail } from '../../lib/quotationService';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const result = await generateQuotationAndSendEmail(req.body);
      if (result.success) {
        res.status(200).json({ success: true, message: 'Quotation sent successfully' });
      } else {
        res.status(500).json({ success: false, error: 'Failed to send quotation' });
      }
    } catch (error) {
      console.error('Error in generate-quote API:', error);
      res.status(500).json({ success: false, error: error.message || 'An unknown error occurred' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
