import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import Expertise from "@/components/Expertise";
import Stratege from "@/components/Stratege";
import Portfolio from "@/components/Portfolio";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        {/* Pas de divider après Hero - il a déjà son indicateur de scroll */}
        <Philosophy />
        <SectionDivider />
        <Expertise />
        <SectionDivider />
        <Stratege />
        <SectionDivider />
        <Portfolio />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
