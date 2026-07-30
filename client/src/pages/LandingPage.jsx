import Navbar from "../components/Navbar";
import HeroSection from "../components/landing/HeroSection";
import DashboardPreview from "../components/landing/DashboardPreview";
import FeaturesSection from "../components/landing/FeaturesSection";
import Footer from "../components/landing/Footer";
import StatsSection from "../components/landing/StatsSection";
import CTASection from "../components/landing/CTASection";
import TestimonialsSection from "../components/landing/TestimonialsSection";

function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <DashboardPreview />
      <FeaturesSection />
      <StatsSection />
       <TestimonialsSection />
      <CTASection />
       <Footer />

       
    </>
  );
}

export default LandingPage;