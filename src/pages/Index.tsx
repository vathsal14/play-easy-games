
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import FeaturedGames from '../components/FeaturedGames';
import Newsletter from '../components/Newsletter';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      <Header />
      <Hero />
      <Features />
      <FeaturedGames />
      <FAQ />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
