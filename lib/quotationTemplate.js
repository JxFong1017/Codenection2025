export const quotationTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Car Insurance Quotation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            width: 80%;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .header, .footer {
            text-align: center;
            padding: 10px 0;
        }
        .header {
            border-bottom: 1px solid #ddd;
        }
        /* Updated CSS for the CGS logo */
        .header a {
            font-size: 2.5rem; /* Increased size for CGS */
            font-weight: 900;  /* Made bolder (900 is often ultra-bold) */
            color: #1e40af; /* A dark blue color, similar to text-blue-900 */
            text-decoration: none;
            display: block; /* Ensures it takes up its own line for better sizing control */
            margin-bottom: 5px; /* Adds a little space below the logo */
        }
        .header p {
            font-size: 1.2rem; /* Adjusted size for "Car Insurance Quotation" to be smaller than CGS */
            font-weight: normal;
            color: #555;
        }
        .footer {
            border-top: 1px solid #ddd;
            margin-top: 20px;
        }
        .content {
            margin-top: 20px;
        }
        .content h2 {
            color: #0056b3;
        }
        .info-table, .quotation-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .info-table td, .quotation-table th, .quotation-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .quotation-table th {
            background-color: #f2f2f2;
        }
        .info-table td:first-child {
            font-weight: bold;
            width: 30%;
        }
        .section {
            margin-top: 20px; /* Add some spacing between sections */
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <a href="/dashboard">CGS</a>
            <p>Your Car Insurance Quotation</p>
        </div>
        <div class="content">
            <p><strong>Quotation No:</strong> {{quotation_no}}</p>
            <p><strong>Date:</strong> {{date}}</p>

            <h2>Customer Information</h2>
            <table class="info-table">
                <tr><td>Name</td><td>{{customer_name}}</td></tr>
                <tr><td>IC/Passport</td><td>{{ic}}</td></tr>
                <tr><td>Postcode</td><td>{{postcode}}</td></tr>
            </table>

            <h2>Vehicle Information</h2>
            <table class="info-table">
                <tr><td>Car Plate Number</td><td>{{car_plate_number}}</td></tr>
                <tr><td>Car Brand</td><td>{{car_brand}}</td></tr>
                <tr><td>Car Model</td><td>{{car_model}}</td></tr>
                <tr><td>Manufactured Year</td><td>{{manufactured_year}}</td></tr>
                <tr><td>Engine Capacity</td><td>{{engine_capacity}}</td></tr>
                <tr><td>Estimated Car Market Value</td><td>{{car_market_value}}</td></tr>
                <tr><td>No-Claim Discount (NCD)</td><td>{{ncd}}</td></tr>
            </table>

            <h2>Quotation Details</h2>
            <table class="quotation-table">
                <thead>
                    <tr>
                        <th>Insurer</th>
                        <th>Comprehensive</th>
                        <th>Third-Party, Fire & Theft</th>
                        <th>Third-Party Only</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <strong>ABC Insurance Ltd.</strong><br>
                            <ul>
                                <li>FREE All Drivers Coverage</li>
                                <li>FREE 24-hour towing up to 50km every trip, no trip limit</li>
                                <li>FREE 24-hour roadside assistance program</li>
                                <li>FREE Jumpstart or change of battery service</li>
                                <li>FREE Refuel empty tank service</li>
                                <li>FREE Replacement of tyre service</li>
                            </ul>
                        </td>
                        <td>{{comprehensive_abc}}</td>
                        <td>{{tpft_abc}}</td>
                        <td>{{third_party_only_abc}}</td>
                    </tr>
                    <tr>
                        <td>
                            <strong>XYZ General Insurance</strong><br>
                            <ul>
                                <li>FREE 24 hours Emergency towing up to 100km</li>
                                <li>FREE 24 hours Roadside Assistance - Bantuan Ikhlas</li>
                                <li>FREE additional 10 drivers</li>
                                <li>FREE Jump start and Battery replacement services</li>
                                <li>FREE Changing of Flat Tyre Services</li>
                                <li>FREE Petrol Assistance Services</li>
                                <li>FREE Locksmith Services</li>
                            </ul>
                        </td>
                        <td>{{comprehensive_xyz}}</td>
                        <td>{{tpft_xyz}}</td>
                        <td>{{third_party_only_xyz}}</td>
                    </tr>
                    <tr>
                        <td>
                            <strong>SafeDrive Assurance</strong><br>
                            <ul>
                                <li>FREE 24-hour Emergency Towing up to 150km</li>
                                <li>FREE 24-hour Roadside Assistance</li>
                                <li>FREE Jumpstart or change of battery service</li>
                                <li>FREE Refuel empty tank service</li>
                                <li>FREE Replacement of tyre service</li>
                            </ul>
                        </td>
                        <td>{{comprehensive_safedrive}}</td>
                        <td>{{tpft_safedrive}}</td>
                        <td>{{third_party_only_safedrive}}</td>
                    </tr>
                    <tr>
                        <td>
                            <strong>Guardian Insurance</strong><br>
                            <ul>
                                <li>FREE 24-hour Emergency Towing up to 150km</li>
                                <li>FREE 1 Additional Driver</li>
                                <li>FREE 24-hour Claim Assistance</li>
                                <li>Best Car Insurer 2018</li>
                                <li>Instant Cover Note approval</li>
                                <li>Suitable for E-hailing purpose</li>
                            </ul>
                        </td>
                        <td>{{comprehensive_guardian}}</td>
                        <td>{{tpft_guardian}}</td>
                        <td>{{third_party_only_guardian}}</td>
                    </tr>
                    <tr>
                        <td>
                            <strong>MetroProtect Insurance</strong><br>
                            <ul>
                                <li>FREE 24-hour Emergency Towing up to 150km</li>
                                <li>FREE 24-hour Roadside Assistance</li>
                                <li>FREE Jumpstart or change of battery service</li>
                                <li>FREE Refuel empty tank service</li>
                                <li>FREE Replacement of tyre service</li>
                                <li>FREE 1 Additional Driver</li>
                                <li>FREE 24-hour Claim Assistance</li>
                                <li>FREE Personal Accident (PA) coverage for Policy Holder (Up to RM 10,000.00)</li>
                                <li>FREE Medical Expenses for Policy Holder (Up to RM1,500)</li>
                                <li>FREE Key Replacement</li>
                                <li>FREE Childseat Replacement</li>
                                <li>Suitable for E-hailing purpose</li>
                            </ul>
                        </td>
                        <td>{{comprehensive_metroprotect}}</td>
                        <td>{{tpft_metroprotect}}</td>
                        <td>{{third_party_only_metroprotect}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2>Included Additional Protection (Selected)</h2>
            {{additional_protections_list}}
        </div>

        <div class="section">
            <h2>Notes</h2>
            <p>Final premium depends on confirmed vehicle details, driver profile, and add-on choices.</p>
            <p>Quotation is valid for 15 days.</p>
            <p>The premium calculated above has included stamp duty (RM10) and 6% SST.</p>
        </div>

        <div class="section">
            <h2>Agent Details</h2>
            <p><strong>Agent Name:</strong> CGS Insurance Consultant</p>
            <p><strong>Contact:</strong> +6012-3456789</p>
        </div>

        <div class="footer">
            <p>This is a computer-generated document. No signature is required.</p>
            <p>For any inquiries, please contact us at yitiankok@gmail.com</p>
        </div>
    </div>
</body>
</html>
`;