import { site } from "@/content/site";
import Reveal from "@/components/ui/Reveal";

export default function Testimonials() {
  const items = site.testimonials;
  if (items.length === 0) return null;

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="relative z-10 border-t border-line px-5 py-24 md:px-8 md:py-32"
    >
      <div className="text-scrim mx-auto w-full max-w-6xl">
        <h2 id="testimonials-title" className="label text-muted">
          ( what clients say )
        </h2>

        <Reveal className="mt-12 grid gap-8 md:grid-cols-2">
          {items.map((item) => (
            <figure
              key={`${item.name}-${item.quote}`}
              data-reveal
              className="border-t border-line pt-6"
            >
              <blockquote className="text-pretty text-xl leading-[1.5] text-fg/85 md:text-2xl">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-5 text-muted">
                <span className="text-fg">{item.name}</span>
                {item.role ? ` — ${item.role}` : null}
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}