import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { Roles } from '@/components/Roles';
import { HowItWorks } from '@/components/HowItWorks';
import { DashboardPreview } from '@/components/DashboardPreview';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Roles />
      <DashboardPreview />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;