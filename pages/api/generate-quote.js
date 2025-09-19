
// pages/api/generate-quote.js

import { generateQuotationAndSendEmail } from '../../lib/quotationService';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const quotationData = req.body;
    
    try {
      // Call the service function to handle the entire process
      await generateQuotationAndSendEmail(quotationData);
      
      res.status(200).json({ status: 'success', message: 'Quotation sent successfully!' });
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({ status: 'error', message: 'Failed to generate and send quotation.' });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
