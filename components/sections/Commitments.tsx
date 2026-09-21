import { site } from "@/content/site";
import Reveal from "@/components/ui/Reveal";
import RollingCounter from "@/components/ui/RollingCounter";
import Container from "@/components/layout/Container";

export default function Commitments() {
  const { commitments } = site;

  return (
    <section
      id="commitments"
      aria-labelledby="commitments-title"
      className="relative z-10 border-t border-line py-24 md:py-32"
    >
      <Container>
        <h2 id="commitments-title" className="label text-muted">
          {commitments.label}
        </h2>

        <Reveal className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {commitments.items.map((item) => (
            <div key={item.label} data-reveal>
              <p className="text-[clamp(3rem,8vw,6rem)] leading-none font-medium tracking-[-0.04em]">
                <RollingCounter value={item.value} />
              </p>
              <p className="mt-4 text-pretty text-muted">{item.label}</p>
            </div>
          ))}
        </Reveal>

        <p className="mt-14 text-lg text-fg/85 md:text-xl">
          {commitments.line}
        </p>
      </Container>
    </section>
  );
}