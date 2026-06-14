"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyCredentials, verifyLogin2FA } from "./actions";
import { H1 } from "@/components/ui/Heading";

export default function AdminLogin() {
  const router = useRouter();
  const [step, setStep] = useState<"LOGIN" | "SETUP" | "VERIFY">("LOGIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [setupSecret, setSetupSecret] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const result = await verifyCredentials({ email, password });
      if (result.error) {
        setError(result.error);
      } else if (result.needsSetup && result.setupData) {
        setSetupSecret(result.setupData.secret);
        setQrCode(result.setupData.qrCodeDataUrl);
        setStep("SETUP");
      } else {
        setStep("VERIFY");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const result = await verifyLogin2FA({ 
        email, 
        password, 
        token, 
        isSetup: step === "SETUP", 
        setupSecret 
      });
      
      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] w-full flex justify-center items-center bg-bg-light relative overflow-hidden flex-grow">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-light opacity-50 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-secondary opacity-10 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl p-10 rounded-[30px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-primary-light/50 relative z-10">
        <div className="flex justify-center mb-6">
          <img src="/images/logo.png" alt="Logo" className="h-[70px] rounded-[15px] shadow-sm" />
        </div>
        <H1 className="text-3xl font-extrabold mb-2 text-center text-primary-dark">
          {step === "SETUP" ? "Setup 2FA" : "Admin Portal"}
        </H1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-semibold mb-6 text-center border border-red-100">
            {error}
          </div>
        )}

        {step === "LOGIN" && (
          <>
            <p className="text-center text-[#555] mb-8">Access the Ignyto Tutoring Dashboard</p>
            <form onSubmit={handleStep1Submit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-primary-dark mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary-dark mb-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors pr-12" 
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none p-2"
                  >
                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-1 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Continue"}
              </button>
            </form>
          </>
        )}

        {step === "SETUP" && (
          <>
            <p className="text-center text-[#555] mb-4">You must secure your account before continuing. Scan this QR code with Google Authenticator or Authy.</p>
            <div className="flex justify-center mb-6">
              {qrCode && <img src={qrCode} alt="2FA QR Code" className="w-[200px] h-[200px] border p-2 rounded-xl shadow-sm" />}
            </div>
            <form onSubmit={handleStep2Submit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-primary-dark mb-1 text-center">Enter 6-Digit Code to Confirm</label>
                <input 
                  type="text" 
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-center text-xl tracking-widest font-mono" 
                  required 
                  maxLength={6}
                  pattern="\d{6}"
                  autoFocus
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-secondary hover:bg-yellow-400 text-black py-3 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-1 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Save"}
              </button>
              <button 
                type="button" 
                onClick={() => { setStep("LOGIN"); setToken(""); }}
                className="w-full bg-transparent text-primary hover:underline text-sm font-semibold py-2"
              >
                Cancel
              </button>
            </form>
          </>
        )}

        {step === "VERIFY" && (
          <>
            <p className="text-center text-[#555] mb-8">Enter the 6-digit code from your Authenticator App to continue.</p>
            <form onSubmit={handleStep2Submit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-primary-dark mb-1 text-center">Authenticator Code</label>
                <input 
                  type="text" 
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-center text-xl tracking-widest font-mono" 
                  required 
                  maxLength={6}
                  pattern="\d{6}"
                  autoFocus
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-secondary hover:bg-yellow-400 text-black py-3 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-1 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Verify & Login"}
              </button>
              <button 
                type="button" 
                onClick={() => { setStep("LOGIN"); setToken(""); }}
                className="w-full bg-transparent text-primary hover:underline text-sm font-semibold py-2"
              >
                Go Back
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
