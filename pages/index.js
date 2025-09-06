import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useT } from "../src/utils/i18n";

export default function Home() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    ic: "",
    phone: "",
    confirmPassword: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoginMode) {
      // Handle login
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (result?.ok) {
        window.location.href = "/dashboard";
      } else {
        alert("Invalid email or password. Please try again.");
      }
    } else {
      // Handle signup - simulate successful signup
      alert("Account created successfully! Redirecting to dashboard...");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
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
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">EN</span>
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
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
                  {useT()("hero_title")}
                </h2>
                <p className="text-lg text-black-600 font-bold mb-8">
                  {useT()("hero_subtitle")}
                </p>
                <button className="bg-blue-900 text-white px-8 py-3 font-extrabold hover:bg-blue-800 transition-colors">
                  {useT()("get_quote_now")}
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
                    {isLoginMode ? useT()("login") : useT()("signup")}
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLoginMode && (
                      <>
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">
                            {useT()("name_as_ic")}
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            className="w-full px-4 py-2 bg-white rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            placeholder="Enter your full name"
                            required={!isLoginMode}
                          />
                        </div>
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">
                            {useT()("identification_number")}
                          </label>
                          <input
                            type="text"
                            value={formData.ic}
                            onChange={(e) =>
                              handleInputChange("ic", e.target.value)
                            }
                            className="w-full px-4 py-2 bg-white rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            placeholder="Enter your IC number"
                            required={!isLoginMode}
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        {useT()("email")}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full px-4 py-2 bg-white rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    {!isLoginMode && (
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          {useT()("phone_number")}
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
                            placeholder="Enter phone number"
                            required={!isLoginMode}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        {useT()("password")}
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className="w-full px-4 py-2 bg-white rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        placeholder="Enter your password"
                        required
                      />
                    </div>

                    {!isLoginMode && (
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          {useT()("confirm_password")}
                        </label>
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          className="w-full px-4 py-2 bg-white rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                          placeholder="Confirm your password"
                          required={!isLoginMode}
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
                          {useT()("terms_accept")}
                        </label>
                      </div>
                    )}

                    <div className="flex flex-col items-center space-y-3">
                      <button
                        type="submit"
                        className="w-36 bg-black text-white py-2 rounded font-bold hover:bg-blue-800 transition-colors"
                      >
                        {isLoginMode ? "LOG IN" : "SIGN UP"}
                      </button>

                      {isLoginMode && (
                        <>
                          <span className="text-white font-bold">OR</span>
                          <button
                            type="button"
                            onClick={() => setIsLoginMode(!isLoginMode)}
                            className="w-36 bg-transparent text-white py-2 rounded font-bold border border-white hover:bg-white/20 transition-colors"
                          >
                            {useT()("signup")}
                          </button>
                        </>
                      )}

                      {!isLoginMode && (
                        <p className="text-white text-center text-sm">
                          Already have an account?{" "}
                          <span
                            onClick={() => setIsLoginMode(true)}
                            className="underline cursor-pointer font-bold text-[#67DABB]"
                          >
                            Login here
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
                          {useT()("forgot_password")}
                        </a>
                        <a
                          href="#"
                          className="block text-[#67DABB] text-sm underline hover:text-white"
                        >
                          {useT()("confirmation_instructions")}
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
                  {useT()("secure")}
                </h3>
                <p className="text-black font-bold">{useT()("secure_desc")}</p>
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
                  {useT()("fast")}
                </h3>
                <p className="text-black font-bold">{useT()("fast_desc")}</p>
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
                  {useT()("compare")}
                </h3>
                <p className="text-black font-bold">{useT()("compare_desc")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Insurance Products */}
        <section className="py-16 bg-[#004F9E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h3 className="text-black text-3xl font-extrabold text-center mb-2">
              {useT()("insurance_products")}
            </h3>
            <p className="text-black text-center mb-6">
              {useT()("insurance_products_subtitle")}
            </p>
            <div className="text-center mb-10">
              <button className="bg-black text-white px-5 py-2 rounded">
                {useT()("view_all_products")}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: useT()("basic_insurance"),
                  desc: useT()("basic_insurance_desc"),
                  imgSrc: ["/images/essential.png"],
                },
                {
                  title: useT()("comprehensive_insurance"),
                  desc: useT()("comprehensive_insurance_desc"),
                  imgSrc: ["/images/all.png"],
                },
                {
                  title: useT()("third_party_insurance"),
                  desc: useT()("third_party_insurance_desc"),
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
                      ? useT()("best_seller")
                      : idx === 1
                      ? useT()("top_rated")
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
              {useT()("customer_reviews")}
            </h3>
            <p className="text-center text-gray-500 mb-8">
              {useT()("customer_reviews_subtitle")}
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
                    {idx === 0 && useT()("review_1")}
                    {idx === 1 && useT()("review_2")}
                    {idx === 2 && useT()("review_3")}
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
                  {useT()("about_us")}
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-blue-200 hover:text-white">
                      {useT()("faq")}
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">
                  {useT()("useful_links")}
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-blue-200 hover:text-white">
                      {useT()("contact_us")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-200 hover:text-white">
                      {useT()("personal_data_protection")}
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">
                  {useT()("follow_us")}
                </h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                    </svg>
                  </a>
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                    </svg>
                  </a>
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
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
