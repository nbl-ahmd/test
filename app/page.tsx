import { site } from "@/content/site";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />

      {site.nav.map((item) => (
        <section
          key={item.id}
          id={item.id}
          aria-labelledby={`${item.id}-title`}
          className="relative z-10 min-h-[70svh] border-t border-line px-5 py-24 md:px-8 md:py-32"
        >
          <p className="label text-muted">({item.index})</p>
          <h2
            id={`${item.id}-title`}
            className="display mt-6 text-[clamp(2.5rem,7vw,6rem)]"
          >
            {item.label}
          </h2>
          <p className="label mt-8 text-muted">
            ( section scaffold — content lands in a later phase )
          </p>
        </section>
      ))}
    </>
  );
}