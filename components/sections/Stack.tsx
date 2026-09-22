import { Fragment } from "react";
import { site } from "@/content/site";
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
        <p className="mt-16 max-w-[62ch] text-[clamp(1.5rem,3.4vw,3rem)] leading-[1.35] font-medium tracking-[-0.03em] text-pretty">
          {stack.groups.map((group, groupIndex) => (
            <Fragment key={group.title}>
              <span className="label mr-3 align-middle text-muted">
                {group.title}
              </span>
              {group.items.map((item, itemIndex) => (
                <Fragment key={item}>
                  <span className="tech-link">{item}</span>
                  {itemIndex < group.items.length - 1 ? " / " : ""}
                </Fragment>
              ))}
              {groupIndex < stack.groups.length - 1 ? " / " : ""}
            </Fragment>
          ))}
        </p>

        <p className="mt-14 text-muted">{stack.footnote}</p>
      </Container>
    </section>
  );
}
