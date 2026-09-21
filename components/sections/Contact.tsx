import { site } from "@/content/site";
import ContactForm from "@/components/ui/ContactForm";
import Container from "@/components/layout/Container";

export default function Contact() {
  const { contact } = site;

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative z-10 border-t border-line py-24 md:py-32"
    >
      <Container className="grid gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div>
          <p className="label text-muted">{contact.label}</p>
          <h2
            id="contact-title"
            className="mt-6 text-[clamp(2.2rem,5vw,4rem)] leading-[1.03] font-medium tracking-[-0.03em] text-balance"
          >
            {contact.title}{" "}
            <em className="accent-italic">{contact.titleEmphasis}</em>
          </h2>
          <div className="mt-10">
            <ContactForm />
          </div>
        </div>

        <aside className="lg:pt-24">
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
                className="text-lg transition-colors hover:text-accent"
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
      </Container>
    </section>
  );
}