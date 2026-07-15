"use client";

import { useState } from "react";
import { GradeWiseCamp, GradeWiseCampDate, GradeWiseCampTimeSlot } from "@prisma/client";
import { H2, H3 } from "@/components/ui/Heading";
import { saveGradeWiseCampPendingEnrollment, recordGradeWiseCampPayment } from "./actions";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { FaCheckCircle, FaLock, FaCalendarAlt, FaRegClock, FaUsers } from "react-icons/fa";
import { formatCourseDateShort } from "@/lib/formatTime";

type ExtendedGradeWiseCamp = GradeWiseCamp & { dates: (GradeWiseCampDate & { timeSlots: GradeWiseCampTimeSlot[] })[] };

export default function GradeWiseCampRegisterClient({ course }: { course: ExtendedGradeWiseCamp }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [selectedDateStr, setSelectedDateStr] = useState(course.dates[0]?.dateStr || "");
  const availableTimeSlots = course.dates.find(d => d.dateStr === selectedDateStr)?.timeSlots || [];

  async function handleDetailsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await saveGradeWiseCampPendingEnrollment(formData, course.id);
      if (res.success && res.enrollmentId) {
        setEnrollmentId(res.enrollmentId);
        setStep(2);
      }
    } catch (err: any) {
      setError(err.message || "Failed to register details. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center space-y-6 border border-gray-100">
        <FaCheckCircle className="text-green-500 text-[80px] mx-auto" />
        <H2 className="text-4xl font-bold text-primary-dark">Registration Successful!</H2>
        <p className="text-xl text-gray-600">You are securely enrolled in <strong>{course.title}</strong>.</p>
        <p className="text-gray-500 mb-8">We will be in touch shortly with further instructions.</p>
        <button 
          onClick={() => window.location.href = "/"} 
          className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md text-lg"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div id="registration-form" className="max-w-4xl mx-auto mt-12 bg-[#f4f5f7] p-8 sm:p-12 rounded-[10px] shadow-sm border border-gray-200">
        
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex justify-between items-start mb-8">
              <H2 className="text-[32px] font-bold text-[#333] leading-tight max-w-[70%]">
                Enroll in {course.title}
              </H2>
            </div>
            
            {error && <p className="text-red-600 bg-red-50 border border-red-100 p-4 rounded-md text-sm font-medium">{error}</p>}
            
            <form onSubmit={handleDetailsSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                
                {/* Row 1 */}
                <div>
                  <label className="block text-sm font-semibold text-[#333] mb-1.5">Select Week</label>
                  <select 
                    name="selectedDate" 
                    value={selectedDateStr}
                    onChange={(e) => setSelectedDateStr(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-md border border-gray-300 focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3] outline-none transition-all text-gray-800 bg-white"
                  >
                    {course.dates.length > 0 ? (
                      course.dates.map(d => <option key={d.id} value={d.dateStr}>{d.dateStr}</option>)
                    ) : (
                      <option value="N/A">Not specified</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#333] mb-1.5">Select Time Slot</label>
                  <select name="selectedTime" className="w-full px-3 py-2.5 rounded-md border border-gray-300 focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3] outline-none transition-all text-gray-800 bg-white">
                    {availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map(t => <option key={t.id} value={t.timeStr}>{t.timeStr}</option>)
                    ) : (
                      <option value="N/A">Time TBD</option>
                    )}
                  </select>
                </div>

                {/* Row 2 */}
                <div>
                  <label className="block text-sm font-semibold text-[#333] mb-1.5">Student Name</label>
                  <input name="studentName" required className="w-full px-3 py-2.5 rounded-md border border-gray-300 focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3] outline-none transition-all text-gray-800 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#333] mb-1.5">Grade</label>
                  <select name="grade" required className="w-full px-3 py-2.5 rounded-md border border-gray-300 focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3] outline-none transition-all text-gray-800 bg-white">
                    <option value="">Select Grade</option>
                    <option value="1st Grade">1st Grade</option>
                    <option value="2nd Grade">2nd Grade</option>
                    <option value="3rd Grade">3rd Grade</option>
                    <option value="4th Grade">4th Grade</option>
                    <option value="5th Grade">5th Grade</option>
                    <option value="6th Grade">6th Grade</option>
                    <option value="7th Grade">7th Grade</option>
                    <option value="8th Grade">8th Grade</option>
                    <option value="9th Grade">9th Grade</option>
                    <option value="10th Grade">10th Grade</option>
                    <option value="11th Grade">11th Grade</option>
                    <option value="12th Grade">12th Grade</option>
                  </select>
                </div>

                {/* Row 3 */}
                <div>
                  <label className="block text-sm font-semibold text-[#333] mb-1.5">Student Email</label>
                  <input name="studentEmail" type="email" required className="w-full px-3 py-2.5 rounded-md border border-gray-300 focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3] outline-none transition-all text-gray-800 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#333] mb-1.5">Student Phone</label>
                  <input name="studentPhone" type="tel" required className="w-full px-3 py-2.5 rounded-md border border-gray-300 focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3] outline-none transition-all text-gray-800 bg-white" />
                </div>

                {/* Row 4 */}
                <div>
                  <label className="block text-sm font-semibold text-[#333] mb-1.5">Parent Name</label>
                  <input name="parentName" required className="w-full px-3 py-2.5 rounded-md border border-gray-300 focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3] outline-none transition-all text-gray-800 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#333] mb-1.5">Parent Email</label>
                  <input name="parentEmail" type="email" required className="w-full px-3 py-2.5 rounded-md border border-gray-300 focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3] outline-none transition-all text-gray-800 bg-white" />
                </div>

                {/* Row 5 */}
                <div>
                  <label className="block text-sm font-semibold text-[#333] mb-1.5">Parent Phone</label>
                  <input name="parentPhone" type="tel" required className="w-full px-3 py-2.5 rounded-md border border-gray-300 focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3] outline-none transition-all text-gray-800 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#333] mb-1.5">Course Fee</label>
                  <div className="w-full px-3 py-2.5 rounded-md border border-gray-300 bg-gray-50 text-gray-800 font-bold flex items-center">
                    ${course.fee.toFixed(2)}
                  </div>
                  {/* We omit referredBy input entirely since we replaced it */}
                </div>

                {/* Row 6 */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-[#333] mb-1.5">Address / City / State</label>
                  <textarea name="address" rows={4} required className="w-full px-3 py-2.5 rounded-md border border-gray-300 focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3] outline-none transition-all text-gray-800 bg-white resize-none"></textarea>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full mt-4 bg-[#0056b3] hover:bg-[#004494] text-white py-3 rounded-2xl font-semibold text-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Next"}
              </button>
            </form>
          </div>
        )}

        {step === 2 && enrollmentId && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <FaLock className="text-sm" />
                </div>
                <H3 className="text-2xl font-bold text-gray-800">Secure Payment</H3>
              </div>
              <p className="text-gray-500 text-sm">Complete your registration using PayPal.</p>
            </div>
            
            {error && <p className="text-red-600 bg-red-50 border border-red-100 p-4 rounded-xl text-sm font-medium">{error}</p>}
            
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <PayPalScriptProvider options={{ 
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
                currency: "USD",
                intent: "capture"
              }}>
                <PayPalButtons
                  style={{ layout: "vertical", shape: "rect", color: "blue", label: "pay" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        {
                          description: `Enrollment: ${course.title}`,
                          amount: {
                            currency_code: "USD",
                            value: course.fee.toString(),
                          },
                          custom_id: enrollmentId, // So webhook knows which enrollment to update
                        },
                      ],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    if (!actions.order) return;
                    try {
                      const order = await actions.order.capture();
                      // Record in DB
                      await recordGradeWiseCampPayment({
                        enrollmentId,
                        gradeWiseCampId: course.id,
                        paypalOrderId: order.id || "",
                        amount: course.fee
                      });
                      setSuccess(true);
                    } catch (err: any) {
                      setError("Payment processing failed. Please try again or contact support.");
                    }
                  }}
                  onError={(err) => {
                    setError("PayPal encountered an error. Please try again.");
                  }}
                />
              </PayPalScriptProvider>
            </div>
            
            <button 
              onClick={() => setStep(1)} 
              className="text-sm font-semibold text-gray-500 hover:text-primary transition-colors mt-6 flex items-center justify-center w-full gap-2"
            >
              ← Back to Details
            </button>
          </div>
        )}

    </div>
  );
}
