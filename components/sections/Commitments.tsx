import { site } from "@/content/site";
import RollingCounter from "@/components/ui/RollingCounter";
import Container from "@/components/layout/Container";

const LAYOUT = [
  "col-span-12 md:col-span-6 md:col-start-1",
  "col-span-12 md:col-span-4 md:col-start-9 md:mt-24",
  "col-span-12 md:col-span-5 md:col-start-2 md:mt-4",
  "col-span-12 md:col-span-4 md:col-start-8 md:mt-32",
];

const SIZES = [
  "clamp(3.5rem,12vw,9rem)",
  "clamp(2.5rem,8vw,6rem)",
  "clamp(3rem,10vw,7.5rem)",
  "clamp(2rem,6.5vw,5rem)",
];

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

        <div className="grid-12 mt-16 gap-y-14 md:gap-y-0">
          {commitments.items.map((item, index) => (
            <div key={item.label} className={LAYOUT[index]}>
              <p
                className="leading-none font-medium tracking-[-0.045em]"
                style={{ fontSize: SIZES[index] }}
              >
                <RollingCounter value={item.value} />
              </p>
              <p className="label mt-3 text-muted">{item.label}</p>
            </div>
          ))}
        </div>

        <p className="mt-24 max-w-[40ch] text-[clamp(1.1rem,2vw,1.5rem)] leading-[1.4] text-fg/90">
          {commitments.line}
        </p>
      </Container>
    </section>
  );
}
