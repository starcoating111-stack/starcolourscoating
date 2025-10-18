import HeaderContainer from '../LandingPage/headerComponents/HeaderContainer';
import Banner from '../LandingPage/Banner';
import AboutSection from '../LandingPage/AboutSection';
import ClientReviews from '../LandingPage/ClientReviews';
import BeforeAfterSection from '../LandingPage/BeforeAfterSection';
import PortfolioSection from '../LandingPage/PortfolioSection';
import FounderSection from '../LandingPage/FounderSection';
import ContactUs from '../LandingPage/ContactUs';
import Footer from '../LandingPage/Footer';
import ContactFloatingButton from '../LandingPage/ContactFloatingButton';
import ServicesSection from '../LandingPage/ServicesSection';
import PageLayout from '../PageLayout';
import ScrollReveal from '../ScrollReveal';

const sections = [
  { component: <Banner />, delay: 0 },
  { component: <ServicesSection />, delay: 100 },
  { component: <AboutSection />, delay: 200 },
  { component: <ClientReviews />, delay: 300 },
  { component: <BeforeAfterSection />, delay: 400 },
  { component: <PortfolioSection />, delay: 500 },
  { component: <FounderSection />, delay: 600 },
  { component: <ContactUs />, delay: 700 },
];

export default function LandingPage() {
  return (
    <PageLayout>
      <HeaderContainer />
      {sections.map(({ component, delay }, idx) => (
        <ScrollReveal key={idx} direction="up" delay={delay}>
          {component}
        </ScrollReveal>
      ))}
      <ContactFloatingButton />
      <Footer />
    </PageLayout>
  );
}
