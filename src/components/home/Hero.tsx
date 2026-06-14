"use client";
import { useState, useEffect } from "react";
import { submitInquiry } from "@/app/actions/inquiry";

export default function Hero({ courses = [] }: { courses?: { id: string, title: string }[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // 🌟 EASY IMAGE SWAP 🌟
  // You can easily use your Cloudinary links here. Just replace the local "/images/..." paths 
  // with your full Cloudinary URLs (e.g., "https://res.cloudinary.com/your-id/image/upload/banner.png")
  const slides = [
    "/images/banner1.png", 
    "/images/banner2.png", 
    "/images/banner3.png"
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "", grade: "", courseId: "", city: "", state: "" });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await submitInquiry(formData);
    setIsSubmitting(false);
      if (res.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", message: "", grade: "", courseId: "", city: "", state: "" });
        setTimeout(() => setSubmitted(false), 3000);
      } else {
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <section className="relative w-[95%] mx-auto my-[10px] mb-[30px] flex flex-col lg:flex-row gap-6">
      {/* Left side: Slider */}
      <div className="relative w-full lg:w-2/3 xl:w-3/4 aspect-video overflow-hidden rounded-[40px] md:rounded-[50px] shadow-[0_5px_20px_rgba(0,0,0,0.15)] flex-shrink-0 bg-white">
        <div className="w-full h-full relative">
           {slides.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Banner ${index + 1}`}
              className={`absolute w-full h-full object-contain transition-opacity duration-800 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            />
          ))}
        </div>
        
        <button 
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
          className="absolute top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 transition-colors text-white border-none py-[10px] px-[15px] md:py-[15px] md:px-[20px] cursor-pointer text-[20px] md:text-[24px] rounded-full z-20 left-[10px] md:left-[20px]"
        >
          &#10094;
        </button>
        
        <button 
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 transition-colors text-white border-none py-[10px] px-[15px] md:py-[15px] md:px-[20px] cursor-pointer text-[20px] md:text-[24px] rounded-full z-20 right-[10px] md:right-[20px]"
        >
          &#10095;
        </button>
      </div>

      {/* Right side: Inquiry Form */}
      <div id="inquiry" className="w-full lg:w-5/12 xl:w-1/3 flex flex-col pt-8 lg:pt-0 z-10 relative">
        
        <div className="flex justify-center px-4 md:px-8 translate-y-4 z-0 relative">
          <div className="bg-primary rounded-t-[30px] py-[18px] shadow-[-2px_-4px_10px_rgba(0,0,0,0.1)] font-bold text-white text-center text-[15px] w-[75%] md:w-[65%] uppercase tracking-wide">
            Quick Inquiry
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[30px] shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-6 md:p-8 flex flex-col justify-center z-10 relative">
          <div className="text-center mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-primary-dark tracking-wide uppercase" suppressHydrationWarning>
              GET IN TOUCH <span className="text-secondary">WITH US</span>
            </h3>
          </div>

          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <p className="text-xl font-bold text-gray-800">Thank you!</p>
              <p className="text-sm text-gray-500 mt-2">Your inquiry has been sent. We'll be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name<span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. John Doe" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm text-gray-800 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number<span className="text-red-500">*</span></label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 sm:text-sm">
                      +1
                    </span>
                    <input 
                      type="tel" 
                      required 
                      placeholder="Mobile" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="flex-1 w-full px-4 py-2.5 rounded-r-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm text-gray-800 placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Select Grade<span className="text-red-500">*</span></label>
                  <select 
                    required 
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm text-gray-800 bg-white"
                  >
                    <option value="">Select Grade</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => (
                      <option key={g} value={`Grade ${g}`}>Grade {g}</option>
                    ))}
                    <option value="Grade 12+">Grade 12+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Interested Course</label>
                  <select 
                    value={formData.courseId}
                    onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm text-gray-800 bg-white"
                  >
                    <option value="">General Inquiry</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                  <input 
                    type="text" 
                    placeholder="e.g. New York" 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm text-gray-800 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                  <input 
                    type="text" 
                    placeholder="e.g. NY" 
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address<span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  required 
                  placeholder="e.g. email@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm text-gray-800 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Message<span className="text-red-500">*</span></label>
                <textarea 
                  required 
                  placeholder="How can we help?" 
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm text-gray-800 placeholder-gray-400 resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-[0_5px_15px_rgba(0,118,255,0.3)] hover:shadow-[0_8px_20px_rgba(0,118,255,0.4)] hover:-translate-y-[2px] disabled:opacity-70 disabled:hover:translate-y-0 mt-4 text-lg"
              >
                {isSubmitting ? "SENDING..." : "SUBMIT"}
              </button>
              
              <div className="text-center mt-3">
                <p className="text-secondary font-bold tracking-wide">We reply within 24 hours!</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
