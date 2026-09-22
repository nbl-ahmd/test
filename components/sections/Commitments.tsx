import { site } from "@/content/site";
import RollingCounter from "@/components/ui/RollingCounter";
import Container from "@/components/layout/Container";

const LAYOUT = [
  "lg:col-span-6 lg:col-start-1",
  "mt-0 sm:mt-10 lg:col-span-4 lg:col-start-9 lg:mt-24",
  "lg:col-span-5 lg:col-start-2 lg:mt-4",
  "mt-0 sm:mt-10 lg:col-span-4 lg:col-start-8 lg:mt-32",
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

        <div className="mt-16 grid grid-cols-1 gap-y-14 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-12 lg:gap-x-0 lg:gap-y-0">
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
