import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Services from "@/components/sections/Services";
import Clients from "@/components/sections/Clients";
import Process from "@/components/sections/Process";
import Work from "@/components/sections/Work";
import Why from "@/components/sections/Why";
import Commitments from "@/components/sections/Commitments";
import Founder from "@/components/sections/Founder";
import Stack from "@/components/sections/Stack";
import Testimonials from "@/components/sections/Testimonials";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Services />
      <Clients />
      <Process />
      <Work />
      <Why />
      <Commitments />
      <Founder />
      <Stack />
      <Testimonials />
      <Faq />
      <Contact />
    </>
  );
}