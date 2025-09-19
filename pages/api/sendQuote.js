// pages/api/sendQuote.js
import nodemailer from "nodemailer";
import puppeteer from "puppeteer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { recipientEmail, quotationData } = req.body;

    // 1️⃣ Generate HTML for quotation
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #2563eb; }
            .box { border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 8px; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Insurance Quotation</h1>
          <div class="box">
            <p><span class="label">Customer:</span> ${quotationData.customer.name}</p>
            <p><span class="label">IC/Passport:</span> ${quotationData.customer.ic}</p>
            <p><span class="label">Postcode:</span> ${quotationData.customer.postcode}</p>
          </div>
          <div class="box">
            <p><span class="label">Plate:</span> ${quotationData.car.plate}</p>
            <p><span class="label">Brand:</span> ${quotationData.car.brand}</p>
            <p><span class="label">Model:</span> ${quotationData.car.model}</p>
            <p><span class="label">Year:</span> ${quotationData.car.year}</p>
            <p><span class="label">NCD:</span> ${quotationData.car.ncd}%</p>
          </div>
          <div class="box">
            <p><span class="label">Coverage:</span> ${quotationData.coverage.type}</p>
            ${
              quotationData.coverage.protections
                ? `<p><span class="label">Protections:</span> ${quotationData.coverage.protections.join(
                    ", "
                  )}</p>`
                : ""
            }
          </div>
          <div class="box">
            <p><span class="label">Estimated Premium:</span> RM ${quotationData.estimatedPremium}</p>
          </div>
        </body>
      </html>
    `;

    // 2️⃣ Launch Puppeteer → generate PDF
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    // 3️⃣ Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // your Gmail
        pass: process.env.GMAIL_PASS, // app password
      },
    });

    // 4️⃣ Send email with PDF attachment
    await transporter.sendMail({
      from: `"Codenection Quotation" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      subject: "Your Insurance Quotation",
      text: "Please find attached your insurance quotation.",
      attachments: [
        {
          filename: "quotation.pdf",
          content: pdfBuffer,
        },
      ],
    });

    res.status(200).json({ success: true, message: "Email sent with PDF!" });
  } catch (error) {
    console.error("Error sending quotation:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
}
