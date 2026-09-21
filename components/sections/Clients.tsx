import { site } from "@/content/site";
import Reveal from "@/components/ui/Reveal";

export default function Clients() {
  return (
    <section
      id="clients"
      aria-labelledby="clients-title"
      className="relative z-10 border-t border-line px-5 py-24 md:px-8 md:py-32"
    >
      <div className="text-scrim mx-auto w-full max-w-6xl">
        <p className="label text-muted">{site.clients.label}</p>
        <h2
          id="clients-title"
          className="mt-6 max-w-3xl text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.1] font-medium tracking-[-0.03em] text-balance"
        >
          {site.clients.heading}
        </h2>

        <Reveal className="mt-14 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {site.clients.items.map((item) => (
            <article
              key={item.index}
              data-reveal
              className="border-b border-line py-8 sm:pr-6 lg:py-10"
            >
              <p className="label text-muted">{item.index}</p>
              <h3 className="mt-4 text-lg font-medium tracking-[-0.01em]">
                {item.title}
              </h3>
              <p className="mt-3 text-pretty text-muted">{item.body}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}