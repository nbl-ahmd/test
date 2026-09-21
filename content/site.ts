export type NavItem = {
  index: string;
  label: string;
  id: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type HeroCopy = {
  label: string;
  titleBefore: string;
  titleEmphasis: string;
  titleAfter: string;
  sub: string;
  scrollLabel: string;
};

export type ManifestoCopy = {
  label: string;
  body: string;
};

export type SiteConfig = {
  name: string;
  legalName: string;
  wordmark: string;
  mark: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  status: string;
  timeZone: string;
  nav: NavItem[];
  socials: SocialLink[];
  cta: {
    label: string;
    href: string;
  };
  hero: HeroCopy;
  manifesto: ManifestoCopy;
};

export const site: SiteConfig = {
  name: "Domweave Labs",
  legalName: "Domweave Labs",
  wordmark: "domweave",
  mark: "®",
  tagline: "We weave ideas into the web.",
  description:
    "Domweave Labs is a web studio designing and building websites, landing pages, web apps and custom software — engineered for speed, crafted to convert.",
  // TODO: replace with the production domain before launch.
  url: "https://domweave.com",
  // TODO: replace with the studio inbox before launch.
  email: "hello@domweave.com",
  status: "Booking Q4 2026",
  // TODO: set the studio timezone used by the hero clock.
  timeZone: "Europe/London",
  nav: [
    { index: "01", label: "Services", id: "services", href: "#services" },
    { index: "02", label: "Process", id: "process", href: "#process" },
    { index: "03", label: "Work", id: "work", href: "#work" },
    { index: "04", label: "FAQ", id: "faq", href: "#faq" },
    { index: "05", label: "Contact", id: "contact", href: "#contact" },
  ],
  socials: [
    // TODO: replace with real profile URLs before launch.
    { label: "X", href: "https://x.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "GitHub", href: "https://github.com/" },
  ],
  cta: {
    label: "Start a project",
    href: "#contact",
  },
  hero: {
    label: "(domweave labs — web studio)",
    titleBefore: "We weave",
    titleEmphasis: "ideas",
    titleAfter: "into the web.",
    sub: "Websites, landing pages, web apps and custom software — designed and built under one roof, engineered for speed, crafted to convert.",
    scrollLabel: "( scroll )",
  },
  manifesto: {
    label: "( manifesto )",
    body: "Every great product is a thousand small threads pulled tight — design, code, copy, performance, trust. We weave them together so nothing comes loose after launch.",
  },
};
