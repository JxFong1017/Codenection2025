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

    // Data processing
    const { customer, car, coverage, estimatedPremium, email, timezoneOffset } = quotationData;

    // ---!!!--- COMPREHENSIVE FIX ---!!!--- 
    // Add guard clauses for all essential top-level objects to prevent server crash.
    if (!customer || !car || !coverage || !estimatedPremium || !email) {
        const missingData = {
            hasCustomer: !!customer,
            hasCar: !!car,
            hasCoverage: !!coverage,
            hasEstimatedPremium: !!estimatedPremium,
            hasEmail: !!email,
        };
        console.error('CRITICAL: Missing essential data in quotationData.', missingData);
        throw new Error('Essential data is missing. Cannot generate quotation.');
    }
    // ---!!!--- END FIX ---!!!---

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

    try {
      const docRef = await db.collection('quotations').add(quotationToSave);
      console.log('Quotation saved with ID: ', docRef.id);
    } catch (error) {
        console.error('Error saving quotation to Firestore: ', error);
        throw new Error('Failed to save quotation to the database.');
    }

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
        return { success: false, error: 'Failed to send email: ' + error.message };
    }
}

export { generateQuotationAndSendEmail };