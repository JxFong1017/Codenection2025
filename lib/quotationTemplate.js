export const quotationTemplate = `
<!DOCTYPE html>
<html>
<head>
    <title>Car Insurance Quotation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header a {
            font-size: 2rem; /* Equivalent to text-2xl */
            font-weight: bold; /* Equivalent to font-bold */
            color: #1e40af; /* A dark blue color, similar to text-blue-900 */
            text-decoration: none;
        }
        .section {
            margin-bottom: 20px;
        }
        .section h2 {
            border-bottom: 2px solid #333;
            padding-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>

    <div class="header">
        <a href="/dashboard">CGS</a>
    </div>

    <div class="section">
        <h1 style="text-align: center;">Car Insurance Quotation</h1>
        <p><strong>Quotation No.:</strong> {{quotation_no}}</p>
        <p><strong>Date:</strong> {{date}}</p>
    </div>

    <div class="section">
        <h2>Customer Details</h2>
        <p><strong>Name (as per IC):</strong> {{customer_name}}</p>
        <p><strong>IC:</strong> {{ic}}</p>
        <p><strong>Postcode:</strong> {{postcode}}</p>
    </div>

    <div class="section">
        <h2>Car Details</h2>
        <p><strong>Car Plate Number:</strong> {{car_plate_number}}</p>
        <p><strong>Car Brand:</strong> {{car_brand}}</p>
        <p><strong>Car Model:</strong> {{car_model}}</p>
        <p><strong>Manufactured Year:</strong> {{manufactured_year}}</p>
        <p><strong>Engine Capacity:</strong> {{engine_capacity}}</p>
        <p><strong>Estimated Car Market Value:</strong> RM {{car_market_value}}</p>
        <p><strong>NCD:</strong> {{ncd}}</p>
    </div>

    <div class="section">
        <h2>Coverage Options</h2>
        <table>
            <thead>
                <tr>
                    <th>Type Of Coverage</th>
                    <th>Insurance Company</th>
                    <th>Estimated Premium Range</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td rowspan="5">Comprehensive</td>
                    <td>ABC Insurance Ltd.</td>
                    <td>{{comprehensive_abc}}</td>
                </tr>
                <tr>
                    <td>XYZ General Insurance</td>
                    <td>{{comprehensive_xyz}}</td>
                </tr>
                <tr>
                    <td>SafeDrive Assurance</td>
                    <td>{{comprehensive_safedrive}}</td>
                </tr>
                <tr>
                    <td>Guardian Insurance</td>
                    <td>{{comprehensive_guardian}}</td>
                </tr>
                <tr>
                    <td>MetroProtect Insurance</td>
                    <td>{{comprehensive_metroprotect}}</td>
                </tr>
                <tr>
                    <td rowspan="5">Third Party, Fire & Theft</td>
                    <td>ABC Insurance Ltd.</td>
                    <td>{{tpft_abc}}</td>
                </tr>
                <tr>
                    <td>XYZ General Insurance</td>
                    <td>{{tpft_xyz}}</td>
                </tr>
                <tr>
                    <td>SafeDrive Assurance</td>
                    <td>{{tpft_safedrive}}</td>
                </tr>
                <tr>
                    <td>Guardian Insurance</td>
                    <td>{{tpft_guardian}}</td>
                </tr>
                <tr>
                    <td>MetroProtect Insurance</td>
                    <td>{{tpft_metroprotect}}</td>
                </tr>
                <tr>
                    <td>Third Party Only</td>
                    <td></td>
                    <td>{{third_party_only}}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Additional Protection</h2>
        <p><strong>Towing:</strong> +RM {{towing_fee}}</p>
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

</body>
</html>
`;
