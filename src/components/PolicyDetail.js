
const protectionLabels = {
  windscreen: "Windscreen",
  named_driver: "Named Driver",
  all_driver: "All Driver",
  natural_disaster: "Natural Disaster (Special Perils)",
  strike_riot: "Strike Riot and Civil Commotion",
  personal_accident: "Personal Accident",
  towing: "Towing",
  passengers_coverage: "Passengers coverage",
};

const formatCurrency = (value) => {
    const number = parseFloat(value);
    if (isNaN(number)) return 'N/A';
    return `RM ${number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const DetailRow = ({ label, value }) => (
  <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
    <dt className="text-sm font-medium text-gray-600">{label}</dt>
    <dd className="text-sm text-gray-800 font-semibold">{value || '-'}</dd>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-bold text-gray-800 border-b-2 border-blue-200 pb-2 mb-4">{title}</h3>
    <dl>{children}</dl>
  </div>
);

export default function PolicyDetail({ policy, onClose, t }) {
  if (!policy) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-blue-700 text-white p-5 flex justify-between items-center rounded-t-xl">
          <h2 className="text-2xl font-bold">{t('policy_details', 'Policy Details')}</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-3xl font-light">&times;</button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-center text-gray-600">{t('policy_confirmed_order_id', 'Your policy is confirmed. Order ID:')} <strong>{policy.id}</strong></p>

          <Section title={t('vehicle_information', 'Vehicle Information')}>
            <DetailRow label={t('car_plate_number', 'Car Plate Number')} value={policy.plateNumber} />
            <DetailRow label={t('car_brand_model', 'Car Brand & Model')} value={`${policy.car_brand} ${policy.vehicleModel}`} />
            <DetailRow label={t('manufactured_year', 'Manufactured Year')} value={policy.manufactured_year} />
          </Section>

          <Section title={t('coverage_details', 'Coverage Details')}>
            <DetailRow label={t('insurer', 'Insurer')} value={policy.insurer} />
            <DetailRow label={t('coverage_type', 'Coverage Type')} value={policy.coverage_type} />
            <DetailRow label={t('additional_protections', 'Additional Protections')} value={policy.selectedAddOns?.map(p => protectionLabels[p] || p).join(', ') || t('none', 'None')} />
          </Section>
          
          <Section title={t('personal_information', 'Personal Information')}>
            <DetailRow label={t('full_name', 'Full Name')} value={policy.customer_name} />
            <DetailRow label={t('ic_passport', 'IC / Passport')} value={policy.ic || policy.passport} />
            <DetailRow label={t('email', 'Email')} value={policy.user_email} />
            <DetailRow label={t('delivery_address', 'Delivery Address')} value={policy.cover_note_address} />
          </Section>

          <Section title={t('premium_breakdown', 'Premium Breakdown')}>
            <DetailRow label={t('sum_insured', 'Sum Insured')} value={formatCurrency(policy.sumInsured)} />
            <DetailRow label={t('basic_premium', 'Basic Premium')} value={formatCurrency(policy.basePremium)} />
            <DetailRow label={t('ncd', 'NCD')} value={`${policy.ncd || 0}%`} />
            <DetailRow label={t('ncd_amount', 'NCD Amount')} value={formatCurrency(policy.ncdAmount)} />
            <DetailRow label={t('additional_protections_premium', 'Additional Protections Premium')} value={formatCurrency(policy.additionalProtectionsPremium)} />
            <DetailRow label={t('gross_premium', 'Gross Premium')} value={formatCurrency(policy.grossPremium)} />
            <DetailRow label={t('sst_6', 'SST (6%)')} value={formatCurrency(policy.sst)} />
            <DetailRow label={t('stamp_duty', 'Stamp Duty')} value={formatCurrency(policy.stampDuty)} />
            <div className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t-2 border-gray-300">
              <dt className="text-base font-bold text-gray-900">{t('total_paid', 'Total Paid')}</dt>
              <dd className="text-lg text-blue-800 font-extrabold">{formatCurrency(policy.price)}</dd>
            </div>
          </Section>

        </div>
        
        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-100 p-4 flex justify-end rounded-b-xl border-t">
            <button onClick={onClose} className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700">
                {t('close', 'Close')}
            </button>
        </div>
      </div>
    </div>
  );
}
