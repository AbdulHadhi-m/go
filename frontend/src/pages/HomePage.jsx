import MainLayout from "../components/layout/MainLayout";
import HeroSection from "../components/Home/HeroSection";
import OffersSection from "../components/Home/OffersSection";
import StatsHighlightSection from "../components/Home/StatsHighlightSection";
import GovernmentBusesSection from "../components/Home/GovernmentBusesSection";
import InfoContentSection from "../components/Home/InfoContentSection";
import FAQSection from "../components/Home/FAQSection";
import PopularRoutesSection from "../components/Home/PopularRoutesSection";

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <OffersSection />
      <PopularRoutesSection />
      <InfoContentSection />
      <StatsHighlightSection />
      <GovernmentBusesSection />
      <FAQSection />
    </MainLayout>
  );
}