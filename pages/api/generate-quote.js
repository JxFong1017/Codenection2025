
export default function handler(req, res) {
  if (req.method === 'POST') {
    const quotationData = req.body;
    console.log('Received quotation data:', quotationData);
    // Here you would typically save the data to a database
    // and/or trigger an email to the user.
    res.status(200).json({ status: 'success', data: quotationData });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
