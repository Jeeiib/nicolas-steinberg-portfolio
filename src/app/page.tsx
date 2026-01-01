import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import Expertise from "@/components/Expertise";
import Stratege from "@/components/Stratege";
import Portfolio from "@/components/Portfolio";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Philosophy />
        <Expertise />
        <Stratege />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
