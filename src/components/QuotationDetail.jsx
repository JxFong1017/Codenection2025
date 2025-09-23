
import { quotationTemplate } from '../../lib/quotationTemplate';

export default function QuotationDetail({ quote, onClose }) {
  const createQuotationHtml = () => {
    let html = quotationTemplate;

    // The 'quote' object now comes directly from Firestore with all the saved details
    const data = {
      quotation_no: quote.quotation_no || quote.id,
      date: quote.date || new Date().toLocaleDateString(),
      customer_name: quote.customer_name || 'N/A',
      ic: quote.ic || 'N/A',
      postcode: quote.postcode || 'N/A',
      car_plate_number: quote.plateNumber || 'N/A',
      car_brand: quote.car_brand || 'N/A',
      car_model: quote.vehicleModel || 'N/A',
      manufactured_year: quote.manufactured_year || 'N/A',
      engine_capacity: quote.engine_capacity ? `${quote.engine_capacity} cc` : 'N/A',
      car_market_value: quote.car_market_value ? `RM ${quote.car_market_value.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A',
      ncd: quote.ncd ? `${quote.ncd}%` : 'N/A',
      additional_protections_list: quote.additional_protections_list || '<p>None selected.</p>',
      
      // Prices from the database
      comprehensive_abc: quote.comprehensive_abc || 'N/A',
      tpft_abc: quote.tpft_abc || 'N/A',
      third_party_only_abc: quote.third_party_only_abc || 'N/A',

      comprehensive_xyz: quote.comprehensive_xyz || 'N/A',
      tpft_xyz: quote.tpft_xyz || 'N/A',
      third_party_only_xyz: quote.third_party_only_xyz || 'N/A',

      comprehensive_safedrive: quote.comprehensive_safedrive || 'N/A',
      tpft_safedrive: quote.tpft_safedrive || 'N/A',
      third_party_only_safedrive: quote.third_party_only_safedrive || 'N/A',

      comprehensive_guardian: quote.comprehensive_guardian || 'N/A',
      tpft_guardian: quote.tpft_guardian || 'N/A',
      third_party_only_guardian: quote.third_party_only_guardian || 'N/A',

      comprehensive_metroprotect: quote.comprehensive_metroprotect || 'N/A',
      tpft_metroprotect: quote.tpft_metroprotect || 'N/A',
      third_party_only_metroprotect: quote.third_party_only_metroprotect || 'N/A',
    };

    // Replace all placeholders with the data from the quote object
    for (const key in data) {
      html = html.replace(new RegExp('{{' + key + '}}', 'g'), data[key]);
    }
    
    // Clean up any remaining placeholders that might not have had data
    html = html.replace(/{{\w+}}/g, 'N/A');

    return html;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Quotation Details</h2>
          <button
            onClick={onClose}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Close
          </button>
        </div>
        <iframe
          srcDoc={createQuotationHtml()}
          style={{ width: '100%', height: '70vh', border: 'none' }}
          title="Quotation Detail"
        />
      </div>
    </div>
  );
}
