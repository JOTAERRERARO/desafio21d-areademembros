import Hero from './components/Hero';
import PainSection from './components/PainSection';
import MethodSection from './components/MethodSection';
import Timeline from './components/Timeline';
import BonusSection from './components/BonusSection';
import SocialProof from './components/SocialProof';
import OfferSection from './components/OfferSection';
import GuaranteeSection from './components/GuaranteeSection';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <PainSection />
      <MethodSection />
      <Timeline />
      <BonusSection />
      <SocialProof />
      <OfferSection />
      <GuaranteeSection />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

export default App;
