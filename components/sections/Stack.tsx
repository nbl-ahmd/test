import { site } from "@/content/site";
import Reveal from "@/components/ui/Reveal";
import Marquee from "@/components/ui/Marquee";
import Container from "@/components/layout/Container";

export default function Stack() {
  const { stack } = site;

  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      className="relative z-10 border-t border-line py-24 md:py-32"
    >
      <Container>
        <h2 id="stack-title" className="label text-muted">
          {stack.label}
        </h2>
      </Container>

      <div className="mt-10">
        <Marquee items={stack.marquee} />
      </div>

      <Container>
        <Reveal className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {stack.groups.map((group) => (
            <div key={group.title} data-reveal>
              <h3 className="label text-muted">{group.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line px-3 py-1.5 text-sm text-fg/85"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>

        <p className="mt-14 text-muted">{stack.footnote}</p>
      </Container>
    </section>
  );
}