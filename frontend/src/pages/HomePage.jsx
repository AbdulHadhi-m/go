import MainLayout from "../components/layout/MainLayout";
import HeroSection from "../components/Home/HeroSection";
import OffersSection from "../components/Home/OffersSection";
import WhyChooseSection from "../components/Home/WhyChooseSection";
import StatsHighlightSection from "../components/Home/StatsHighlightSection";
import GovernmentBusesSection from "../components/Home/GovernmentBusesSection";
import InfoContentSection from "../components/Home/InfoContentSection";
import FAQSection from "../components/Home/FAQSection";
import FAQItem from "../components/Home/FAQItem";
import GovernmentBusCard from "../components/Home/GovernmentBusCard";
import OfferCard from "../components/Home/OfferCard";
import PopularRoutesSection from "../components/Home/PopularRoutesSection";
import RouteCard from "../components/Home/RouteCard";
import WhyChooseCard from "../components/Home/WhyChooseCard";

export default function HomePage() {
  return (
    <MainLayout>
        <HeroSection/>
        <OffersSection/>
        <PopularRoutesSection/>
        <InfoContentSection/>
        {/* <WhyChooseSection/>  */}
        <StatsHighlightSection/>
        <GovernmentBusesSection/>
        <FAQSection/>

        {/* <FAQItem/> */}
        {/* <GovernmentBusCard/> */}
        {/* <OfferCard/> */}
        {/* <RouteCard/> */}
        {/* <WhyChooseCard/> */}
    </MainLayout>
  );
}