import Navbar from "../components/Navbar";
import HeroSection from "../components/landing/HeroSection";
import DashboardPreview from "../components/landing/DashboardPreview";
import FeaturesSection from "../components/landing/FeaturesSection";
import Footer from "../components/landing/Footer";

function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <DashboardPreview />
      <FeaturesSection />
       <Footer />
    </>
  );
}

export default LandingPage;