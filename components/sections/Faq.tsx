import { site } from "@/content/site";
import Accordion from "@/components/ui/Accordion";

export default function Faq() {
  const { faq } = site;

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative z-10 border-t border-line px-5 py-24 md:px-8 md:py-32"
    >
      <div className="text-scrim mx-auto w-full max-w-4xl">
        <p className="label text-muted">{faq.label}</p>
        <h2
          id="faq-title"
          className="mt-6 text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] font-medium tracking-[-0.03em]"
        >
          {faq.heading} <em className="accent-italic">{faq.headingEmphasis}</em>
        </h2>

        <div className="mt-12">
          <Accordion items={faq.items} />
        </div>
      </div>
    </section>
  );
}