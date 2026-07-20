"use client";
import { useState, useEffect } from "react";
import { submitInquiry, getInquiryData } from "@/app/actions/inquiry";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InquiryModal({ isOpen, onClose }: InquiryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [trialSlots, setTrialSlots] = useState<any[]>([]);
  const [formData, setFormData] = useState({ 
    name: "", email: "", phone: "", message: "", 
    grade: "", courseId: "", city: "", state: "", 
    trialDate: "", trialTime: "" 
  });

  useEffect(() => {
    if (isOpen) {
      getInquiryData().then(data => {
        setCourses(data.courses);
        setTrialSlots(data.trialSlots);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await submitInquiry(formData);
    setIsSubmitting(false);
    if (res.success) {
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "", grade: "", courseId: "", city: "", state: "", trialDate: "", trialTime: "" });
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 3000);
    } else {
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-[16px] md:rounded-2xl shadow-2xl p-3 sm:p-4 md:p-5 w-full max-w-lg relative max-h-[95vh] md:max-h-[90vh] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 md:top-3 md:right-3 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-2 md:mb-3">
          <h3 className="text-sm sm:text-base md:text-xl font-bold text-primary-dark tracking-wide uppercase">
            Reserve your seat <span className="text-secondary">for free demo</span>
          </h3>
        </div>

        {submitted ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <p className="text-2xl font-bold text-gray-800">Thank you!</p>
            <p className="text-base text-gray-500 mt-2">Your inquiry has been sent. We'll be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2 md:space-y-2.5">
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <div>
                <label className="block text-[10px] md:text-[11px] font-semibold text-gray-700 mb-0.5 md:mb-1">Your Name<span className="text-red-500">*</span></label>
                <input 
                  type="text" required placeholder="e.g. John Doe" 
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[11px] md:text-xs text-gray-800 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-[10px] md:text-[11px] font-semibold text-gray-700 mb-0.5 md:mb-1">Phone Number<span className="text-red-500">*</span></label>
                <div className="flex">
                  <span className="inline-flex items-center px-2 md:px-2.5 rounded-l-md md:rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-[10px] md:text-xs">
                    +1
                  </span>
                  <input 
                    type="tel" required placeholder="Mobile" 
                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="flex-1 w-full px-2 py-1 md:px-3 md:py-1.5 rounded-r-md md:rounded-r-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[11px] md:text-xs text-gray-800 placeholder-gray-400 min-w-0"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <div>
                <label className="block text-[10px] md:text-[11px] font-semibold text-gray-700 mb-0.5 md:mb-1">Select Grade<span className="text-red-500">*</span></label>
                <select 
                  required value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  className="w-full px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[11px] md:text-xs text-gray-800 bg-white"
                >
                  <option value="">Select Grade</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => (
                    <option key={g} value={`Grade ${g}`}>Grade {g}</option>
                  ))}
                  <option value="Grade 12+">Grade 12+</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] md:text-[11px] font-semibold text-gray-700 mb-0.5 md:mb-1">Interested Course</label>
                <select 
                  value={formData.courseId} onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                  className="w-full px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[11px] md:text-xs text-gray-800 bg-white"
                >
                  <option value="" disabled hidden>General Inquiry</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                  <option value="1-1-tutoring">1-1 Tutoring</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] md:text-[11px] font-semibold text-gray-700 mb-0.5 md:mb-1">Email Address<span className="text-red-500">*</span></label>
              <input 
                type="email" required placeholder="e.g. email@example.com" 
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[11px] md:text-xs text-gray-800 placeholder-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <div>
                <label className="block text-[10px] md:text-[11px] font-semibold text-gray-700 mb-0.5 md:mb-1">City</label>
                <input 
                  type="text" placeholder="e.g. New York" 
                  value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[11px] md:text-xs text-gray-800 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-[10px] md:text-[11px] font-semibold text-gray-700 mb-0.5 md:mb-1">State</label>
                <input 
                  type="text" placeholder="e.g. NY" 
                  value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="w-full px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[11px] md:text-xs text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <div>
                <label className="block text-[10px] md:text-[11px] font-semibold text-gray-700 mb-0.5 md:mb-1">Select Date</label>
                <select 
                  value={formData.trialDate} onChange={(e) => setFormData({...formData, trialDate: e.target.value, trialTime: ""})}
                  className="w-full px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[11px] md:text-xs text-gray-800 bg-white"
                >
                  <option value="" disabled hidden>Select Date</option>
                  {trialSlots.map(dateObj => (
                    <option key={dateObj.id} value={dateObj.dateStr}>
                      {new Date(dateObj.dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] md:text-[11px] font-semibold text-gray-700 mb-0.5 md:mb-1">Select Time</label>
                <select 
                  value={formData.trialTime} onChange={(e) => setFormData({...formData, trialTime: e.target.value})}
                  disabled={!formData.trialDate}
                  className="w-full px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[11px] md:text-xs text-gray-800 bg-white disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <option value="" disabled hidden>Select Time</option>
                  {formData.trialDate && trialSlots.find(d => d.dateStr === formData.trialDate)?.timeSlots.map((slot: any) => (
                    <option key={slot.id} value={slot.timeStr}>{slot.timeStr}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] md:text-[11px] font-semibold text-gray-700 mb-0.5 md:mb-1">Message</label>
              <textarea 
                placeholder="How can we help?" rows={1}
                value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[11px] md:text-xs text-gray-800 placeholder-gray-400 resize-none md:rows-2"
              ></textarea>
            </div>

            <button 
              type="submit" disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-1.5 md:py-2 px-4 md:px-5 rounded-md md:rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 mt-1 md:mt-2 text-xs md:text-sm"
            >
              {isSubmitting ? "SENDING..." : "SUBMIT INQUIRY"}
            </button>
            
            <div className="text-center mt-1 md:mt-1.5">
              <p className="text-secondary font-bold tracking-wide text-[9px] md:text-[10px]">Meeting details will be emailed shortly.</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
