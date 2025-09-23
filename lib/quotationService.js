import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import { quotationTemplate } from './quotationTemplate';
import { db } from './firebase'; // Import the db instance
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions

async function generateQuotationAndSendEmail(quotationData) {
    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    const { customer, car, coverage, estimatedPremium, email, timezoneOffset } = quotationData;

    const now = new Date();
    const userLocalDate = new Date(now.getTime() - (timezoneOffset * 60 * 1000));

    const quotation_no = `QT${userLocalDate.getFullYear()}${(userLocalDate.getMonth() + 1).toString().padStart(2, '0')}${userLocalDate.getDate().toString().padStart(2, '0')}${userLocalDate.getHours().toString().padStart(2, '0')}${userLocalDate.getMinutes().toString().padStart(2, '0')}`;
    const date = userLocalDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });


    const currentMarketValue = car.marketValue;

    // Calculate all possible prices
    const metroProtectPrice = estimatedPremium.max;
    const safeDrivePrice = metroProtectPrice - 10;
    const guardianPrice = safeDrivePrice - 10;
    const xyzPrice = guardianPrice - 10;
    const abcPrice = estimatedPremium.min;
    
    // Determine which price to display based on selected coverage
    const getPriceForCoverage = (comprehensive, tpft, thirdPartyOnly) => {
        if (coverage.type === 'Comprehensive') return `RM${comprehensive.toFixed(2)}`;
        if (coverage.type === 'Third-Party, Fire & Theft') return `RM${tpft.toFixed(2)}`;
        if (coverage.type === 'Third-Party Only') return `RM${thirdPartyOnly.toFixed(2)}`;
        return 'N/A';
    };

    // Calculate prices for each insurer and coverage type
    const prices = {
        comprehensive_abc: `RM${abcPrice.toFixed(2)}`,
        comprehensive_xyz: `RM${xyzPrice.toFixed(2)}`,
        comprehensive_safedrive: `RM${safeDrivePrice.toFixed(2)}`,
        comprehensive_guardian: `RM${guardianPrice.toFixed(2)}`,
        comprehensive_metroprotect: `RM${metroProtectPrice.toFixed(2)}`,

        tpft_abc: `RM${abcPrice.toFixed(2)}`,
        tpft_xyz: `RM${xyzPrice.toFixed(2)}`,
        tpft_safedrive: `RM${safeDrivePrice.toFixed(2)}`,
        tpft_guardian: `RM${guardianPrice.toFixed(2)}`,
        tpft_metroprotect: `RM${metroProtectPrice.toFixed(2)}`,

        third_party_only_abc: `RM${abcPrice.toFixed(2)}`,
        third_party_only_xyz: `RM${xyzPrice.toFixed(2)}`,
        third_party_only_safedrive: `RM${safeDrivePrice.toFixed(2)}`,
        third_party_only_guardian: `RM${guardianPrice.toFixed(2)}`,
        third_party_only_metroprotect: `RM${metroProtectPrice.toFixed(2)}`,
    };

    // Replace the prices with "N/A" if the coverage type is not selected
    for (const key in prices) {
      if (key.includes('comprehensive') && coverage.type !== 'Comprehensive') {
        prices[key] = 'N/A';
      }
      if (key.includes('tpft') && coverage.type !== 'Third-Party, Fire & Theft') {
        prices[key] = 'N/A';
      }
      if (key.includes('third_party_only') && coverage.type !== 'Third-Party Only') {
        prices[key] = 'N/A';
      }
    }

    // Process and format additional protections (THIS SECTION IS UPDATED)
    let protectionsList = '';
    // The keys in the protections object are the translated strings, e.g., "Windscreen", "Towing", etc.
    const selectedProtections = Object.keys(coverage.protections || {}).filter(key => coverage.protections[key]);

    if (selectedProtections.length > 0) {
        protectionsList = `<ul>`;
        for (const key of selectedProtections) {
            let price = 0;
            // The switch statement cases must match the keys from the UI
            switch (key) {
                case "Windscreen":
                    price = 150;
                    break;
                case "Natural Disaster":
                    price = currentMarketValue * 0.005;
                    break;
                case "Strike, Riot & Civil Commotion": // The name from the UI
                    price = currentMarketValue * 0.003;
                    break;
                case "Personal Accident":
                    price = 100;
                    break;
                case "Towing":
                    price = 50;
                    break;
                case "Named Driver":
                    price = 10;
                    break;
                case "All Driver":
                    price = 50;
                    break;
                case "Passengers Coverage":
                    price = 25;
                    break;
                default:
                    price = 0;
            }
            protectionsList += `<li>${key}: +RM ${price.toFixed(2)}</li>`;
        }
        protectionsList += `</ul>`;
    } else {
        protectionsList = `<p>None selected.</p>`;
    }
 // *** ADDED: Create the object to save to Firestore ***
 const quotationToSave = {
    userId: email,
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
    price: metroProtectPrice, 
    status: 'pending',
    additional_protections_list: protectionsList,
    ...prices,
  };

  // *** ADDED: Save the document to Firestore ***
  try {
      const docRef = await addDoc(collection(db, 'quotations'), quotationToSave);
      console.log('Quotation saved to Firestore with ID: ', docRef.id);
  } catch (error) {
      console.error('Error saving quotation to Firestore: ', error);
      throw new Error('Failed to save quotation to the database.');
  }

  // Prepare and send the email (as before)
    let emailContent = quotationTemplate;
    
    // Replace all placeholders
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
    emailContent = emailContent.replace('{{car_market_value}}', car.marketValue ? `RM ${car.marketValue.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A');
    emailContent = emailContent.replace('{{ncd}}', `${car.ncd}%`);
    emailContent = emailContent.replace('{{additional_protections_list}}', protectionsList);

    // Replace the dynamic prices for each insurer and coverage type
    for (const placeholder in prices) {
      emailContent = emailContent.replace(`{{${placeholder}}}`, prices[placeholder]);
    }
    
    sendSmtpEmail.subject = 'Your Car Insurance Quotation';
    sendSmtpEmail.htmlContent = emailContent;
    sendSmtpEmail.sender = { name: 'CGS Insurance', email: 'yitiankok@gmail.com' };
    sendSmtpEmail.to = [{ email: email }];

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        return { success: true };
    } catch (error) {
        console.error('Brevo API Error:', error);
        // Even if email fails, the data is already saved. We still throw an error to inform the user.
        throw new Error('Failed to send quotation email.');
    }
}

export { generateQuotationAndSendEmail };