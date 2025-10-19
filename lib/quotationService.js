
import * as admin from 'firebase-admin';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import { quotationTemplate } from './quotationTemplate';

// --- Firebase Admin SDK Initialization ---
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT_KEY),
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    throw new Error('Firebase admin initialization failed.');
  }
}

const db = admin.firestore();

// --- The rest of your service logic ---

async function generateQuotationAndSendEmail(quotationData) {
    // Brevo/Sendinblue Email setup
    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Data processing
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

    // --- START: Corrected Price Generation Logic ---
    const prices = {};
    const insurers = {
        abc: abcPrice,
        xyz: xyzPrice,
        safedrive: safeDrivePrice,
        guardian: guardianPrice,
        metroprotect: metroProtectPrice
    };
    const coverageTypeKeys = {
        'Comprehensive': 'comprehensive',
        'Third-Party, Fire & Theft': 'tpft',
        'Third-Party Only': 'third_party_only'
    };

    // Initialize all possible prices to 'N/A'
    for (const typeKey of Object.values(coverageTypeKeys)) {
        for (const insurerKey of Object.keys(insurers)) {
            prices[`${typeKey}_${insurerKey}`] = 'N/A';
        }
    }

    // Get the key for the selected coverage type
    const selectedTypeKey = coverageTypeKeys[coverage.type];

    // If the selected coverage type is valid, fill in its prices
    if (selectedTypeKey) {
        for (const [insurerKey, insurerPrice] of Object.entries(insurers)) {
            prices[`${selectedTypeKey}_${insurerKey}`] = `RM${insurerPrice.toFixed(2)}`;
        }
    }
    // --- END: Corrected Price Generation Logic ---

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
        price: `RM${metroProtectPrice.toFixed(2)}`,
        coverage_type: coverage.type,
        status: 'pending',
        additional_protections_list: protectionsList,
        ...prices, // Spread the complete prices object
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

    // Save the document using the ADMIN SDK
    try {
      const docRef = await db.collection('quotations').add(quotationToSave);
      console.log('Quotation saved with ID: ', docRef.id);
    } catch (error) {
        console.error('Error saving quotation to Firestore: ', error);
        throw new Error('Failed to save quotation to the database.');
    }

    // Prepare and send the email
    let emailContent = quotationTemplate;
    
    const emailPlaceholders = {
      quotation_no: quotation_no,
      date: date,
      customer_name: customer.name,
      ic: customer.ic,
      postcode: customer.postcode,
      car_plate_number: car.plate,
      car_brand: car.brand,
      car_model: car.model,
      manufactured_year: car.year,
      engine_capacity: car.engineCapacity ? `${car.engineCapacity} cc` : 'N/A',
      car_market_value: car.marketValue ? `RM ${car.marketValue.toLocaleString('en-MY')}` : 'N/A',
      ncd: `${car.ncd}%`,
      additional_protections_list: protectionsList,
      ...prices
    };

    for (const [key, value] of Object.entries(emailPlaceholders)) {
        emailContent = emailContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    
    // Replace any remaining placeholders with N/A
    emailContent = emailContent.replace(/{{\w+}}/g, 'N/A');

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
        return { success: true, warning: 'Quotation saved, but failed to send email.' };
    }
}

export { generateQuotationAndSendEmail };
