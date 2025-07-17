
import Header from '../components/Header';
import Hero from '../components/Hero';
import FeaturedGames from '../components/FeaturedGames';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <Hero />
      <FeaturedGames />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
