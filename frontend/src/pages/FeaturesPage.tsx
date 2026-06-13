import { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Features } from '@/components/Features';
import { Footer } from '@/components/Footer';

const FeaturesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default FeaturesPage;
