
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useT } from "../src/utils/i18n";
import { signUpWithEmailAndPassword, showMessage } from "../firebaseauth";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
          window.location.href = "/dashboard";
        } else {
          setError(result?.error || "Invalid email or password. Please try again.");
        }
      } catch (error) {
        setError("An unexpected error occurred during login.");
        console.error("Login error:", error);
      }
    } else {
      // Handle signup
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        setIsLoading(false);
        return;
      }
      try {
        await signUpWithEmailAndPassword(
          formData.email,
          formData.password,
          formData.name,
          formData.ic,
          formData.phone
        );
        
        // Show success message and switch to login mode
        showMessage("Account created successfully! Please log in.", "message-div");
        setIsLoginMode(true);
        // Clear form for login
        setFormData({
          email: formData.email, // Keep email for user convenience
          password: "",
          name: "",
          ic: "",
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
        console.error("Signup error:", error);
      }
    }
    setIsLoading(false);
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
      
      {/* Added a div for displaying messages */}
      <div id="message-div" style={{ display: 'none', position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'green', color: 'white', padding: '1rem 2rem', borderRadius: '8px', zIndex: 100, transition: 'opacity 0.5s' }}></div>


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

                  {error && (
                    <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
                      {error}
                    </div>
                  )}
                  
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
                        autoComplete="email"
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
                        autoComplete={isLoginMode ? "current-password" : "new-password"}
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
                          {useT()("terms_accept_text")}{" "}
                          <Link
                            href="/terms"
                            className="underline text-[#67DABB] hover:text-white"
                          >
                            {useT()("terms_conditions")}
                          </Link>{" "}
                          {useT()("terms_accept_suffix")}
                        </label>
                      </div>
                    )}

                    <div className="flex flex-col items-center space-y-3">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-36 bg-black text-white py-2 rounded font-bold hover:bg-blue-800 transition-colors disabled:bg-gray-500"
                      >
                        {isLoading ? (isLoginMode ? 'Logging in...' : 'Signing up...') : (isLoginMode ? useT()("login") : useT()("signup"))}
                      </button>

                      {isLoginMode && (
                        <>
                          <span className="text-white font-bold">OR</span>
                          <button
                            type="button"
                            onClick={() => {
                              setIsLoginMode(!isLoginMode);
                              setError("");
                              setFormData({ email: "", password: "", name: "", ic: "", phone: "", confirmPassword: "" });
                            }}
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
                            onClick={() => {
                              setIsLoginMode(true);
                              setError("");
                              setFormData({ email: "", password: "", name: "", ic: "", phone: "", confirmPassword: "" });
                            }}
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
        
        {/* ... Rest of the page remains the same ... */}
        
      </div>
    </>
  );
}
