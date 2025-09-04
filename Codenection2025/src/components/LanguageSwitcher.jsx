import { SUPPORTED_LANGUAGES, useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50, background: 'white',
      borderBottom: '1px solid #e5e7eb', padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center'
    }}>
      <span style={{ fontSize: 12, color: '#6b7280' }}>Language:</span>
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          style={{
            padding: '6px 10px', borderRadius: 8, border: '1px solid #d1d5db', cursor: 'pointer',
            background: language === lang.code ? '#111827' : 'white', color: language === lang.code ? 'white' : '#111827'
          }}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}


