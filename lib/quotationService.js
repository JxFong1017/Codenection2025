
import * as admin from 'firebase-admin';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import { quotationTemplate } from './quotationTemplate';

// --- Firebase Admin SDK Initialization ---
// This is the critical change. We must initialize the admin SDK on the server.

// Check if the app is already initialized to prevent errors
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\n/g, '\n'), // Ensures private key is parsed correctly
      })
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    throw new Error('Firebase admin initialization failed.');
  }
}

const db = admin.firestore(); // Use the authenticated admin Firestore instance

// --- The rest of your service logic ---

async function generateQuotationAndSendEmail(quotationData) {
    // Brevo/Sendinblue Email setup (remains the same)
    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Data processing (remains the same)
    const { customer, car, coverage, estimatedPremium, email, timezoneOffset } = quotationData;
    const now = new Date();
    const userLocalDate = new Date(now.getTime() - (timezoneOffset * 60 * 1000));
    const quotation_no = `QT${userLocalDate.getFullYear()}${(userLocalDate.getMonth() + 1).toString().padStart(2, '0')}${userLocalDate.getDate().toString().padStart(2, '0')}${userLocalDate.getHours().toString().padStart(2, '0')}${userLocalDate.getMinutes().toString().padStart(2, '0')}`;
    const date = userLocalDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const currentMarketValue = car.marketValue;

    const metroProtectPrice = estimatedPremium.max;
    const safeDrivePrice = metroProtectPrice - 10;
    const guardianPrice = safeDrivePrice - 10;
    const xyzPrice = guardianPrice - 10;
    const abcPrice = estimatedPremium.min;

    const prices = {
        comprehensive_abc: `RM${abcPrice.toFixed(2)}`,
        comprehensive_xyz: `RM${xyzPrice.toFixed(2)}`,
        comprehensive_safedrive: `RM${safeDrivePrice.toFixed(2)}`,
        comprehensive_guardian: `RM${guardianPrice.toFixed(2)}`,
        comprehensive_metroprotect: `RM${metroProtectPrice.toFixed(2)}`,
    };

    // This logic to set N/A can be simplified
    Object.keys(prices).forEach(key => {
        if (!key.startsWith(coverage.type.toLowerCase().split(',')[0].replace(' ', '_'))) {
            prices[key] = 'N/A';
        }
    });

    let protectionsList = '';
    const selectedProtections = Object.keys(coverage.protections || {}).filter(key => coverage.protections[key]);

    if (selectedProtections.length > 0) {
        protectionsList = `<ul>`;
        for (const key of selectedProtections) {
            let price = 0;
            switch (key) {
                case "Windscreen": price = 150; break;
                case "Natural Disaster": price = currentMarketValue * 0.005; break;
                case "Strike, Riot & Civil Commotion": price = currentMarketValue * 0.003; break;
                case "Personal Accident": price = 100; break;
                case "Towing": price = 50; break;
                case "Named Driver": price = 10; break;
                case "All Driver": price = 50; break;
                case "Passengers Coverage": price = 25; break;
                default: price = 0;
            }
            protectionsList += `<li>${key}: +RM ${price.toFixed(2)}</li>`;
        }
        protectionsList += `</ul>`;
    } else {
        protectionsList = `<p>None selected.</p>`;
    }
    
    // Object to save to Firestore
     const quotationToSave = {
        user_email: email,
        quotation_no,
        date,
        customer_name: customer.name,
        ic: customer.ic,
        postcode: customer.postcode,
        plateNumber: car.plate,
        vehicleModel: car.model,
        car_brand: car.brand,
        manufactured_year: car.year,
        engine_capacity: car.engineCapacity,
        car_market_value: car.marketValue,
        ncd: car.ncd,
        price: `RM${metroProtectPrice.toFixed(2)}`, // Storing as formatted string to match others
        coverage_type: coverage.type,
        status: 'pending',
        additional_protections_list: protectionsList,
        ...prices,
        createdAt: admin.firestore.FieldValue.serverTimestamp(), // Use admin server timestamp
      };

    // Save the document using the ADMIN SDK
    try {
      const docRef = await db.collection('quotations').add(quotationToSave);
      console.log('Quotation saved with ID: ', docRef.id);
    } catch (error) {
        console.error('Error saving quotation to Firestore: ', error);
        // This is the error the user was seeing. Now it should be resolved.
        throw new Error('Failed to save quotation to the database.');
    }

    // Prepare and send the email (no changes needed here)
    let emailContent = quotationTemplate;
    
    emailContent = emailContent.replace('{{quotation_no}}', quotation_no);
    emailContent = emailContent.replace('{{date}}', date);
    emailContent = emailContent.replace('{{customer_name}}', customer.name);
    emailContent = emailContent.replace('{{ic}}', customer.ic);
    emailContent = emailContent.replace('{{postcode}}', customer.postcode);
    emailContent = emailContent.replace('{{car_plate_number}}', car.plate);
    emailContent = emailContent.replace('{{car_brand}}', car.brand);
    emailContent = emailContent.replace('{{car_model}}', car.model);
    emailContent = emailContent.replace('{{manufactured_year}}', car.year);
    emailContent = emailContent.replace('{{engine_capacity}}', car.engineCapacity ? `${car.engineCapacity} cc` : 'N/A');
    emailContent = emailContent.replace('{{car_market_value}}', car.marketValue ? `RM ${car.marketValue.toLocaleString('en-MY')}` : 'N/A');
    emailContent = emailContent.replace('{{ncd}}', `${car.ncd}%`);
    emailContent = emailContent.replace('{{additional_protections_list}}', protectionsList);

    for (const placeholder in prices) {
      emailContent = emailContent.replace(`{{${placeholder}}}`, prices[placeholder]);
    }
    
    sendSmtpEmail.subject = 'Your Car Insurance Quotation';
    sendSmtpEmail.htmlContent = emailContent;
    sendSmtpEmail.sender = { name: 'CGS Insurance', email: 'yitiankok@gmail.com' };
    sendSmtpEmail.to = [{ email: email }];

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully. Data: ' + JSON.stringify(data));
        return { success: true };
    } catch (error) {
        console.error('Brevo API Error:', error);
        // We still consider it a success if the quote was saved, even if email fails.
        // The user can find their quote on the dashboard.
        return { success: true, warning: 'Quotation saved, but failed to send email.' };
    }
}

export { generateQuotationAndSendEmail };
