
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const protectionLabels = {
  windscreen: "Windscreen",
  named_driver: "Named Driver",
  all_driver: "All Driver",
  natural_disaster: "Natural Disaster (Special Perils)",
  strike_riot: "Strike Riot and Civil Commotion",
  personal_accident: "Personal Accident",
  towing: "Towing",
  passengers_coverage: "Passengers coverage",
};

// Helper to format currency
const formatCurrency = (value) => {
  const number = parseFloat(value);
  if (isNaN(number)) return 'N/A';
  return `RM ${number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// This function generates the HTML for the email
const generateEmailHtml = (policy) => {
    const selectedAddOnsList = policy.selectedAddOns?.map(p => `<li>${protectionLabels[p] || p}</li>`).join('') || '<li>None</li>';

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { background-color: #004F9E; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; }
        .section { margin-bottom: 20px; }
        .section h3 { color: #004F9E; border-bottom: 2px solid #BFE4ED; padding-bottom: 5px; }
        .detail-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 5px 0; border-bottom: 1px solid #f0f0f0; }
        .detail-row dt { font-weight: bold; }
        .total { font-size: 1.2em; font-weight: bold; text-align: right; margin-top: 10px; color: #004F9E; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h2>Policy Confirmation</h2></div>
        <div class="content">
            <p>Dear ${policy.customer_name},</p>
            <p>Thank you for your purchase. Your policy is confirmed. Your Order ID is <strong>${policy.id}</strong>.</p>
            
            <div class="section">
                <h3>Vehicle Information</h3>
                <dl>
                    <div class="detail-row"><dt>Car Plate:</dt><dd>${policy.plateNumber}</dd></div>
                    <div class="detail-row"><dt>Model:</dt><dd>${policy.car_brand} ${policy.vehicleModel}</dd></div>
                    <div class="detail-row"><dt>Year:</dt><dd>${policy.manufactured_year}</dd></div>
                </dl>
            </div>

            <div class="section">
                <h3>Premium Breakdown</h3>
                <dl>
                    <div class="detail-row"><dt>Basic Premium:</dt><dd>${formatCurrency(policy.basic_premium)}</dd></div>
                    <div class="detail-row"><dt>Add-ons:</dt><dd><ul>${selectedAddOnsList}</ul></dd></div>
                    <div class="detail-row"><dt>NCD:</dt><dd>${policy.ncd_percentage}%</dd></div>
                    <div class="detail-row"><dt>Gross Premium:</dt><dd>${formatCurrency(policy.gross_premium)}</dd></div>
                    <div class="detail-row"><dt>SST (6%):</dt><dd>${formatCurrency(policy.sst_amount)}</dd></div>
                    <div class="detail-row"><dt>Stamp Duty:</dt><dd>${formatCurrency(policy.stamp_duty)}</dd></div>
                </dl>
                <div class="total">Total Paid: ${formatCurrency(policy.price)}</div>
            </div>
            
            <p>Your cover note will be delivered to: <strong>${policy.cover_note_address}</strong></p>
            <p>Thank you for choosing CGS Insurance!</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ success: false, error: 'Order ID is required.' });
  }

  try {
    // 1. Fetch the completed quote data
    const quoteRef = doc(db, 'quotations', orderId);
    const quoteSnap = await getDoc(quoteRef);

    if (!quoteSnap.exists()) {
      return res.status(404).json({ success: false, error: 'Quotation not found.' });
    }

    const policyData = { id: quoteSnap.id, ...quoteSnap.data() };

    // 2. Generate the HTML for the email
    const emailHtml = generateEmailHtml(policyData);

    // 3. Create the email document in the 'mail' collection with the CORRECT structure
    const mailCollectionRef = collection(db, 'mail');
    await addDoc(mailCollectionRef, {
      // **THIS IS THE FIX:** The Firebase Extension expects the 'to' field
      // and a 'message' object containing subject and html.
      to: [policyData.user_email],
      message: {
        subject: `Your Policy is Confirmed! (Order: ${policyData.id})`,
        html: emailHtml,
      }
    });

    res.status(200).json({ success: true, message: 'Confirmation email queued successfully.' });

  } catch (error) {
    console.error('Error in send-confirmation-email API:', error);
    res.status(500).json({ success: false, error: 'Failed to send confirmation email.' });
  }
}
