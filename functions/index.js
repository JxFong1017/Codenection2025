const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');

// Configure Nodemailer with an email service provider (e.g., SendGrid or Mailgun)
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net', // Example for SendGrid
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: 'apikey',
    pass: functions.config().sendgrid.key
  }
});

exports.generateAndSendQuotation = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to request a quotation.');
  }
  
  const quotationHtml = `
    <h1>Car Insurance Quotation</h1>
    <p>Name: ${data.name}</p>
    <p>Car Brand: ${data.brand}</p>
    <p>Estimated Premium Range: ${data.estimatedRange}</p>
    `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(quotationHtml, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();

  const mailOptions = {
    from: 'your-email@yourdomain.com',
    to: data.email,
    subject: 'Your Car Insurance Quotation',
    html: `Hello ${data.name},<br><br>Your car insurance quotation is attached to this email.`,
    attachments: [{
      filename: 'Quotation.pdf',
      content: pdfBuffer,
      contentType: 'application/pdf'
    }]
  };

  try {
    await transporter.sendMail(mailOptions);
    return { status: 'success', message: 'Quotation sent successfully!' };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send quotation email.');
  }
});