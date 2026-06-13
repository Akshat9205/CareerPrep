import { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
