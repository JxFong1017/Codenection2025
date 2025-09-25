import { useRouter } from 'next/router';
import { useEffect, useState, useMemo } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Fuse from 'fuse.js';

import { carData } from '../src/data/carData';
import { useT } from "../src/utils/i18n";
import EditableSection from '../src/components/EditableSection';
import { useDebounce } from '../src/hooks/useDebounce';
import {
  validatePlateNumber,
  getModelsForMake,
  getYearsForModel,
  getUniqueMakes,
  validateIC,
  validatePassport,
  validatePostcode
} from '../src/utils/validationLogic';


export default function ConfirmPage() {
  const router = useRouter();
  const { quoteId } = router.query;

  // --- STATE AND HOOKS ---
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const t = useT();

  // Vehicle Info
  const [plate, setPlate] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [brandSearch, setBrandSearch] = useState('');
  const [modelSearch, setModelSearch] = useState('');
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);

  // Coverage Info
  const [coverageType, setCoverageType] = useState('');
  const [selectedProtections, setSelectedProtections] = useState([]);

  // Personal Info
  const [ncd, setNcd] = useState(0);
  const [name, setName] = useState('');
  const [documentType, setDocumentType] = useState('ic');
  const [ic, setIc] = useState('');
  const [passport, setPassport] = useState('');
  const [postcode, setPostcode] = useState('');

  // Validation State
  const [plateValidation, setPlateValidation] = useState({ isValid: null });
  const [brandValidation, setBrandValidation] = useState({ isValid: null });
  const [modelValidation, setModelValidation] = useState({ isValid: null });
  const [icValidation, setIcValidation] = useState({});
  const [passportValidation, setPassportValidation] = useState({});
  const [postcodeValidation, setPostcodeValidation] = useState({});
  const [showPlateSymbolError, setShowPlateSymbolError] = useState(false);

  // Debounced values for validation
  const debouncedPlate = useDebounce(plate, 400);
  const debouncedBrandSearch = useDebounce(brandSearch, 400);
  const debouncedModelSearch = useDebounce(modelSearch, 400);
  const debouncedIC = useDebounce(ic, 500);
  const debouncedPassport = useDebounce(passport, 500);
  const debouncedPostcode = useDebounce(postcode, 500);

  // Fuse.js for fuzzy search
  const allBrands = useMemo(() => getUniqueMakes(), []);
  const fuse = useMemo(() => new Fuse(allBrands, { keys: [], includeScore: true, threshold: 0.3 }), [allBrands]);
  const [modelFuse, setModelFuse] = useState(null);

  // --- DATA FETCHING ---
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (quoteId) {
      const fetchQuote = async () => {
        setLoading(true);
        try {
          const quoteRef = doc(db, 'quotations', quoteId);
          const quoteSnap = await getDoc(quoteRef);

          if (quoteSnap.exists()) {
            const quoteData = quoteSnap.data();
            setQuote({ id: quoteSnap.id, ...quoteData });

            // Set initial state from DB
            setPlate(quoteData.plateNumber || '');
            setBrand(quoteData.car_brand || '');
            setBrandSearch(quoteData.car_brand || '');
            setModel(quoteData.vehicleModel || '');
            setModelSearch(quoteData.vehicleModel || '');
            setYear(quoteData.manufactured_year || '');
            setName(quoteData.customer_name || '');
            setNcd(quoteData.ncd || 0);
            setDocumentType(quoteData.documentType || 'ic');
            setIc(quoteData.ic || '');
            setPassport(quoteData.passport || '');
            setPostcode(quoteData.postcode || '');
            
            // Infer coverage type from DB data
            if (quoteData.third_party_only_abc && quoteData.third_party_only_abc !== 'N/A') {
                setCoverageType('Third-Party Only');
            } else if (quoteData.tpft_abc && quoteData.tpft_abc !== 'N/A') {
                setCoverageType('Third-Party, Fire & Theft');
            } else {
                setCoverageType('Comprehensive');
            }

          } else {
            console.log('No such document!');
            setQuote(null);
          }
        } catch (error) {
          console.error("Error fetching quotation:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchQuote();
    }
  }, [quoteId]);

  // --- VALIDATION & LOGIC ---

  const formatICNumber = (value) => {
    const cleanedValue = value.replace(/\D/g, "");

    let formattedValue = "";
    if (cleanedValue.length > 0) {
      formattedValue = cleanedValue.slice(0, 6);
    }
    if (cleanedValue.length > 6) {
      formattedValue += "-" + cleanedValue.slice(6, 8);
    }
    if (cleanedValue.length > 8) {
      formattedValue += "-" + cleanedValue.slice(8, 12);
    }
    return formattedValue;
  };
  
    // Plate Validation
    useEffect(() => {
        if (!debouncedPlate) {
            setPlateValidation({ isValid: null, error: null });
            return;
        }
        const result = validatePlateNumber(debouncedPlate, 'default');
        setPlateValidation({ isValid: result.isValid, error: result.error });
    }, [debouncedPlate]);

    // Brand Validation and Auto-Correction
    useEffect(() => {
      if (!debouncedBrandSearch) {
          setBrandValidation({ isValid: null, error: null });
          return;
      }
      const normalizedSearch = debouncedBrandSearch.toLowerCase();
      const exactMatch = allBrands.find(
          (b) => b.toLowerCase() === normalizedSearch
      );
      
      if (exactMatch) {
          setBrand(exactMatch);
          setBrandSearch(exactMatch); // Sync search input with the valid brand
          setBrandValidation({ isValid: true, error: null });
          setShowBrandDropdown(false);
          return; // Found a perfect match, we're done.
      }

      // If no exact match, use Fuse.js for fuzzy search
      const fuzzyResults = fuse.search(normalizedSearch);
      if (fuzzyResults.length === 1 && fuzzyResults[0].score < 0.3) {
          const autoCorrectedBrand = fuzzyResults[0].item;
          setBrand(autoCorrectedBrand);
          setBrandSearch(autoCorrectedBrand); // Sync search input
          setBrandValidation({ isValid: true, error: null });
          setShowBrandDropdown(false);
      } else {
          // If no exact or strong fuzzy match, it's invalid
          setBrand(''); // IMPORTANT: Clear the brand to fail `isPageValid()` check
          setBrandValidation({
              isValid: false,
              error: 'Invalid car brand. Please select a valid brand from the list.',
          });
      }
  }, [debouncedBrandSearch, allBrands, fuse]);

    // Model Validation and Auto-Correction
    useEffect(() => {
      if (!debouncedModelSearch || !modelFuse) {
          setModelValidation({ isValid: null, error: null });
          return;
      }
      const normalizedSearch = debouncedModelSearch.toLowerCase();
      const exactMatch = availableModels.find(
          (m) => m.toLowerCase() === normalizedSearch
      );

      if (exactMatch) {
          setModel(exactMatch);
          setModelSearch(exactMatch); // Sync search input
          setModelValidation({ isValid: true, error: null });
          setShowModelDropdown(false);
          return; // Found a perfect match
      }

      // If no exact match, use fuzzy search
      const fuzzyResults = modelFuse.search(normalizedSearch);
      if (fuzzyResults.length === 1 && fuzzyResults[0].score < 0.3) {
          const autoCorrectedModel = fuzzyResults[0].item;
          setModel(autoCorrectedModel);
          setModelSearch(autoCorrectedModel); // Sync search input
          setModelValidation({ isValid: true, error: null });
          setShowModelDropdown(false);
      } else {
          // If no valid match, mark as invalid
          setModel(''); // IMPORTANT: Clear the model to fail `isPageValid()` check
          if (debouncedModelSearch.length > 0) { // Only show error if user has typed something
              setModelValidation({
                  isValid: false,
                  error: 'Invalid car model. Please select a valid model for the chosen brand.',
              });
          } else {
              setModelValidation({ isValid: null, error: null });
          }
      }
  }, [debouncedModelSearch, availableModels, modelFuse]);


    // IC / Passport Validation
    useEffect(() => {
        if (documentType === 'ic') {
            setIcValidation(validateIC(debouncedIC));
            setPassportValidation({ isValid: null, error: null });
        } else {
            setPassportValidation(validatePassport(debouncedPassport));
            setIcValidation({ isValid: null, error: null });
        }
    }, [debouncedIC, debouncedPassport, documentType]);

    // Postcode Validation
    useEffect(() => {
        setPostcodeValidation(validatePostcode(debouncedPostcode));
    }, [debouncedPostcode]);
  
    // Update model list when brand changes
    useEffect(() => {
        if (brand) {
            const models = getModelsForMake(brand);
            setAvailableModels(models);
            setModelFuse(new Fuse(models, { keys: [], includeScore: true, threshold: 0.3 }));
        } else {
            setAvailableModels([]);
            setModelFuse(null);
        }
    }, [brand]);

    // Update year list when model changes
    useEffect(() => {
        if (brand && model) {
            const years = getYearsForModel(brand, model);
            setAvailableYears(years);
            if (year && !years.includes(parseInt(year, 10))) {
                setYear('');
            }
        } else {
            setAvailableYears([]);
        }
    }, [brand, model, year]);


    // ** NEW ** Comprehensive page validation function
    const isPageValid = () => {
        const isVehicleValid = plateValidation.isValid && brand && model && year;
        
        const isPersonalInfoValid =
            name.trim() !== '' &&
            postcodeValidation.isValid &&
            (documentType === 'ic' ? icValidation.isValid : passportValidation.isValid);
        
        return isVehicleValid && isPersonalInfoValid;
    };

    // ** NEW ** Handler to save data and navigate
    const handleProceed = async () => {
        if (!isPageValid()) {
            alert('Please fill in all required fields correctly before proceeding.');
            return;
        }

        setLoading(true);
        try {
            const quoteRef = doc(db, 'quotations', quoteId);
            const updatedData = {
                plateNumber: plate,
                car_brand: brand,
                vehicleModel: model,
                manufactured_year: year,
                customer_name: name,
                ncd,
                documentType,
                ic,
                passport,
                postcode,
                // You may need to add updated coverage/protection info here too
            };
            await updateDoc(quoteRef, updatedData);
            router.push(`/choose-insurer?quoteId=${quoteId}`); // Navigate to the next step
        } catch (error) {
            console.error("Error updating quotation:", error);
            alert('Failed to save changes. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const isCarOlderThan15Years = () => {
        if (!year) return false;
        const currentYear = new Date().getFullYear();
        return currentYear - parseInt(year, 10) > 15;
    };


  const protectionOptions = [
    { id: 'windscreen', label: t('windscreen', 'Windscreen Protection') },
    { id: 'named_driver', label: t('named_driver', 'Additional Named Driver') },
    { id: 'all_driver', label: t('all_driver', 'All Drivers Coverage') },
    { id: 'natural_disaster', label: t('natural_disaster', 'Flood, Landslide & Special Perils') },
    { id: 'strike_riot', label: t('strike_riot', 'Strike, Riot, and Civil Commotion (SRCC)') },
    { id: 'personal_accident', label: t('personal_accident', 'Personal Accident (PA) Coverage') },
    { id: 'towing', label: t('towing', 'Unlimited Towing Service') },
    { id: 'passengers_coverage', label: t('passengers_coverage', 'Legal Liability to Passengers') },
  ];

  const handleCheckNcd = () => {
    window.open("https://www.mycarinfo.com.my/NCDCheck/Online", "_blank");
  };

  const handleProtectionChange = (e) => {
    const { name, checked } = e.target;
    if (checked) {
      setSelectedProtections(prev => [...prev, name]);
    } else {
      setSelectedProtections(prev => prev.filter(item => item !== name));
    }
  };

  const handlePlateInput = (e) => {
    const rawValue = e.target.value;
    
    // This part is for the symbol error, which is good to keep
    if (/[^a-zA-Z0-9\s]/g.test(rawValue)) {
      setShowPlateSymbolError(true);
    } else {
      setShowPlateSymbolError(false);
    }
  
    // This is the crucial part that I deleted, which I have now restored.
    // It cleans the value and adds the space between letters and numbers.
    const cleanValue = rawValue.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const formatted = cleanValue.replace(/([A-Z]+)(\d+)/, '$1 $2').replace(/(\d+)([A-Z]+)/, '$1 $2');
    
    setPlate(formatted.slice(0, 15));
  };


  // --- RENDER ---
  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="mt-4 text-gray-600">Quotation not found.</p>
          <Link href="/dashboard">
            <a className="text-blue-600 hover:underline">Back to Dashboard</a>
          </Link>
        </div>
      </div>
    );
  }

  
  const filteredBrands = brandSearch ? allBrands.filter((b) => b.toLowerCase().includes(brandSearch.toLowerCase())) : allBrands;
  const filteredModels = modelSearch && brand ? availableModels.filter((m) => m.toLowerCase().includes(modelSearch.toLowerCase())) : availableModels;

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Confirm Quotation - CGS Insurance</title>
        <meta name="description" content="Confirm your car insurance quotation" />
      </Head>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
              <Link href="/dashboard">
                <h1 className="text-2xl font-extrabold text-blue-900">CGS</h1>
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-900">
                Back to Home Page
              </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Renew Your Insurance</h2>
            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: "20%"}}></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Edit Quotation</span>
                <span>Choose Insurer</span>
                <span>Billing</span>
                <span>Confirm</span>
                <span>Payment</span>
              </div>
            </div>
            
            <div className="mt-8">
              <EditableSection title="Vehicle Info" isOpen={true}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Car Plate Number</label>
                    <input 
                      type="text" 
                      value={plate}
                      onChange={handlePlateInput}
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${!plateValidation.isValid ? 'border-red-500' : 'border-gray-300'}`} />
                    {plateValidation.error && <p className="mt-2 text-sm text-red-600">{plateValidation.error}</p>}
                    {showPlateSymbolError && (
                      <p className="mt-2 text-xs text-red-500">
                        Please use only letters and numbers.
                      </p>
                    )}
                                        {/^[a-zA-Z\s]*[iIoO][a-zA-Z0-9\s]*$/.test(plate) && (
                      <p className="mt-3 text-xs text-red-500">
                        Did you mean to use numbers &apos;1&apos; or &apos;0&apos;? Letters &apos;I&apos; and &apos;O&apos; are not allowed.
                      </p>
                    )}

                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700">Car Brand</label>
                    <input
                        type="text"
                        value={brandSearch}
                        onChange={(e) => { setBrandSearch(e.target.value); setBrand(''); setShowBrandDropdown(true); }}
                        onFocus={() => setShowBrandDropdown(true)}
                        onBlur={() => setTimeout(() => setShowBrandDropdown(false), 200)}
                        className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${brandValidation.isValid === false ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Search..."
                        autoComplete="off"
                    />
                    {brandValidation.error && <p className="mt-2 text-sm text-red-600">{brandValidation.error}</p>}
                    {showBrandDropdown && filteredBrands.length > 0 && (
                        <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                            {filteredBrands.map(b => <li key={b} className="px-4 py-2 hover:bg-blue-50 cursor-pointer" onMouseDown={() => { setBrand(b); setBrandSearch(b); setShowBrandDropdown(false); }}>{b}</li>)}
                        </ul>
                    )}
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700">Car Model</label>
                    <input
                        type="text"
                        value={modelSearch}
                        onChange={(e) => { setModelSearch(e.target.value); setModel(''); setShowModelDropdown(true); }}
                        disabled={!brand}
                        onFocus={() => setShowModelDropdown(true)}
                        onBlur={() => setTimeout(() => setShowModelDropdown(false), 200)}
                        className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${modelValidation.isValid === false ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder={!brand ? "Select a brand first" : "Search..."}
                        autoComplete="off"
                    />
                    {modelValidation.error && <p className="mt-2 text-sm text-red-600">{modelValidation.error}</p>}
                    {showModelDropdown && filteredModels.length > 0 && (
                        <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                            {filteredModels.map(m => <li key={m} className="px-4 py-2 hover:bg-blue-50 cursor-pointer" onMouseDown={() => { setModel(m); setModelSearch(m); setShowModelDropdown(false); }}>{m}</li>)}
                        </ul>
                    )}
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700">Manufactured Year</label>
                      <select value={year} onChange={(e) => setYear(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" disabled={!model}>
                          <option value="">{!model ? "Select a model first" : "Select Year"}</option>
                          {availableYears.sort((a, b) => b - a).map((y) => <option key={y} value={y}>{y}</option>)}
                      </select>
                      {isCarOlderThan15Years() && <p className="mt-2 text-red-500 font-normal text-xs">Your car is older than 15 years. Coverage may be limited.</p>}
                  </div>
                </div>
              </EditableSection>

              <EditableSection title="Coverage Type">
                  <div>
                    <label htmlFor="coverageType" className="block text-sm font-medium text-gray-700">{t('choose_coverage', 'Choose Your Coverage Type')}</label>
                    <select id="coverageType" name="coverage" value={coverageType} onChange={(e) => setCoverageType(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <option value="Third-Party Only">Third Party Only (No additional protection available)</option>
                      <option value="Third-Party, Fire & Theft">Third-Party, Fire & Theft (No additional protection available)</option>
                      <option value="Comprehensive">Comprehensive</option>
                    </select>
                  </div>
              </EditableSection>

              <EditableSection title="Additional Protection">
                {coverageType === 'Comprehensive' ? (
                  <div className="space-y-4">
                    {protectionOptions.map((protection) => (
                      <div key={protection.id} className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input id={protection.id} name={protection.id} type="checkbox" checked={selectedProtections.includes(protection.id)} onChange={handleProtectionChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={protection.id} className="font-medium text-gray-700">{protection.label}</label>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-red-500 font-medium">No additional protection available for this coverage type.</p>
                )}
              </EditableSection>

              <EditableSection title="Personal Details">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">{t("name", "Full Name")}</label>
                      <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">{t("ncd", "NCD")}</label>
                      <select value={ncd} onChange={(e) => setNcd(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <option value={0}>0%</option>
                        <option value={25}>25%</option>
                        <option value={30}>30%</option>
                        <option value={38.3}>38.3%</option>
                        <option value={45}>45%</option>
                        <option value={55}>55%</option>
                      </select>
                      <button type="button" onClick={handleCheckNcd} className="underline text-sm">Check NCD</button>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 mr-4">{t("id_type", "ID Type")}</span>
                      <label className="inline-flex items-center"><input type="radio" name="documentType" value="ic" checked={documentType === "ic"} onChange={() => { setDocumentType("ic"); setPassport(""); }} className="form-radio text-blue-600" /><span className="ml-2">{t("ic", "IC")}</span></label>
                      <label className="inline-flex items-center ml-6"><input type="radio" name="documentType" value="passport" checked={documentType === "passport"} onChange={() => { setDocumentType("passport"); setIc(""); }} className="form-radio text-blue-600" /><span className="ml-2">{t("Passport", "Passport")}</span></label>
                    </div>
                    {documentType === 'ic' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">{t("number_ic", "IC Number")}</label>
                        <input type="text" value={ic} onChange={(e) => setIc(formatICNumber(e.target.value))} className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${icValidation.isValid === false ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g. 050102-07-0304" />
                        {icValidation.error && <p className="mt-2 text-sm text-red-600">{icValidation.error}</p>}
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">{t("number_passport", "Passport Number")}</label>
                        <input type="text" value={passport} onChange={(e) => setPassport(e.target.value)} className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${passportValidation.isValid === false ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g. A12345678" />
                        {passportValidation.error && <p className="mt-2 text-sm text-red-600">{passportValidation.error}</p>}
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">{t("postcode", "Postcode")}</label>
                      <input type="text" value={postcode} onChange={(e) => setPostcode(e.target.value)} className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${postcodeValidation.isValid === false ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g. 50000" />
                      {postcodeValidation.error && <p className="mt-2 text-sm text-red-600">{postcodeValidation.error}</p>}
                    </div>
                  </div>
              </EditableSection>
              
              {/* --- NEW BUTTON LOCATION --- */}
              <div className="flex justify-end mt-8">
                  <button
                      onClick={handleProceed}
                      disabled={!isPageValid() || loading}
                      className={`px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                          !isPageValid() || loading 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-blue-800 hover:bg-blue-900'
                      }`}
                  >
                      {loading ? 'Saving...' : 'Save and Proceed to Next Step'}
                  </button>
              </div>
            </div>
        </>
      </main>
    </div>
  );
}
