import { site } from "@/content/site";
import Reveal from "@/components/ui/Reveal";
import Tick from "@/components/ui/Tick";

export default function Why() {
  const { why } = site;

  return (
    <section
      id="why"
      aria-labelledby="why-title"
      className="relative z-10 border-t border-line px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto w-full max-w-5xl">
        <p className="label text-muted">{why.label}</p>
        <h2
          id="why-title"
          className="mt-6 text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.1] font-medium tracking-[-0.03em]"
        >
          {why.heading}
        </h2>

        <Reveal className="mt-14" stagger={0.06}>
          <div
            data-reveal
            className="hidden border-b border-line pb-4 md:grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-6"
          >
            <span className="label text-muted" />
            <span className="label text-muted">{why.columns.typical}</span>
            <span className="label text-accent">{why.columns.domweave}</span>
          </div>

          {why.rows.map((row) => (
            <div
              key={row.label}
              data-reveal
              className="grid gap-2 border-b border-line py-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-6"
            >
              <span className="label pt-1 text-muted">{row.label}</span>
              <span className="text-pretty text-muted">{row.typical}</span>
              <span className="flex items-start gap-3 text-pretty text-fg">
                <Tick />
                {row.domweave}
              </span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}