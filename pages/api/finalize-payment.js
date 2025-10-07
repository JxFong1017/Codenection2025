
import admin from '../../lib/firebase-admin';

// Use the authenticated admin Firestore instance
const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { quoteId } = req.body;

  if (!quoteId) {
    return res.status(400).json({ success: false, error: 'Policy ID is required.' });
  }

  try {
    // Get a reference to the policy document
    const policyRef = db.collection('policies').doc(quoteId);

    // Update the policy document to mark it as completed
    // This now runs on the server with admin privileges, bypassing client-side security rules.
    await policyRef.update({
      status: 'completed',
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ success: true, message: 'Payment finalized successfully.' });

  } catch (error) {
    console.error('Error in finalize-payment API:', error);
    res.status(500).json({ success: false, error: 'Failed to finalize payment.' });
  }
}
