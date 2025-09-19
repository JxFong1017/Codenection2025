
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

// This function will be called by your API route
async function generateQuotationAndSendEmail(quoteData) {
    try {
        // --- Step 1: Generate the PDF from HTML ---
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Resolve the path to your HTML template
        const templatePath = path.resolve(process.cwd(), 'quotation.html');
        let htmlTemplate = await fs.readFile(templatePath, 'utf8');

        // Replace placeholders with actual data
        for (const key in quoteData) {
            if (typeof quoteData[key] === 'object' && quoteData[key] !== null) {
                for (const subKey in quoteData[key]) {
                    const placeholder = new RegExp(`{{${key}_${subKey}}}`, 'g');
                    htmlTemplate = htmlTemplate.replace(placeholder, quoteData[key][subKey]);
                }
            } else {
                const placeholder = new RegExp(`{{${key}}}`, 'g');
                htmlTemplate = htmlTemplate.replace(placeholder, quoteData[key]);
            }
        }
        
        await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();

        // --- Step 2: Send the email with the PDF attachment ---
        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            secure: false,
            auth: {
                user: '974827001@smtp-brevo.com',
                pass: 'c8tDWTYRKUQxBpsC'
            }
        });

        const mailOptions = {
            from: 'yitiankok@gmail.com',
            to: quoteData.email,
            subject: 'Your Car Insurance Quotation',
            html: `Hello ${quoteData.customer.name},<br><br>Your car insurance quotation is attached.`,
            attachments: [{
                filename: 'Quotation.pdf',
                content: pdfBuffer,
                contentType: 'application/pdf'
            }]
        };

        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.error('Error in quotation service:', error);
        // Re-throw the error so the API route can catch it and send a 500 response
        throw new Error('Failed to generate and send quotation.');
    }
}

module.exports = { generateQuotationAndSendEmail };
