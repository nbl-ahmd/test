import { site } from "@/content/site";
import Accordion from "@/components/ui/Accordion";
import Container from "@/components/layout/Container";
import LineReveal from "@/components/ui/LineReveal";

export default function Faq() {
  const { faq } = site;

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative z-10 border-t border-line py-24 md:py-32"
    >
      <Container>
        <p className="label text-muted">{faq.label}</p>
        <LineReveal
          as="h2"
          id="faq-title"
          className="mt-6 text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] font-medium tracking-[-0.03em]"
          stagger={0.1}
          yPercent={115}
        >
          {faq.heading} <em className="accent-italic">{faq.headingEmphasis}</em>
        </LineReveal>

        <div className="mt-12">
          <Accordion items={faq.items} />
        </div>
      </Container>
    </section>
  );
}