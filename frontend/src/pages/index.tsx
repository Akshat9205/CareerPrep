import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Roles } from '@/components/Roles';
import { DashboardPreview } from '@/components/DashboardPreview';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle scrolling to specific sections when coming from other routes
    if (location.hash) {
      // Use a slight timeout to ensure complex components (like 3D WebGL) finish painting first
      const timeoutId = setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timeoutId);
    } else {
      // If navigating explicitly to Home (/), scroll to top gracefully
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.hash, location.pathname]);
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <Hero />
      <Roles />
      <DashboardPreview />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
