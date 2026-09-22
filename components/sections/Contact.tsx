import { site } from "@/content/site";
import ContactForm from "@/components/ui/ContactForm";
import Container from "@/components/layout/Container";
import LineReveal from "@/components/ui/LineReveal";

export default function Contact() {
  const { contact } = site;

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative z-10 border-t border-line py-24 md:py-32"
    >
      <Container>
        <div className="grid-12">
          <div className="col-span-12 lg:col-span-7">
          <p className="label text-muted">{contact.label}</p>
          <LineReveal
            as="h2"
            id="contact-title"
            className="mt-6 text-[clamp(2.4rem,5vw,4rem)] leading-[1.03] font-medium tracking-[-0.03em] text-balance max-sm:text-[clamp(1.9rem,8vw,2.4rem)]"
            stagger={0.08}
            yPercent={105}
          >
            {contact.title}{" "}
            <em className="accent-italic">{contact.titleEmphasis}</em>
          </LineReveal>
          <div className="mt-10">
            <ContactForm />
          </div>

        <aside className="mt-16 border-t border-line pt-10">
          <h3 className="label text-muted">{contact.nextLabel}</h3>
          <ol className="mt-5 space-y-5">
            {contact.nextSteps.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="label pt-1 text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-pretty text-fg/85">{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-10 space-y-3 border-t border-line pt-6">
            <p>
              <a
                href={`mailto:${site.email}`}
                className="link-wipe inline-flex min-h-11 items-center text-lg transition-colors hover:text-accent"
              >
                {site.email}
              </a>
            </p>
            <p className="label inline-flex items-center gap-2 text-muted">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
              {contact.availability}
            </p>
            <p className="text-muted">{contact.nda}</p>
          </div>
        </aside>
          </div>
        </div>
      </Container>
    </section>
  );
}