import admin from './firebase-admin'; 
import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import { quotationTemplate } from './quotationTemplate';

const db = admin.firestore();

async function generateQuotationAndSendEmail(quotationData) {
    // Brevo/Sendinblue Email setup
    let defaultClient;
    let apiKey;

    try {
        if (!process.env.BREVO_API_KEY) {
            throw new Error('BREVO_API_KEY is not defined in environment variables.');
        }
        defaultClient = SibApiV3Sdk.ApiClient.instance;
        apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;
    } catch (error) {
        console.error('Brevo API Key setup error:', error);
        throw new Error('Email service configuration failed: ' + error.message);
    }

    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Data processing & DEEP VALIDATION
    const { customer, car, coverage, estimatedPremium, email, timezoneOffset } = quotationData;

    const errors = [];
    if (!customer) errors.push('Customer data is missing');
    else {
        if (!customer.name) errors.push('Customer name is missing');
        if (!customer.ic) errors.push('Customer IC is missing');
        if (!customer.postcode) errors.push('Customer postcode is missing');
    }
    if (!car) errors.push('Car data is missing');
    else {
        if (typeof car.marketValue !== 'number') errors.push('Car market value is missing or invalid');
        if (!car.plate) errors.push('Car plate is missing');
        if (!car.model) errors.push('Car model is missing');
        if (!car.brand) errors.push('Car brand is missing');
        if (!car.year) errors.push('Car year is missing');
        if (!car.ncd) errors.push('Car NCD is missing');
    }
    if (!coverage) errors.push('Coverage data is missing');
    else {
        if (!coverage.type) errors.push('Coverage type is missing');
    }
    if (!estimatedPremium) errors.push('Estimated premium data is missing');
    else {
        if (typeof estimatedPremium.max !== 'number') errors.push('Estimated premium max value is missing or invalid');
        if (typeof estimatedPremium.min !== 'number') errors.push('Estimated premium min value is missing or invalid');
    }
    if (!email) errors.push('Email is missing');
    if (typeof timezoneOffset !== 'number') errors.push('Timezone offset is missing or invalid');

    if (errors.length > 0) {
        const errorMessage = 'Essential data is missing or invalid: ' + errors.join(', ');
        console.error('CRITICAL: ' + errorMessage, { quotationData });
        throw new Error(errorMessage);
    }

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

    for (const typeKey of Object.values(coverageTypeKeys)) {
        for (const insurerKey of Object.keys(insurers)) {
            prices[`${typeKey}_${insurerKey}`] = 'N/A';
        }
    }

    const selectedTypeKey = coverageTypeKeys[coverage.type];

    if (selectedTypeKey) {
        for (const [insurerKey, insurerPrice] of Object.entries(insurers)) {
            prices[`${selectedTypeKey}_${insurerKey}`] = `RM${insurerPrice.toFixed(2)}`;
        }
    }

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
        ...prices, 
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

// PASTE THIS NEW BLOCK
try {
    console.log('Attempting to save quotation to Firestore...');
    await db.collection('quotations').add(quotationToSave);
    console.log('Quotation saved for email:', email);
} catch (error) {
    console.error('CRITICAL: Error saving quotation to Firestore: ', error);
    // If we can't save to the DB, we must stop and tell the user.
    throw new Error('Failed to save quotation to the database.');
}
const sendEmailInBackground = async () => {
    try {
        console.log('Preparing email content in background...');
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
    
    emailContent = emailContent.replace(/{{\\w+}}/g, 'N/A');

    sendSmtpEmail.subject = 'Your Car Insurance Quotation';
    sendSmtpEmail.htmlContent = emailContent;
    sendSmtpEmail.sender = { name: 'CGS Insurance', email: 'yitiankok@gmail.com' };
    sendSmtpEmail.to = [{ email: email }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('SUCCESS: Background email sent to:', email);

} catch (error) {
    console.error('ERROR: Background email sending failed for:', email, error);
    // We only log this error. We do not re-throw it because the main
    // process has already returned a success message to the user.
}
};

// Fire-and-forget the email sending process.
sendEmailInBackground();

// Immediately return success to the user.
// The user can proceed while the email sends in the background.
return { success: true };
    }


export { generateQuotationAndSendEmail };