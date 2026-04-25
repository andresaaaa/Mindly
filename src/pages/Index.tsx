import Navbar from "@/components/mindly/Navbar";
import Hero from "@/components/mindly/Hero";
import Features from "@/components/mindly/Features";
import AISE from "@/components/mindly/AISE";
import Testimonials from "@/components/mindly/Testimonials";
import CTA from "@/components/mindly/CTA";
import Footer from "@/components/mindly/Footer";

const Index = () => {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <AISE />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
