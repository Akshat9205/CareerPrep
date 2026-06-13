import { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { HowItWorks } from '@/components/HowItWorks';
import { Footer } from '@/components/Footer';

const AboutUsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default AboutUsPage;
