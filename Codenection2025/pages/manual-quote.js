import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useDebounce } from '../src/hooks/useDebounce';
import { validatePlateNumber } from '../src/utils/validationLogic';
export default function ManualQuoteWizard() {
  const [step, setStep] = useState(1);
  const [plateNumber, setPlateNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [protections, setProtections] = useState({});
  const [validation, setValidation] = useState({
    plateNumber: { isValid: false, error: null },
  });

  // Debounced plate number for validation
  const debouncedPlateNumber = useDebounce(plateNumber, 500);

  useEffect(() => {
    const validationResult = validatePlateNumber(debouncedPlateNumber, 'default');
    setValidation({
      plateNumber: {
        isValid: validationResult.isValid,
        error: validationResult.error,
      },
    });
  }, [debouncedPlateNumber]);

  const steps = [
    { id: 1, title: 'Enter car plate number' },
    { id: 2, title: 'Vehicle information' },
    { id: 3, title: 'Additional protection' },
    { id: 4, title: 'Finish' }
  ];

  const toggleProtection = (key) => {
    setProtections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNext = () => setStep((s) => Math.min(4, s + 1));
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  return (
    <>
      <Head>
        <title>Manual Quote - CGS Insurance</title>
      </Head>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-900">CGS</Link>
            <div className="bg-black text-white px-4 py-2 rounded text-sm font-medium">USER@GMAIL.COM</div>
          </div>
        </header>

        {/* Progress */}
        <section className="bg-blue-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between md:justify-start md:space-x-12">
            {steps.map((s) => (
              <div key={s.id} className="text-center">
                <div className={`w-28 h-28 rounded-full flex items-center justify-center text-5xl font-extrabold ${step === s.id ? 'bg-blue-800 text-white' : step > s.id ? 'bg-blue-300 text-white' : 'bg-blue-200 text-white'}`}>{s.id}</div>
                <div className="mt-2 text-sm text-blue-900 max-w-[8rem] leading-snug">{s.title}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Card */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-2xl shadow border border-gray-200 p-8">
            {step === 1 && (
              <div className="text-center">
                <h2 className="text-xl font-bold text-blue-800 mb-6">Please enter your car plate number:</h2>
                <div className="flex justify-center">
                  <input
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. PKD 8381"
                    className="w-full max-w-md px-6 py-4 bg-blue-50 rounded-xl text-blue-900 text-xl text-center outline-none border border-blue-100 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                {plateNumber.replace(/\s/g, '').length > 10 && (
                  <p className="mt-3 text-xs text-red-500">Maximum length: 10 characters exclude space</p>
                )}
                <div className="mt-8 flex justify-center space-x-4">
                  <button
                    onClick={handleNext}
                    className={`px-8 py-3 rounded-xl font-semibold text-white transition-colors duration-200 ${
                      !validation.plateNumber?.isValid || plateNumber.trim() === '' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-800 hover:bg-blue-900'
                    }`}
                    disabled={!validation.plateNumber?.isValid || plateNumber.trim() === ''}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="text-xl font-bold text-blue-900 mb-6">Car plate number: {plateNumber || '—'}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-blue-900 font-semibold mb-2">Car Brand:</label>
                    <input
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g. Toyota"
                      className="w-full px-4 py-3 bg-blue-50 rounded-lg text-blue-900 border border-blue-100 focus:ring-2 focus:ring-blue-400"
                    />
                    {brand && brand.toLowerCase() === 'toyata' && (
                      <p className="mt-2 text-xs text-blue-700">Did you mean <button type="button" className="underline" onClick={() => setBrand('Toyota')}>‘Toyota’</button>?</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-blue-900 font-semibold mb-2">Car Model:</label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full px-4 py-3 bg-blue-50 rounded-lg text-blue-900 border border-blue-100 focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="">Select model</option>
                      <option value="Vios">Vios</option>
                      <option value="Yaris">Yaris</option>
                      <option value="Corolla">Corolla</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-blue-900 font-semibold mb-2">Manufactured Year:</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-4 py-3 bg-blue-50 rounded-lg text-blue-900 border border-blue-100 focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="">Select year</option>
                      {Array.from({ length: 25 }, (_, i) => 2025 - i).map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-8 flex justify-between">
                  <button onClick={handleBack} className="px-8 py-3 rounded-xl font-semibold border border-blue-200 text-blue-900 hover:bg-blue-50">Back</button>
                  <button onClick={handleNext} className="px-8 py-3 rounded-xl font-semibold text-white bg-blue-800 hover:bg-blue-900">Next</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold text-blue-900 mb-6">Select additional protection:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Windscreen',
                    'Named Driver',
                    'All Driver',
                    'Natural Disaster (Special Perils)',
                    'Strike Riot and Civil Commotion',
                    'Personal Accident',
                    'Towing',
                    'Passengers coverage'
                  ].map((label) => (
                    <label key={label} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer">
                      <input type="checkbox" className="h-5 w-5" checked={!!protections[label]} onChange={() => toggleProtection(label)} />
                      <span className="text-blue-900">{label}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-8 flex justify-between">
                  <button onClick={handleBack} className="px-8 py-3 rounded-xl font-semibold border border-blue-200 text-blue-900 hover:bg-blue-50">Back</button>
                  <button onClick={handleNext} className="px-8 py-3 rounded-xl font-semibold text-white bg-blue-800 hover:bg-blue-900">Next</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center">
                <h2 className="text-xl font-bold text-blue-900 mb-2">Your insurance quotation</h2>
                <p className="text-blue-900">has been prepared for</p>
                <div className="mt-4 text-3xl font-extrabold text-blue-800">username123@gmail.com</div>
                <p className="mt-6 text-gray-600">If you have any questions, please do not hesitate to <a href="#" className="underline">contact us</a>.</p>
                <div className="mt-8">
                  <Link href="/dashboard" className="inline-block px-10 py-3 rounded-xl font-semibold text-white bg-blue-800 hover:bg-blue-900">Done</Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
