import Image from "next/image";
import { site } from "@/content/site";
import Container from "@/components/layout/Container";
import Magnetic from "@/components/ui/Magnetic";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function Founder() {
  const founder = site.founder;
  if (!founder) return null;

  return (
    <section
      id="founder"
      aria-labelledby="founder-title"
      className="relative z-10 border-t border-line py-24 md:py-32"
    >
      <Container className="grid gap-12 md:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] md:items-center">
        <div>
          <p className="label text-muted">( who&apos;s behind domweave )</p>
          <blockquote
            id="founder-title"
            className="mt-8 max-w-[26ch] text-[clamp(1.8rem,3.6vw,3.4rem)] leading-[1.18] font-medium tracking-[-0.03em] text-balance"
          >
            {founder.note}
          </blockquote>
          <p className="mt-8">
            <span className="text-fg">{founder.name}</span>{" "}
            <span className="text-muted">— {founder.role}</span>
          </p>
          <div className="mt-8">
            <Magnetic>
              <a
                href={founder.booking.href}
                data-cursor="open"
                className="label inline-flex items-center rounded-full bg-accent px-5 py-3 text-bg transition-colors hover:bg-fg"
              >
                {founder.booking.label}
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="relative order-first mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg border border-line bg-fg/[0.04] md:order-none md:justify-self-end">
          {founder.photo ? (
            <Image
              src={founder.photo}
              alt={founder.name}
              fill
              sizes="(max-width: 1024px) 100vw, 380px"
              className="object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center text-[clamp(3rem,8vw,6rem)] font-medium tracking-[-0.04em] text-muted"
            >
              {initials(founder.name)}
            </span>
          )}
        </div>
      </Container>
    </section>
  );
}
