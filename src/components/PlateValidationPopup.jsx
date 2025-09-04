import { useT } from '../utils/i18n';

export default function PlateValidationPopup({ 
  isOpen, 
  onClose, 
  onProceed, 
  onRenew, 
  onTransfer, 
  validationResult 
}) {
  const t = useT();

  if (!isOpen || !validationResult) return null;

  const { type, title, message, canProceed, showOptions } = validationResult;

  // Get translated title and message
  const getTranslatedContent = () => {
    switch (type) {
      case 'expired':
        return {
          title: t('policy_expired'),
          message: message // Use the message from validation result
        };
      case 'expiring_soon':
        return {
          title: t('policy_expiring_soon'),
          message: message
        };
      case 'active':
        return {
          title: t('active_policy_found'),
          message: message
        };
      default:
        return { title, message };
    }
  };

  const { title: translatedTitle, message: translatedMessage } = getTranslatedContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
            type === 'expired' ? 'bg-red-100' : 
            type === 'expiring_soon' ? 'bg-yellow-100' : 'bg-blue-100'
          }`}>
            <svg className={`w-6 h-6 ${
              type === 'expired' ? 'text-red-600' : 
              type === 'expiring_soon' ? 'text-yellow-600' : 'text-blue-600'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {type === 'expired' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{translatedTitle}</h3>
        </div>

        {/* Message */}
        <p className="text-gray-700 mb-6">{translatedMessage}</p>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3">
          {showOptions && (
            <>
              <button
                onClick={onRenew}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {t('renew_early')}
              </button>
              <button
                onClick={onTransfer}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                {t('transfer_ownership')}
              </button>
            </>
          )}
          
          {canProceed && (
            <button
              onClick={onProceed}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              {t('proceed_anyway')}
            </button>
          )}
          
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
