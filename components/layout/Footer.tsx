import { site } from "@/content/site";
import LocalTime from "@/components/ui/LocalTime";
import BackToTop from "@/components/ui/BackToTop";

type FooterLink = { label: string; href: string };

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="label text-muted">{title}</h2>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <a
              href={link.href}
              className="text-fg/85 transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  const serviceLinks: FooterLink[] = site.services.items.map((service) => ({
    label: service.title,
    href: "#services",
  }));

  const companyLinks: FooterLink[] = [
    { label: "Process", href: "#process" },
    { label: "Work", href: "#work" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer className="relative z-10 border-t border-line px-5 pt-20 pb-10 md:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
          <p className="max-w-xs text-pretty text-fg/85">
            {site.footer.tagline}
          </p>

          <FooterColumn title="Services" links={serviceLinks} />
          <FooterColumn title="Company" links={companyLinks} />

          <nav aria-label="Contact">
            <h2 className="label text-muted">Contact</h2>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-fg/85 transition-colors hover:text-accent"
                >
                  {site.email}
                </a>
              </li>
              <li className="text-muted">{site.availability}</li>
            </ul>

            {site.socials.length > 0 ? (
              <ul className="mt-6 space-y-2">
                {site.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-fg/85 transition-colors hover:text-accent"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </nav>
        </div>

        <p className="mt-20 text-[clamp(2.75rem,14vw,12rem)] leading-[0.8] font-medium tracking-[-0.05em]">
          {site.wordmark}
          <span className="align-super text-[0.28em]">{site.mark}</span>
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <span className="label text-muted">{site.footer.legal}</span>
          <LocalTime />
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}