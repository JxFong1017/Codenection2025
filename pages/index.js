import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useT } from "../src/utils/i18n";
import { useRouter } from "next/router";
import { validatePhone } from "../src/utils/validationLogic"; 
import { signUpWithEmailAndPassword, showMessage } from "../lib/firebase";

export default function Home() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 
  const router = useRouter();

  const t = useT();

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      let newState = { ...prev, [field]: value };
    setError("");
    setSuccessMessage(""); 

    if (field === "password" && value.length === 0) {
      newState.confirmPassword = "";
      }
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (isLoginMode) {
      // Handle login
      try {
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.ok) {
          router.push('/dashboard')
        } else {
          setError("Invalid email or password. Please try again.");
          setFormData(prev => ({ 
            ...prev, 
            email: "", 
            password: "" 
          }));
        }
      } catch (error) {
        setError("An unexpected error occurred during login.");
      }
    } else {
      // Handle signup
      console.log("Password:", formData.password, "Confirm:", formData.confirmPassword); 
       
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        setIsLoading(false);
        return;
      }
      const phoneValidation = validatePhone(formData.phone);
      if (!phoneValidation.isValid) {
        setError(phoneValidation.error || "Please enter a valid phone number.");
        setIsLoading(false);
        return;
      }

      try {
        await signUpWithEmailAndPassword(
          formData.email,
          formData.password,
          formData.name,
          formData.phone
        );

        // Show success message and switch to login mode
        setSuccessMessage("Account created successfully! Please log in.");
        setIsLoginMode(true);
        // Clear form for login
        setFormData({
          email: formData.email, // Keep email for user convenience
          password: "",
          name: "",
          phone: "",
          confirmPassword: "",
        });

      } catch (error) {
        let errorMessage = "Failed to sign up. Please try again.";
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = "This email is already in use. Please log in or use a different email.";
        } else if (error.code === 'auth/weak-password') {
          errorMessage = "Password is too weak. It should be at least 6 characters long.";
        }
        setError(errorMessage);
      }
    }
    setIsLoading(false);
  };

  // Add this function inside your component, e.g., after the state declarations
  const showLoginMessage = () => {
    const messageDiv = document.getElementById('message-div');
    if (messageDiv) {
        messageDiv.textContent = "Please Login or Sign up first to get a quote!";

        messageDiv.style.display = 'block';
        messageDiv.style.opacity = '1';

        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                messageDiv.style.display = 'none'; 
            }, 500); 
        }, 3000);
    }
  };

  return (
    <>
      <Head>
        <title>CGS - Smart Coverage, Smooth Rides</title>
        <meta
          name="description"
          content="Get instant coverage, transparent pricing and hassle-free claims — all in one place."
        />
      </Head>
      
      <div id="message-div" style={{ display: 'none', position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'red', color: 'white', padding: '.5rem 2rem', borderRadius: '8px', zIndex: 100, transition: 'opacity 0.5s' }}></div>
      
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-5xl font-extrabold text-[#004F9E] -ml-2">
                  CGS
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
            {/* Left Side - Marketing Content */}
            <div className="bg-white flex items-center justify-center p-8 lg:p-12">
              <div className="max-w-lg">
                <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
                  {t("hero_title")}
                </h2>
                <p className="text-lg text-black-600 font-bold mb-8">
                  {t("hero_subtitle")}
                </p>
                <button 
                  onClick={showLoginMessage} 
                  className="bg-blue-900 text-white px-8 py-3 font-extrabold hover:bg-blue-800 transition-colors"
                >
                  {t("get_quote_now")}
                </button>
              </div>
            </div>

            {/* Right Side - Login/Signup Form */}
            <div className="relative p-0 lg:p-0 overflow-hidden">
              {/* Background Image */}
              <div className="relative h-[520px] lg:h-full">
                <Image
                  src="/images/car-landing-page.png"
                  alt="Luxury SUV background"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-blue-500/30" />
              </div>

              {/* Auth Form over image */}
              <div className="absolute inset-0 flex items-center justify-center px-6">
                <div className="w-full max-w-lg">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    {isLoginMode ? t("login") : t("signup")}
                  </h3>

                  {successMessage && (
                    <div className="bg-green-500 text-white py-2 px-3 rounded-lg mb-4 text-center">
                      {successMessage}
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-500 text-white py-2 px-3 rounded-lg mb-4 text-center ">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLoginMode && (
                      <>
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">
                            {t("name_as_ic")}
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            className="w-full px-4 py-2 bg-white rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            placeholder={t("placeholder_name")}
                            required={!isLoginMode}
                          />
                        </div>
                        
                      </>
                    )}

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        {t("email")}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full px-4 py-2 bg-white rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        placeholder={t("placeholder_email")}
                        required
                        autoComplete="email"
                      />
                    </div>

                    {!isLoginMode && (
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          {t("phone_number")}
                        </label>
                        <div className="flex">
                          <select className="px-3 py-2 bg-white rounded-l text-gray-900 border-r border-gray-300 focus:outline-none">
                            <option>🇲🇾 +60</option>
                          </select>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            className="flex-1 px-4 py-2 bg-white rounded-r text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            placeholder={t("placeholder_phone")}
                            required={!isLoginMode}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        {t("password")}
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className="w-full px-4 py-2 bg-white rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        placeholder={t("placeholder_password")}
                        required
                        autoComplete={isLoginMode ? "current-password" : "new-password"}
                      />
                    </div>

                    {!isLoginMode && (
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          {t("confirm_password")}
                        </label>
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          className="w-full px-4 py-2 bg-white rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                          placeholder={t("confirm_password")}
                          required={!isLoginMode}
                          autoComplete="new-password"
                        />
                      </div>
                    )}

                    {!isLoginMode && (
                      <div className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          id="terms"
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          required
                        />
                        <label htmlFor="terms" className="text-white text-sm">
                          {t("terms_accept_text")}{" "}
                          <Link
                            href="/terms"
                            className="underline text-[#67DABB] hover:text-white"
                          >
                            {t("terms_conditions")}
                          </Link>{" "}
                          {t("terms_accept_suffix")}
                        </label>
                      </div>
                    )}

                    <div className="flex flex-col items-center space-y-3">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-36 bg-black text-white py-2 rounded font-bold hover:bg-blue-800 transition-colors disabled:bg-gray-500"
                      >
                        {isLoading ? (isLoginMode ? t('Loggingin') : t('Signingup')) : (isLoginMode ? t("login") : t("signup"))}
                      </button>

                      {isLoginMode && (
                        <>
                          <span className="text-white font-bold">{t("or")}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setIsLoginMode(!isLoginMode);
                              setError("");
                              setSuccessMessage("");
                              setFormData({ email: "", password: "", name: "", phone: "", confirmPassword: "" });
                            }}
                            className="w-36 bg-transparent text-white py-2 rounded font-bold border border-white hover:bg-white/20 transition-colors"
                          >
                            {t("signup")}
                          </button>
                        </>
                      )}

                      {!isLoginMode && (
                        <p className="text-white text-center text-sm">
                          {t("have_account")}{" "}
                          <span
                            onClick={() => {
                              setIsLoginMode(true);
                              setError("");
                              setSuccessMessage("");
                              setFormData({ email: "", password: "", name: "", phone: "", confirmPassword: "" });
                            }}
                            className="underline cursor-pointer font-bold text-[#67DABB]"
                          >
                            {t("login_here")}
                          </span>
                        </p>
                      )}
                    </div>

                    {isLoginMode && (
                      <div className="space-y-2">
                        <a
                          href="#"
                          className="block text-[#67DABB] text-sm underline hover:text-white"
                        >
                          {t("forgot_password")}
                        </a>
                        <a
                          href="#"
                          className="block text-[#67DABB] text-sm underline hover:text-white"
                        >
                          {t("confirmation_instructions")}
                        </a>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        
        {/* Feature Highlights */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Secure */}
              <div className="text-center">
                <div className="w-16 h-16 bg-[#DDF8FE] rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  <Image
                    src="/images/secure.png"
                    alt="Secure"
                    width={42}
                    height={42}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-lg font-extrabold text-[#004F9E] mb-2">
                  {t("secure")}
                </h3>
                <p className="text-black font-bold">{t("secure_desc")}</p>
              </div>

              {/* Fast */}
              <div className="text-center">
                <div className="w-16 h-16 bg-[#DDF8FE] rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  <Image
                    src="/images/fast.png"
                    alt="Fast"
                    width={54}
                    height={54}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-lg font-extrabold text-[#004F9E] mb-2">
                  {t("fast")}
                </h3>
                <p className="text-black font-bold">{t("fast_desc")}</p>
              </div>

              {/* Compare */}
              <div className="text-center">
                <div className="w-16 h-16 bg-[#DDF8FE] rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  <Image
                    src="/images/compare.png"
                    alt="Compare"
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-lg font-extrabold text-[#004F9E] mb-2">
                  {t("compare")}
                </h3>
                <p className="text-black font-bold">{t("compare_desc")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Insurance Products */}
        <section className="py-16 bg-[#004F9E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h3 className="text-black text-3xl font-extrabold text-center mb-2">
              {t("insurance_products")}
            </h3>
            <p className="text-black text-center mb-6">
              {t("insurance_products_subtitle")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: t("basic_insurance"),
                  desc: t("basic_insurance_desc"),
                  imgSrc: ["/images/essential.png"],
                },
                {
                  title: t("comprehensive_insurance"),
                  desc: t("comprehensive_insurance_desc"),
                  imgSrc: ["/images/all.png"],
                },
                {
                  title: t("third_party_insurance"),
                  desc: t("third_party_insurance_desc"),
                  imgSrc: [
                    "/images/third-party-1.png",
                    "/images/third-party-2.png",
                  ],
                },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded shadow p-4 text-blue-900"
                >
                  {/* Images */}
                  <div className="h-40 mb-4 flex items-center justify-center bg-blue-100 rounded overflow-hidden gap-2">
                    {card.imgSrc.length === 1 ? (
                      <Image
                        src={card.imgSrc[0]}
                        alt={card.title}
                        width={180}
                        height={180}
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex w-full h-full gap-2">
                        {card.imgSrc.map((src, i) => (
                          <div key={i} className="flex-1 h-full">
                            <Image
                              src={src}
                              alt={`${card.title} image ${i + 1}`}
                              width={150}
                              height={150}
                              className="object-contain w-full h-full"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 mb-1">
                    {idx === 0
                      ? t("best_seller")
                      : idx === 1
                      ? t("top_rated")
                      : ""}
                  </div>
                  <div className="font-semibold">{card.title}</div>
                  <div className="text-sm text-gray-600">{card.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-extrabold text-gray-900 text-center mb-2">
              {t("customer_reviews")}
            </h3>
            <p className="text-center text-gray-500 mb-8">
              {t("customer_reviews_subtitle")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["John Doe", "Jane Smith", "Alice Johnson"].map((name, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-6 shadow-sm">
                  {/* Profile Image, Name on left, Stars on right */}
                  <div className="flex items-center justify-between mb-3">
                    {/* Left side: Profile Image + Name */}
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden">
                        <Image
                          src="/images/profile.png" // Replace with your profile image
                          alt={`${name} profile`}
                          width={36}
                          height={36}
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium text-gray-900">{name}</span>
                    </div>

                    {/* Right side: 5 Stars */}
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.946a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.946c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.287-3.946a1 1 0 00-.364-1.118L2.036 9.373c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.946z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm">
                    {idx === 0 && t("review_1")}
                    {idx === 1 && t("review_2")}
                    {idx === 2 && t("review_3")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-blue-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">
                  {t("about_us")}
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-blue-200 hover:text-white">
                      {t("faq")}
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">
                  {t("useful_links")}
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-blue-200 hover:text-white">
                      {t("contact_us")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-200 hover:text-white">
                      {t("personal_data_protection")}
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">
                  {t("follow_us")}
                </h4>
                <div className="flex space-x-4">
                  {/* Facebook */}
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.128 8.438 9.878v-6.988h-2.54v-2.89h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 17 22 12z" />
                    </svg>
                  </a>
                  {/* LinkedIn */}
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0h4.78v2.23h.07c.67-1.27 2.31-2.61 4.76-2.61 5.09 0 6.03 3.34 6.03 7.69V24h-5V15.45c0-2.05-.04-4.69-2.86-4.69-2.86 0-3.3 2.24-3.3 4.55V24h-5V8z" />
                    </svg>
                  </a>
                  {/* Instagram */}
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.34 3.608 1.315.975.975 1.253 2.242 1.315 3.608.058 1.266.07 1.645.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.34 2.633-1.315 3.608-.975.975-2.242 1.253-3.608 1.315-1.266.058-1.645.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.34-3.608-1.315-.975-.975-1.253-2.242-1.315-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.34-2.633 1.315-3.608C4.523 2.503 5.79 2.225 7.156 2.163 8.422 2.105 8.802 2.163 12 2.163zm0 1.838c-3.176 0-3.552.012-4.805.069-1.07.049-1.65.227-2.037.38-.512.2-.877.438-1.265.825-.388.388-.625.754-.825 1.265-.153.387-.331.967-.38 2.037-.057 1.253-.069 1.629-.069 4.805s.012 3.552.069 4.805c.049 1.07.227 1.65.38 2.037.2.512.438.877.825 1.265.388.388.754.625 1.265.825.387.153.967.331 2.037.38 1.253.057 1.629.069 4.805.069s3.552-.012 4.805-.069c1.07-.049 1.65-.227 2.037-.38.512-.2.877-.438 1.265-.825.388-.388.625-.754.825-1.265.153-.387.331-.967.38-2.037.057-1.253.069-1.629.069-4.805s-.012-3.552-.069-4.805c-.049-1.07-.227-1.65-.38-2.037-.2-.512-.438-.877-.825-1.265-.388-.388-.754-.625-1.265-.825-.387-.153-.967-.331-2.037-.38-1.253-.057-1.629-.069-4.805-.069zm0 4.838a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.838a3.162 3.162 0 1 0 0 6.324 3.162 3.162 0 0 0 0-6.324zm6.406-3.845a1.17 1.17 0 1 1-2.34 0 1.17 1.17 0 0 1 2.34 0z" />
                    </svg>
                  </a>
                  {/* TikTok */}
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 6.625 5.373 12 12 12 6.627 0 12-5.375 12-12 0-6.627-5.373-12-12-12zm2.95 17.567c-.958.455-2.047.721-3.214.721-3.222 0-5.828-2.606-5.828-5.828 0-3.222 2.606-5.828 5.828-5.828 1.006 0 1.956.293 2.758.796V5.457h2.5v6.153c-.432-.11-.879-.166-1.338-.166-.963 0-1.887.273-2.66.744v1.38c.777.206 1.49.589 2.095 1.092v2.107z" />
                    </svg>
                  </a>
                  {/* X (Twitter) */}
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4 1.64a9.05 9.05 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.5 0c-2.5 0-4.5 2-4.5 4.5 0 .35.04.7.11 1.03A12.94 12.94 0 0 1 1.64.9a4.51 4.51 0 0 0-.61 2.27c0 1.57.8 2.96 2 3.77A4.47 4.47 0 0 1 .96 6.4v.06c0 2.19 1.56 4.03 3.63 4.44a4.53 4.53 0 0 1-2.03.08 4.52 4.52 0 0 0 4.21 3.13A9.06 9.06 0 0 1 0 19.54 12.76 12.76 0 0 0 6.92 21c8.3 0 12.85-6.88 12.85-12.85 0-.2 0-.39-.01-.58A9.22 9.22 0 0 0 23 3z" />
                    </svg>
                  </a>
                  {/* YouTube */}
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a2.994 2.994 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A2.994 2.994 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.994 2.994 0 0 0 2.122 2.136c1.872.505 9.377.505 9.377.505s7.505 0 9.377-.505a2.995 2.995 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}