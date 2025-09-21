
import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import { quotationTemplate } from './quotationTemplate';

async function generateQuotationAndSendEmail(quotationData) {
    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    const now = new Date();
    const quotation_no = `QT${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
    const date = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const { customer, car, coverage, estimatedPremium, email } = quotationData;

    const formatPremium = (premium) => {
        if (premium.min === premium.max) {
            return `RM${premium.min}`;
        }
        return `RM${premium.min} - RM${premium.max}`;
    }

    const emailContent = quotationTemplate
      .replace('{{quotation_no}}', quotation_no)
      .replace('{{date}}', date)
      .replace('{{customer_name}}', customer.name)
      .replace('{{ic}}', customer.ic)
      .replace('{{postcode}}', customer.postcode)
      .replace('{{car_plate_number}}', car.plate)
      .replace('{{car_brand}}', car.brand)
      .replace('{{car_model}}', car.model)
      .replace('{{manufactured_year}}', car.year)
      .replace('{{engine_capacity}}', "N/A")
      .replace('{{car_market_value}}', "N/A")
      .replace('{{ncd}}', `${car.ncd}%`)
      .replace('{{comprehensive_abc}}', formatPremium(estimatedPremium))
      .replace('{{comprehensive_xyz}}', formatPremium(estimatedPremium))
      .replace('{{comprehensive_safedrive}}', formatPremium(estimatedPremium))
      .replace('{{comprehensive_guardian}}', formatPremium(estimatedPremium))
      .replace('{{comprehensive_metroprotect}}', formatPremium(estimatedPremium))
      .replace('{{tpft_abc}}', "N/A")
      .replace('{{tpft_xyz}}', "N/A")
      .replace('{{tpft_safedrive}}', "N/A")
      .replace('{{tpft_guardian}}', "N/A")
      .replace('{{tpft_metroprotect}}', "N/A")
      .replace('{{third_party_only}}', "N/A")
      .replace('{{towing_fee}}', "50");

    sendSmtpEmail.subject = 'Your Car Insurance Quotation';
    sendSmtpEmail.htmlContent = emailContent;
    sendSmtpEmail.sender = { name: 'CGS Insurance', email: 'yitiankok@gmail.com' };
    sendSmtpEmail.to = [{ email: email }];

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        return { success: true };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to send email');
    }
}

export { generateQuotationAndSendEmail };
