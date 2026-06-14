"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkSetupStatus, initSuperadmin, verifySuperadminSetup } from "./actions";

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"CHECKING" | "REGISTER" | "QR">("CHECKING");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [userId, setUserId] = useState("");
  const [secret, setSecret] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [token, setToken] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkSetupStatus().then((isLocked) => {
      if (isLocked) {
        router.push("/admin/login");
      } else {
        setStep("REGISTER");
      }
    });
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await initSuperadmin({ name, email, phone, password });
      if (res.error) {
        setError(res.error);
      } else {
        setUserId(res.userId || "");
        setSecret(res.secret || "");
        setQrCode(res.qrCodeDataUrl || "");
        setStep("QR");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await verifySuperadminSetup({ userId, secret, token });
      if (res.error) {
        setError(res.error);
      } else {
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "CHECKING") return null;

  return (
    <div className="min-h-[calc(100vh-73px)] w-full flex justify-center items-center bg-bg-light relative overflow-hidden flex-grow px-4 py-10">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-light opacity-50 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-secondary opacity-10 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl p-10 rounded-[30px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-primary-light/50 relative z-10">
        <div className="flex justify-center mb-6">
          <img src="/images/logo.png" alt="Logo" className="h-[70px] rounded-[15px] shadow-sm" />
        </div>
        <h1 className="text-3xl font-extrabold mb-2 text-center text-primary-dark">
          {step === "REGISTER" ? "System Initialization" : "Secure Your Account"}
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-semibold mb-6 text-center border border-red-100">
            {error}
          </div>
        )}

        {step === "REGISTER" && (
          <>
            <p className="text-center text-[#555] mb-8">Welcome! Setup the primary Superadmin account to unlock the portal.</p>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-primary-dark mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                  required 
                />
              </div>
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
                <label className="block text-sm font-semibold text-primary-dark mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                className="w-full bg-primary hover:bg-primary-dark text-white py-3 mt-2 rounded-xl font-bold text-lg transition-all shadow-md hover:-translate-y-1 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Initialize Portal"}
              </button>
            </form>
          </>
        )}

        {step === "QR" && (
          <>
            <p className="text-center text-[#555] mb-4">Account created! Scan this QR code with your Authenticator app to secure it.</p>
            <div className="flex justify-center mb-6">
              {qrCode && <img src={qrCode} alt="2FA QR Code" className="w-[200px] h-[200px] border p-2 rounded-xl shadow-sm" />}
            </div>
            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-primary-dark mb-1 text-center">Enter 6-Digit Code</label>
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
                {loading ? "Verifying..." : "Complete Setup"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
