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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pt-4 pb-[100px] md:p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-[20px] md:rounded-3xl shadow-2xl p-4 md:p-8 w-full max-w-lg relative max-h-[100vh] md:max-h-[90vh] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-4 md:mb-6">
          <h3 className="text-lg md:text-2xl font-bold text-primary-dark tracking-wide uppercase">
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
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name<span className="text-red-500">*</span></label>
                <input 
                  type="text" required placeholder="e.g. John Doe" 
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-1.5 md:px-4 md:py-2.5 rounded-lg md:rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-gray-800 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number<span className="text-red-500">*</span></label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg md:rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">
                    +1
                  </span>
                  <input 
                    type="tel" required placeholder="Mobile" 
                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="flex-1 w-full px-3 py-1.5 md:px-4 md:py-2.5 rounded-r-lg md:rounded-r-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-gray-800 placeholder-gray-400 min-w-0"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Select Grade<span className="text-red-500">*</span></label>
                <select 
                  required value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  className="w-full px-3 py-1.5 md:px-4 md:py-2.5 rounded-lg md:rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-gray-800 bg-white"
                >
                  <option value="">Select Grade</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => (
                    <option key={g} value={`Grade ${g}`}>Grade {g}</option>
                  ))}
                  <option value="Grade 12+">Grade 12+</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Interested Course</label>
                <select 
                  value={formData.courseId} onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                  className="w-full px-3 py-1.5 md:px-4 md:py-2.5 rounded-lg md:rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-gray-800 bg-white"
                >
                  <option value="" disabled hidden>General Inquiry</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                  <option value="1-1-tutoring">One to One Tutoring</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address<span className="text-red-500">*</span></label>
              <input 
                type="email" required placeholder="e.g. email@example.com" 
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-1.5 md:px-4 md:py-2.5 rounded-lg md:rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-gray-800 placeholder-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                <input 
                  type="text" placeholder="e.g. New York" 
                  value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-3 py-1.5 md:px-4 md:py-2.5 rounded-lg md:rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-gray-800 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
                <input 
                  type="text" placeholder="e.g. NY" 
                  value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="w-full px-3 py-1.5 md:px-4 md:py-2.5 rounded-lg md:rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Select Date</label>
                <select 
                  value={formData.trialDate} onChange={(e) => setFormData({...formData, trialDate: e.target.value, trialTime: ""})}
                  className="w-full px-3 py-1.5 md:px-4 md:py-2.5 rounded-lg md:rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-gray-800 bg-white"
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
                <label className="block text-xs font-semibold text-gray-700 mb-1">Select Time</label>
                <select 
                  value={formData.trialTime} onChange={(e) => setFormData({...formData, trialTime: e.target.value})}
                  disabled={!formData.trialDate}
                  className="w-full px-3 py-1.5 md:px-4 md:py-2.5 rounded-lg md:rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-gray-800 bg-white disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <option value="" disabled hidden>Select Time</option>
                  {formData.trialDate && trialSlots.find(d => d.dateStr === formData.trialDate)?.timeSlots.map((slot: any) => (
                    <option key={slot.id} value={slot.timeStr}>{slot.timeStr} (PST)</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Message</label>
              <textarea 
                placeholder="How can we help?" rows={2}
                value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-3 py-1.5 md:px-4 md:py-2.5 rounded-lg md:rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-gray-800 placeholder-gray-400 resize-none md:rows-3"
              ></textarea>
            </div>

            <button 
              type="submit" disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 md:py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 mt-2 md:mt-4 text-base md:text-lg"
            >
              {isSubmitting ? "SENDING..." : "SUBMIT INQUIRY"}
            </button>
            
            <div className="text-center mt-2">
              <p className="text-secondary font-bold tracking-wide text-[10px] md:text-xs">Meeting details will be emailed shortly.</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
