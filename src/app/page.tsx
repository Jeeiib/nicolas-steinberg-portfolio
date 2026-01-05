import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import Expertise from "@/components/Expertise";
import Portfolio from "@/components/Portfolio";
import ChatInterface from "@/components/ChatInterface";
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
        <Portfolio />
        <SectionDivider />
        <ChatInterface />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
