
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import EditableSection from '../src/components/EditableSection';
import { carData } from '../src/data/carData';
import { useT } from "../src/utils/i18n";


export default function ConfirmPage() {
  const router = useRouter();
  const { quoteId } = router.query;

  // --- ALL STATE AND HOOKS MUST BE AT THE TOP ---
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [plate, setPlate] = useState('');
  const { data: session, status } = useSession();
   const t = useT();
  const [brandSearch, setBrandSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [availableYears, setAvailableYears] = useState([]);
  const [coverageType, setCoverageType] = useState('Comprehensive');
  // --- Personal Info State ---
  const [ncd, setNcd] = useState(0);
  const [name, setName] = useState(''); // This is the missing state
  const [documentType, setDocumentType] = useState('ic');
  const [ic, setIc] = useState('');
  const [passport, setPassport] = useState('');
  const [postcode, setPostcode] = useState('');

  // --- Validation State ---
  const [icValidation, setIcValidation] = useState({});
  const [passportValidation, setPassportValidation] = useState({});
  const [postcodeValidation, setPostcodeValidation] = useState({});

  // Define the complete list of available protection options
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


// Add state to manage which protections are selected
const [selectedProtections, setSelectedProtections] = useState([]);
const handleCheckNcd = () => {
  alert("The 'Check NCD' functionality is not yet connected in this section.");
};

const handleProtectionChange = (e) => {
  const { name, checked } = e.target;
  if (checked) {
    // If checked, add the protection id to the array
    setSelectedProtections(prev => [...prev, name]);
  } else {
    // If unchecked, remove it from the array
    setSelectedProtections(prev => prev.filter(item => item !== name));
  }
};

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
            setPlate(quoteData.plateNumber || '');
            setBrand(quoteData.car_brand || '');
            setBrandSearch(quoteData.car_brand || '');
            setModel(quoteData.vehicleModel || '');
            setModelSearch(quoteData.vehicleModel || '');
            setYear(quoteData.manufactured_year || '');
            // *** FIX: Set coverage type and protections from fetched data ***
            setCoverageType(quoteData.coverageType || 'Comprehensive');
            setSelectedProtections(quoteData.additional_protections_list || []);
            // *** CORRECTED: Auto-fill Personal Info ***
            setName(quoteData.customer_name || ''); // Using customer_name now
            setNcd(quoteData.ncd || 0);
            setDocumentType(quoteData.documentType || 'ic');
            setIc(quoteData.ic || '');
            setPassport(quoteData.passport || '');
            setPostcode(quoteData.postcode || '');

          } else {
            console.log('No such document!');
            setQuote(null); // Explicitly set quote to null if not found
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
  
  // --- ALL LOGIC AND HELPER FUNCTIONS BEFORE RETURNS ---
  const uniqueBrands = [...new Set(carData.map((car) => car.make))];
  const filteredBrands = brandSearch
    ? uniqueBrands.filter((b) =>
        b.toLowerCase().includes(brandSearch.toLowerCase())
      )
    : uniqueBrands;

  const filteredModels = modelSearch
    ? [...new Set(carData
        .filter((car) => car.make === brand)
        .map((car) => car.model)
        .filter((m) => m.toLowerCase().includes(modelSearch.toLowerCase())))]
    : [...new Set(carData.filter((car) => car.make === brand).map((car) => car.model))];
   
    const [showPlateSymbolError, setShowPlateSymbolError] = useState(false);

  // This is the useEffect that was causing the error
  useEffect(() => {
    // This effect updates the list of available years based on the selected brand and model.
    let newAvailableYears = [];
    if (brand && model) {
      const selectedCar = carData.find(c => c.make === brand && c.model === model);
      if (selectedCar) {
        newAvailableYears = selectedCar.years;
      }
    }
    setAvailableYears(newAvailableYears);

    // IMPORTANT: Only reset the selected year if it's no longer a valid option
    // in the new list of years. This preserves the initial value from Firebase.
    if (year && !newAvailableYears.includes(parseInt(year, 10))) {
      setYear("");
    }
  }, [brand, model, year]);


  const handlePlateInput = (e) => {
    const rawValue = e.target.value;
    
    // Check if the raw input contains any characters that are NOT letters, numbers, or spaces.
    if (/[^a-zA-Z0-9\s]/g.test(rawValue)) {
      setShowPlateSymbolError(true); // If so, set state to show the error
    } else {
      setShowPlateSymbolError(false); // Otherwise, hide it
    }
  
    // The rest of the function proceeds as before, cleaning the value
    const cleanValue = rawValue.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const formatted = cleanValue.replace(/([A-Z]+)(\d+)/, '$1 $2').replace(/(\d+)([A-Z]+)/, '$1 $2');
    setPlate(formatted.slice(0, 15));
  };
  

  const isVehicleInfoValid = () => {
    // 1. Validate Plate Number
    const plainPlate = plate.replace(/\s/g, "");
    const isPlateValid =
      plainPlate.length > 0 &&
      plainPlate.length <= 10 &&
      /^[a-zA-Z0-9]+$/.test(plainPlate) &&
      !/[iIoO]/.test(plainPlate);
  
    // 2. Validate Brand, Model, and Year
    const isBrandValid = !!brand;
    const isModelValid = !!model;
    const isYearValid = !!year;
  
    // 3. Return true only if all are valid
    return isPlateValid && isBrandValid && isModelValid && isYearValid;
  };
  

  const isCarOlderThan15Years = () => {
    if (!year) return false;
    const currentYear = new Date().getFullYear();
    return currentYear - parseInt(year, 10) > 15;
  };
  
  // --- CONDITIONAL RETURNS ARE NOW AT THE END OF THE LOGIC ---
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

  // --- RENDER ---
  return (
    // *** FIX: Removed incorrect outer elements and added a single root div ***
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
                Back to Dashboard
              </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* This is the new conditional rendering part */}
        {loading || status === 'loading' ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : !quote ? (
          <div className="text-center py-20">
            <p className="mt-4 text-2xl font-bold text-gray-700">Quotation not found.</p>
            <p className="mt-2 text-gray-500">The link may have expired or the quotation has been removed.</p>
            <Link href="/dashboard" className="mt-6 inline-block px-6 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900">
              Back to Dashboard
            </Link>
          </div>
        ) : (
          // This is your original content, now rendered conditionally
          <>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Renew Your Insurance</h2>
            {/* Progress Bar */}
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
                  {/* Plate Number (no changes) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Car Plate Number</label>
                    <input 
                      type="text" 
                      value={plate}
                      onChange={handlePlateInput}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    {showPlateSymbolError && (
                      <p className="mt-2 text-xs text-red-500">
                        Please use only letters and numbers.
                      </p>
                    )}
                    {plate.replace(/\s/g, "").length > 10 && (
                        <p className="mt-3 text-xs text-red-500">
                          Plate number cannot exceed 10 characters.
                        </p>
                    )}
                    
                    {!/^[a-zA-Z0-9\s]*$/.test(plate) && plate.length > 0 && (
                    <p className="mt-3 text-xs text-red-500">
                    Please use only letters and numbers.
                    </p>
                    )}

                    {/^[a-zA-Z\s]*[iIoO][a-zA-Z0-9\s]*$/.test(plate) && (
                    <p className="mt-3 text-xs text-red-500">
                      Did you mean to use numbers '1' or '0'? Letters 'I' and 'O' are not allowed.
                    </p>
                    )}
                  </div>


                  {/* Car Brand */}
                  <div className="relative">
                      <label className="block text-sm font-medium text-gray-700">Car Brand</label>
                      <input
                          type="text"
                          value={brandSearch}
                          onChange={(e) => {
                              setBrandSearch(e.target.value);
                              setBrand("");
                              setShowBrandDropdown(true);
                          }}
                          onFocus={() => setShowBrandDropdown(true)}
                          onBlur={() => setTimeout(() => setShowBrandDropdown(false), 200)}
                          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Search..."
                          autoComplete="off"
                      />
                      {showBrandDropdown && filteredBrands.length > 0 && (
                          <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                              {filteredBrands.map((b) => (
                                  <li
                                      key={b}
                                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                                      onMouseDown={() => {
                                          setBrand(b);
                                          setBrandSearch(b);
                                          setShowBrandDropdown(false);
                                      }}
                                  >
                                      {b}
                                  </li>
                              ))}
                          </ul>
                      )}
                  </div>

                  {/* Car Model */}
                  <div className="relative">
                      <label className="block text-sm font-medium text-gray-700">Car Model</label>
                      <input
                          type="text"
                          value={modelSearch}
                          onChange={(e) => {
                              setModelSearch(e.target.value);
                              if (e.target.value !== model) setModel("");
                              setShowModelDropdown(true);
                          }}
                          disabled={!brand}
                          onFocus={() => setShowModelDropdown(true)}
                          onBlur={() => setTimeout(() => setShowModelDropdown(false), 200)}
                          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder={!brand ? "Select a brand first" : "Search..."}
                          autoComplete="off"
                      />
                      {showModelDropdown && filteredModels.length > 0 && (
                          <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                              {filteredModels.map((m) => (
                                  <li
                                      key={m}
                                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                                      onMouseDown={() => {
                                          setModelSearch(m);
                                          setModel(m);
                                          setShowModelDropdown(false);
                                      }}
                                  >
                                      {m}
                                  </li>
                              ))}
                          </ul>
                      )}
                  </div>

                  {/* Manufactured Year */}
                  <div>
                      <label className="block text-sm font-medium text-gray-700">Manufactured Year</label>
                      <select
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          disabled={!model}
                      >
                          <option value="">{!model ? "Select a model first" : "Select Year"}</option>
                          {availableYears
                              .sort((a, b) => b - a)
                              .map((y) => (
                                  <option key={y} value={y}>{y}</option>
                              ))}
                      </select>
                      {isCarOlderThan15Years() && (
                          <p className="mt-2 text-red-500 font-normal text-xs">
                              Your car is older than 15 years. Coverage may be limited.
                          </p>
                      )}
                  </div>
                </div>
                

                <div className="flex justify-end mt-4">
                  <button
                    // The button is now disabled based on the new comprehensive validation
                    disabled={!isVehicleInfoValid()}
                    className={`px-4 py-2 rounded-md font-semibold text-white ${
                      isVehicleInfoValid()
                        ? "bg-blue-800 hover:bg-blue-900"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    // The onClick functionality can be defined here later
                  >
                    Confirm Edit
                  </button>
                </div>
              </EditableSection>

              <EditableSection title="Coverage Type">
                <div>
                  <label htmlFor="coverageType" className="block text-sm font-medium text-gray-700">Coverage Type</label>
                  <select
                    id="coverageType"
                    value={coverageType}
                    onChange={(e) => setCoverageType(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="Third Party">Third Party (No additional protection available)</option>
                    <option value="Third Party, Fire and Theft">Third Party, Fire and Theft (No additional protection available)</option>
                    <option value="Comprehensive">Comprehensive</option>
                  </select>
                   {/* PASTE THE NEW CODE BLOCK HERE */}
    <div className="mt-2 text-sm text-gray-600">
      {coverageType === 'Third Party' && (
        <p>{t('third_party_description', 'Covers claims against you for death or injury to another person, and damage to their property. It does not cover your own vehicle.')}</p>
      )}
      {coverageType === 'Third Party, Fire and Theft' && (
        <p>{t('third_party_fire_party_description', 'Includes all Third Party benefits, plus coverage for your own vehicle in the event of fire or theft.')}</p>
      )}
      {coverageType === 'Comprehensive' && (
        <p>{t('comprehensive_description', 'The most complete protection. Includes all of the above, plus covers damages to your own vehicle from an accident.')}</p>
      )}
    </div>
                </div>
              </EditableSection>


              <EditableSection title="Additional Protection">
                {coverageType === 'Comprehensive' ? (
                  // If coverage is Comprehensive, show the list of checkboxes
                  <div className="space-y-4">
                    {protectionOptions.map((protection) => (
                      <div key={protection.id} className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id={protection.id}
                            name={protection.id}
                            type="checkbox"
                            // The `checked` property is now controlled by your state
                            checked={selectedProtections.includes(protection.id)}
                            onChange={handleProtectionChange}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={protection.id} className="font-medium text-gray-700">
                            {protection.label}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Otherwise, show the "not available" message
                  <p className="text-red-500 font-medium">
                    No additional protection available for this coverage type.
                  </p>
                )}
                
              </EditableSection>


              <EditableSection title="Personal Details">
  <div className="space-y-4">
    {/* NCD */}
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {t("ncd", "NCD")}
        <span className="font-normal text-xs ml-2">
          ({t("Unsure", "Unsure?")}{" "}
          <button type="button" onClick={handleCheckNcd} className="underline">
            {t("check_ncd", "Check NCD")}
          </button>)
        </span>
      </label>
      <select value={ncd} onChange={(e) => setNcd(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
        <option value={0}>0%</option>
        <option value={25}>25%</option>
        <option value={30}>30%</option>
        <option value={38.3}>38.3%</option>
        <option value={45}>45%</option>
        <option value={55}>55%</option>
      </select>
    </div>

    {/* Full Name */}
    <div>
      <label className="block text-sm font-medium text-gray-700">{t("name", "Full Name")}</label>
      <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
    </div>

    {/* ID Type Radio */}
    <div className="flex items-center">
      <span className="text-sm font-medium text-gray-700 mr-4">{t("id_type", "ID Type")}</span>
      <label className="inline-flex items-center">
        <input type="radio" name="documentType" value="ic" checked={documentType === "ic"} onChange={() => { setDocumentType("ic"); setPassport(""); }} className="form-radio text-blue-600" />
        <span className="ml-2">{t("ic", "IC")}</span>
      </label>
      <label className="inline-flex items-center ml-6">
        <input type="radio" name="documentType" value="passport" checked={documentType === "passport"} onChange={() => { setDocumentType("passport"); setIc(""); }} className="form-radio text-blue-600" />
        <span className="ml-2">{t("Passport", "Passport")}</span>
      </label>
    </div>

    {/* IC or Passport Input */}
    {documentType === 'ic' ? (
      <div>
        <label className="block text-sm font-medium text-gray-700">{t("number_ic", "IC Number")}</label>
        <input type="text" value={ic} onChange={(e) => setIc(formatICNumber(e.target.value))} className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${icValidation.isValid === true ? 'border-green-500' : icValidation.isValid === false ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g. 050102-07-0304" />
        {icValidation.error && <p className="mt-2 text-sm text-red-600">{icValidation.error}</p>}
      </div>
    ) : (
      <div>
        <label className="block text-sm font-medium text-gray-700">{t("number_passport", "Passport Number")}</label>
        <input type="text" value={passport} onChange={(e) => setPassport(e.target.value)} className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${passportValidation.isValid === true ? 'border-green-500' : passportValidation.isValid === false ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g. A12345678" />
        {passportValidation.error && <p className="mt-2 text-sm text-red-600">{passportValidation.error}</p>}
      </div>
    )}

    {/* Postcode */}
    <div>
      <label className="block text-sm font-medium text-gray-700">{t("postcode", "Postcode")}</label>
      <input type="text" value={postcode} onChange={(e) => setPostcode(e.target.value)} className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${postcodeValidation.isValid === true ? 'border-green-500' : postcodeValidation.isValid === false ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g. 50000" />
      {postcodeValidation.error && <p className="mt-2 text-sm text-red-600">{postcodeValidation.error}</p>}
    </div>
  </div>
</EditableSection>

            </div>
          </>
        )}
      </main>
    </div>
  );
}
