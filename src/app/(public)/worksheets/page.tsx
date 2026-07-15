import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FaBookOpen, FaClock, FaCheckCircle, FaFilePdf } from "react-icons/fa";

export const metadata = {
  title: "Ignyto Worksheets | Free Math Resources",
  description: "Download free, high-quality math worksheets for students.",
};

export default async function WorksheetsPage() {
  const worksheets = await prisma.worksheet.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="bg-bg-light min-h-screen pb-20">
      <div className="bg-primary pt-[120px] pb-20 px-5 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Ignyto Worksheets Library</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
          Download high-quality, beautifully designed math worksheets. Perfect for home practice, teachers, and self-paced learning.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-12">
        {worksheets.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-700">More worksheets coming soon!</h2>
            <p className="text-gray-500 mt-2">Check back later for new resources.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {worksheets.map((worksheet) => (
              <div key={worksheet.id} className="bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col group hover:-translate-y-2 transition-all duration-300">
                <div className="bg-primary/5 h-48 relative p-6 flex justify-center items-end border-b border-gray-100">
                  {worksheet.heroImage ? (
                    <img src={worksheet.heroImage} alt="Hero" className="h-40 object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <FaFilePdf className="text-7xl text-primary/30 mb-4" />
                  )}
                  <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Free Worksheet
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <span className="text-sm font-bold text-secondary mb-2 uppercase tracking-wide">{worksheet.grade}</span>
                  <h3 className="text-2xl font-bold text-primary-dark mb-3 leading-tight group-hover:text-primary transition-colors">
                    {worksheet.title}
                  </h3>
                  <p className="text-gray-600 mb-6 flex-1 line-clamp-2">
                    {worksheet.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-400" />
                      <span>{worksheet.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-gray-400" />
                      <span>{worksheet.questionCount}</span>
                    </div>
                  </div>

                  <Link 
                    href={`/worksheets/${worksheet.slug}`} 
                    className="block text-center w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-[0_8px_20px_rgba(30,58,138,0.2)] hover:bg-primary-dark transition-colors"
                  >
                    View Worksheet
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
