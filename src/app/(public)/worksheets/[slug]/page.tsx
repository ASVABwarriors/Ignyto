import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FaBookOpen, FaClock, FaCheckCircle, FaFilePdf, FaDownload, FaCheck, FaHeart, FaSmile, FaLightbulb, FaPlayCircle, FaGraduationCap } from "react-icons/fa";
import Faqs from "@/components/home/Faqs";
import PreviewGalleryModal from "@/components/ui/PreviewGalleryModal";
import WorksheetCarousel from "@/components/ui/WorksheetCarousel";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const worksheet = await prisma.worksheet.findUnique({
    where: { slug }
  });

  if (!worksheet) {
    return {
      title: "Worksheet Not Found",
    };
  }

  const plainTextDesc = worksheet.description || `Download the free ${worksheet.title} math worksheet at Ignyto Tutoring.`;

  return {
    title: `${worksheet.title} | Free Math Worksheet | Ignyto Tutoring`,
    description: plainTextDesc,
    keywords: [worksheet.title, "math worksheet", worksheet.grade, "free worksheet", "Ignyto Tutoring", "practice questions"],
    openGraph: {
      title: worksheet.title,
      description: plainTextDesc,
      images: worksheet.heroImage ? [{ url: worksheet.heroImage }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: worksheet.title,
      description: plainTextDesc,
      images: worksheet.heroImage ? [worksheet.heroImage] : [],
    }
  };
}

export default async function WorksheetDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const worksheet = await prisma.worksheet.findUnique({
    where: { slug },
  });

  if (!worksheet) {
    notFound();
  }

  const featuredWorksheets = await prisma.worksheet.findMany({
    where: { 
      isFeatured: true,
      NOT: { id: worksheet.id }
    },
    take: 10,
    orderBy: { createdAt: "desc" }
  });

  const faqs = await prisma.faq.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <main className="bg-bg-light min-h-screen">
      {/* 1. Top Section - Hero */}
      <div className="bg-primary pt-16 md:pt-20 lg:pt-24 pb-12 lg:pb-16 px-5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
          <div className="text-white space-y-4 lg:space-y-6">
            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
              Free Worksheet
            </span>
            <h1 suppressHydrationWarning className="text-3xl md:text-4xl xl:text-6xl font-bold leading-tight">
              {worksheet.title}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-yellow-400 font-semibold">
              {worksheet.description}
            </p>
            <p className="text-base md:text-lg opacity-90 max-w-xl">
              Printable PDF worksheet with {worksheet.questionCount.split(" ")[0]} practice questions, real-life word problems, and a learning guide with answers and explanations.
            </p>

            <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-xs md:text-sm font-semibold pt-2 lg:pt-4">
              <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg">
                <FaBookOpen /> {worksheet.grade}
              </span>
              <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg">
                <FaClock /> {worksheet.estimatedTime}
              </span>
              <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg">
                <FaCheckCircle /> {worksheet.questionCount}
              </span>
              <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg">
                <FaFilePdf /> PDF Printable
              </span>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-2xl w-full max-w-sm text-center relative z-20">
              <h3 suppressHydrationWarning className="text-xl lg:text-2xl font-bold text-primary-dark mb-4 lg:mb-6">
                Download Your <br/><span className="text-green-600">FREE</span> Worksheet
              </h3>
              
              <ul className="text-left space-y-2 lg:space-y-3 mb-6 lg:mb-8 text-sm lg:text-base text-gray-700 font-medium">
                {worksheet.downloadFeatures ? (
                  worksheet.downloadFeatures.split('\n').map((feature, idx) => (
                    feature.trim() ? (
                      <li key={idx} className="flex items-center gap-3"><FaCheck className="text-green-500" /> {feature.trim()}</li>
                    ) : null
                  ))
                ) : (
                  <>
                    <li className="flex items-center gap-3"><FaCheck className="text-green-500" /> 30 Practice Questions</li>
                    <li className="flex items-center gap-3"><FaCheck className="text-green-500" /> {worksheet.title.split(" Worksheet")[0]}</li>
                    <li className="flex items-center gap-3"><FaCheck className="text-green-500" /> Word Problems</li>
                    <li className="flex items-center gap-3"><FaCheck className="text-green-500" /> Challenge Question</li>
                    <li className="flex items-center gap-3"><FaCheck className="text-green-500" /> Answer Key & Explanations</li>
                  </>
                )}
              </ul>

              <a 
                href={`/api/worksheets/${worksheet.slug}/download`}
                download
                className="flex flex-col items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 lg:py-4 font-bold text-base lg:text-lg transition-all shadow-[0_8px_20px_rgba(22,163,74,0.3)] hover:-translate-y-1"
              >
                <span className="flex items-center gap-2"><FaDownload /> Download PDF</span>
                {worksheet.pdfPageCount && <span className="text-sm font-medium opacity-90 mt-1">({worksheet.pdfPageCount})</span>}
              </a>
              <p className="text-xs text-gray-500 mt-4 font-semibold">100% Free • No Sign Up Required</p>
            </div>

            {/* Floating Hero Image (Dynamic) */}
            {worksheet.heroImage && (
              <img 
                src={worksheet.heroImage} 
                alt="Student learning" 
                className="absolute -bottom-16 -left-16 lg:-left-32 w-64 md:w-80 lg:w-96 drop-shadow-2xl z-0 hidden md:block" 
              />
            )}
          </div>
        </div>
      </div>

      {/* 2. Concept & Preview Section (Side-by-side) */}
      {(worksheet.conceptImage || (worksheet.previewImages && worksheet.previewImages.length > 0)) && (
        <div className="w-full bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-5 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Left: Concept Image */}
              {worksheet.conceptImage ? (
                <div className="bg-white p-6 md:p-8 rounded-[30px] shadow-sm border-2 border-gray-200 h-full flex flex-col justify-center">
                  <img src={worksheet.conceptImage} alt="Concept guide" className="w-full h-auto rounded-xl object-contain mx-auto" />
                </div>
              ) : (
                <div className="hidden lg:block"></div>
              )}

              {/* Right: Preview Gallery */}
              {worksheet.previewImages && worksheet.previewImages.length > 0 && (
                <div>
                  <PreviewGalleryModal images={worksheet.previewImages} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Learning Objectives & What's Included */}
      <div className="max-w-7xl mx-auto px-5 py-24">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Left: What Students Will Learn (Dynamic from Backend) */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start gap-8">
              <div className="flex-1">
                <h2 suppressHydrationWarning className="text-xl md:text-2xl font-bold text-primary-dark flex items-center gap-3 mb-6">
                  <FaGraduationCap className="text-blue-600 text-2xl md:text-3xl" /> What Students Will Learn
                </h2>
                <div className="prose prose-lg prose-green max-w-none"
                     dangerouslySetInnerHTML={{ __html: worksheet.learningObjectives || "<p>Students will master the core concepts of this topic through progressive practice problems.</p>" }}
                />
              </div>
              
              {/* Right pencil & pie chart illustration */}
              <div className="w-48 shrink-0 flex justify-center self-center">
                <img src="/images/pencil_pie.jpg" alt="Learning analytics" className="w-full h-auto object-contain drop-shadow-md rounded-2xl" />
              </div>
            </div>
          </div>

          {/* Right: What's Included (Fixed) */}
          <div className="md:col-span-2 space-y-6">
            <h2 suppressHydrationWarning className="text-2xl md:text-3xl font-bold text-primary-dark flex items-center gap-3">
              <FaBookOpen className="text-secondary" /> What's Included?
            </h2>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <ul className="space-y-6 text-gray-700 font-medium">
                <li className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><FaFilePdf className="text-xl" /></div>
                  <div><strong className="block text-gray-900">Printable PDF worksheet</strong>Ready to print format</div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-green-100 p-2 rounded-lg text-green-600"><FaCheckCircle className="text-xl" /></div>
                  <div><strong className="block text-gray-900">{worksheet.questionCount}</strong>Carefully designed to build skills</div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><FaSmile className="text-xl" /></div>
                  <div><strong className="block text-gray-900">Real-life word problems</strong>Applying math to the real world</div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><FaLightbulb className="text-xl" /></div>
                  <div><strong className="block text-gray-900">Challenge question</strong>To push their understanding</div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-primary-light p-2 rounded-lg text-primary"><FaBookOpen className="text-xl" /></div>
                  <div><strong className="block text-gray-900">Answer key & Explanations</strong>Step-by-step solutions</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Why Parents Love (Fixed) */}
      <div className="bg-[#FFFDF5] py-24 border-y border-yellow-100">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-12 relative">
            <h2 suppressHydrationWarning className="text-2xl md:text-3xl font-bold text-primary-dark flex items-center justify-center gap-3 mb-3">
              <FaHeart className="text-red-500" /> Why Parents Love Ignyto Worksheets
            </h2>
            <p className="text-lg text-gray-600 font-medium">We focus on understanding, not memorization.</p>
            
            {/* Right side floating boy */}
            <img 
              src="/images/thumbs_up.jpg" 
              alt="Happy student" 
              className="absolute -right-4 -bottom-16 w-32 md:w-48 hidden lg:block mix-blend-multiply" 
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-yellow-100 text-center group hover:shadow-md hover:border-yellow-300 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 mx-auto bg-green-100 text-green-600 flex items-center justify-center rounded-xl text-2xl mb-4 group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white transition-all duration-300"><FaSmile /></div>
              <h4 suppressHydrationWarning className="font-bold text-gray-900 mb-2">Build Confidence</h4>
              <p className="text-sm text-gray-600">Step-by-step questions help students feel successful.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-yellow-100 text-center group hover:shadow-md hover:border-yellow-300 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 mx-auto bg-orange-100 text-orange-600 flex items-center justify-center rounded-xl text-2xl mb-4 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300"><FaLightbulb /></div>
              <h4 suppressHydrationWarning className="font-bold text-gray-900 mb-2">Encourage Thinking</h4>
              <p className="text-sm text-gray-600">Promotes critical thinking and problem-solving skills.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-yellow-100 text-center group hover:shadow-md hover:border-yellow-300 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 mx-auto bg-blue-100 text-blue-600 flex items-center justify-center rounded-xl text-2xl mb-4 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300"><FaPlayCircle /></div>
              <h4 suppressHydrationWarning className="font-bold text-gray-900 mb-2">Independent Learning</h4>
              <p className="text-sm text-gray-600">Perfect for home practice and self-paced learning.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-yellow-100 text-center group hover:shadow-md hover:border-yellow-300 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 mx-auto bg-pink-100 text-pink-600 flex items-center justify-center rounded-xl text-2xl mb-4 group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300"><FaHeart /></div>
              <h4 suppressHydrationWarning className="font-bold text-gray-900 mb-2">Make Math Enjoyable</h4>
              <p className="text-sm text-gray-600">Engaging problems that make learning fun and meaningful.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. FAQs & Confident Box */}
      <div className="max-w-7xl mx-auto px-5 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-3">
            <h2 suppressHydrationWarning className="text-2xl md:text-3xl font-bold text-primary-dark mb-8">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <details className="group border border-gray-200 rounded-xl bg-white overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer p-5 font-bold text-primary-dark">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">?</div>
                    Is this worksheet free?
                  </div>
                  <span className="transition group-open:rotate-180 text-primary">
                    <svg fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 pt-0 text-gray-600 text-sm pl-[3.25rem]">
                  Yes! Every worksheet in our library is completely free to download and print.
                </div>
              </details>

              <details className="group border border-gray-200 rounded-xl bg-white overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer p-5 font-bold text-primary-dark">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">?</div>
                    Is this worksheet aligned with US standards?
                  </div>
                  <span className="transition group-open:rotate-180 text-primary">
                    <svg fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 pt-0 text-gray-600 text-sm pl-[3.25rem]">
                  Yes. Our Grade 5 worksheets are designed around Common Core concepts commonly taught in US schools.
                </div>
              </details>

              <details className="group border border-gray-200 rounded-xl bg-white overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer p-5 font-bold text-primary-dark">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">?</div>
                    Can teachers use this worksheet?
                  </div>
                  <span className="transition group-open:rotate-180 text-primary">
                    <svg fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 pt-0 text-gray-600 text-sm pl-[3.25rem]">
                  Absolutely! Teachers and homeschool educators are welcome to use our worksheets in their classrooms.
                </div>
              </details>

              <details className="group border border-gray-200 rounded-xl bg-white overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer p-5 font-bold text-primary-dark">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">?</div>
                    How long does this worksheet take?
                  </div>
                  <span className="transition group-open:rotate-180 text-primary">
                    <svg fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 pt-0 text-gray-600 text-sm pl-[3.25rem]">
                  Most students complete it in approximately 25-30 minutes.
                </div>
              </details>

              <details className="group border border-gray-200 rounded-xl bg-white overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer p-5 font-bold text-primary-dark">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">?</div>
                    What if my child is struggling with fractions?
                  </div>
                  <span className="transition group-open:rotate-180 text-primary">
                    <svg fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 pt-0 text-gray-600 text-sm pl-[3.25rem]">
                  That's completely normal. Fractions are challenging for many students. Personalized guidance can make a huge difference. <Link href="/#tutoring" className="text-primary font-bold hover:underline">See how our tutors can help →</Link>
                </div>
              </details>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-[#F0FDF4] rounded-3xl p-6 lg:p-8 border-2 border-green-200 sticky top-24 shadow-sm">
              <h3 suppressHydrationWarning className="text-lg md:text-xl font-bold text-green-800 mb-3 leading-tight">Help Your Child Feel Confident in Math</h3>
              <p className="text-gray-700 mb-6 text-sm">
                At <strong>Ignyto Tutoring</strong>, we help students truly understand math — not just memorize formulas.
              </p>
              
              <div className="flex items-end justify-between gap-4 mb-6">
                <ul className="space-y-3 text-sm font-semibold text-gray-800 flex-1">
                  <li className="flex items-start gap-2 leading-tight"><FaCheckCircle className="text-green-500 shrink-0 mt-0.5" /> <span>One-on-One Online Lessons</span></li>
                  <li className="flex items-start gap-2 leading-tight"><FaCheckCircle className="text-green-500 shrink-0 mt-0.5" /> <span>Grades 5-8 Specialists</span></li>
                  <li className="flex items-start gap-2 leading-tight"><FaCheckCircle className="text-green-500 shrink-0 mt-0.5" /> <span>Algebra 1 & Geometry Support</span></li>
                  <li className="flex items-start gap-2 leading-tight"><FaCheckCircle className="text-green-500 shrink-0 mt-0.5" /> <span>Personalized Learning Plans</span></li>
                  <li className="flex items-start gap-2 leading-tight"><FaCheckCircle className="text-green-500 shrink-0 mt-0.5" /> <span>Confidence-Building Approach</span></li>
                </ul>
                <div className="w-28 lg:w-36 shrink-0 relative top-2">
                  <img 
                    src="/images/online_tutor.jpg" 
                    alt="Student learning online" 
                    className="w-full object-cover rounded-xl shadow-sm aspect-square mix-blend-multiply" 
                  />
                </div>
              </div>
              
              <Link 
                href="/#tutoring" 
                className="block text-center w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg shadow-[0_8px_20px_rgba(22,163,74,0.3)] hover:bg-green-700 transition-colors mb-2"
              >
                Book a FREE Trial Lesson
              </Link>
              <p className="text-center text-xs text-gray-500 font-semibold uppercase tracking-wide">No commitment. Just help.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Quick Links / Explore More */}
      {featuredWorksheets.length > 0 && (
        <div className="bg-[#FFFDF5] py-24 border-t border-gray-100 overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-5 relative">
            <h2 suppressHydrationWarning className="text-2xl font-bold text-primary-dark mb-8">
              Explore More {worksheet.grade} Worksheets
            </h2>
            
            <WorksheetCarousel worksheets={featuredWorksheets} />
          </div>
        </div>
      )}
    </main>
  );
}
