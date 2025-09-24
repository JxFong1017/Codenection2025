import { quotationTemplate } from '../../lib/quotationTemplate';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function QuotationDetail({ quote, onClose }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const createQuotationHtml = () => {
    let html = quotationTemplate;

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

    for (const key in data) {
      html = html.replace(new RegExp('{{' + key + '}}', 'g'), data[key]);
    }
    
    html = html.replace(/{{\w+}}/g, 'N/A');

    return html;
  };

  const handleRenew = () => {
    router.push(`/confirm?quoteId=${quote.id}`);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!quote || !quote.id) {
        console.error("No quote or quote ID found, cannot delete.");
        return;
    }
    try {
      const quoteRef = doc(db, 'quotations', quote.id);
      await updateDoc(quoteRef, {
        status: 'deleted'
      });
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
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
        <div className="flex justify-end mt-4 space-x-4">
            <button
                onClick={handleRenew}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
                Renew Now
            </button>
            <button
                onClick={handleDelete}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
            >
                Delete quotation
            </button>
        </div>
        {showDeleteConfirm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-60">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <h3 className="text-lg font-bold mb-4">Are you sure you want to delete this quotation?</h3>
                    <div className="flex justify-center space-x-4">
                        <button onClick={cancelDelete} className="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400">Cancel</button>
                        <button onClick={confirmDelete} className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">Confirm</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}