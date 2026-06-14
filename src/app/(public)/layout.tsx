import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-[70px] md:pb-0">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
