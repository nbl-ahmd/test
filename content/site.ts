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

export type Cta = {
  label: string;
  href: string;
};

export type Principle = {
  index: string;
  title: string;
  body: string;
};

export type Service = {
  index: string;
  title: string;
  summary: string;
  detail: string;
  deliverables: string[];
  bestFor: string;
  timeline: string;
};

export type ClientType = {
  index: string;
  title: string;
  body: string;
};

export type ProcessStep = {
  index: string;
  name: string;
  timing: string;
  tasks: string[];
  outcome: string;
};

export type Project = {
  index: string;
  name: string;
  type: string;
  year: string;
  blurb: string;
  stack: string[];
  highlights: string[];
  gradient: string;
};

export type WhyRow = {
  label: string;
  typical: string;
  domweave: string;
};

export type Commitment = {
  value: string;
  label: string;
};

export type StackGroup = {
  title: string;
  items: string[];
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type HeroCopy = {
  label: string;
  titleBefore: string;
  titleEmphasis: string;
  titleAfter: string;
  sub: string;
  scrollLabel: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  trustStrip: string[];
};

export type ManifestoCopy = {
  label: string;
  body: string;
  principles: Principle[];
};

export type ContactCopy = {
  label: string;
  title: string;
  titleEmphasis: string;
  projectTypes: string[];
  budgets: string[];
  messagePlaceholder: string;
  submitLabel: string;
  successTitle: string;
  successBody: string;
  errorTitle: string;
  nextLabel: string;
  nextSteps: string[];
  availability: string;
  nda: string;
};

export type FooterCopy = {
  tagline: string;
  legal: string;
  backToTop: string;
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
  availability: string;
  currency: string;
  status: string;
  timeZone: string;
  nav: NavItem[];
  socials: SocialLink[];
  cta: Cta;
  hero: HeroCopy;
  manifesto: ManifestoCopy;
  services: {
    label: string;
    heading: string;
    headingEmphasis: string;
    note: string;
    items: Service[];
  };
  clients: {
    label: string;
    heading: string;
    items: ClientType[];
  };
  process: {
    label: string;
    heading: string;
    headingEmphasis: string;
    steps: ProcessStep[];
  };
  work: {
    label: string;
    heading: string;
    headingEmphasis: string;
    sampleTag: string;
    closing: string;
    projects: Project[];
  };
  why: {
    label: string;
    heading: string;
    columns: { typical: string; domweave: string };
    rows: WhyRow[];
  };
  commitments: {
    label: string;
    items: Commitment[];
    line: string;
  };
  stack: {
    label: string;
    marquee: string[];
    groups: StackGroup[];
    footnote: string;
  };
  testimonials: Testimonial[];
  faq: {
    label: string;
    heading: string;
    headingEmphasis: string;
    items: FaqItem[];
  };
  contact: ContactCopy;
  footer: FooterCopy;
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
  // TODO: confirm availability window before launch.
  availability: "Booking Q4 2026",
  currency: "USD",
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
  // TODO: add real profile URLs; the section is hidden while empty.
  socials: [],
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
    primaryCta: { label: "Start a project", href: "#contact" },
    secondaryCta: { label: "See our work", href: "#work" },
    trustStrip: [
      "Fixed-scope quotes",
      "You own the code",
      "Weekly demos",
    ],
  },
  manifesto: {
    label: "( manifesto )",
    body: "Every great product is a thousand small threads pulled tight — design, code, copy, performance, trust. We weave them together so nothing comes loose after launch.",
    principles: [
      {
        index: "(a)",
        title: "One team",
        body: "Design and engineering under one roof, so nothing gets lost in handover.",
      },
      {
        index: "(b)",
        title: "Fast by default",
        body: "Performance is a feature we budget for from day one, not a fix we promise for later.",
      },
      {
        index: "(c)",
        title: "No lock-in",
        body: "Standard tech, your repo, your accounts. You can walk away any day.",
      },
    ],
  },
  services: {
    label: "(01) services",
    heading: "What we",
    headingEmphasis: "build",
    note: "( timelines are typical — your fixed quote confirms yours )",
    items: [
      {
        index: "01",
        title: "Websites",
        summary:
          "Brand and company sites that load fast, rank well and feel unmistakably yours.",
        detail:
          "From five-page marketing sites to multi-language content platforms. We design the system, build it in Next.js and connect a CMS your team will actually enjoy using.",
        deliverables: [
          "Custom design system & UI",
          "Headless CMS (Sanity, Payload or Contentful)",
          "SEO foundations & structured data",
          "Analytics & cookie consent",
          "Core Web Vitals performance budget",
          "WCAG 2.2 AA accessibility",
        ],
        bestFor: "relaunches, brands, professional services",
        timeline: "3–6 weeks",
      },
      {
        index: "02",
        title: "Landing pages",
        summary:
          "Single-purpose pages engineered to turn campaigns into customers.",
        detail:
          "One goal, one story, one action. We pair sharp page structure with instant load times and measurable experiments.",
        deliverables: [
          "Conversion-focused layout & copy structure",
          "A/B test setup",
          "Form → CRM/email integration",
          "UTM & pixel tracking",
          "Motion that guides, not distracts",
          "Sub-second load",
        ],
        bestFor: "product launches, ad campaigns, waitlists",
        timeline: "1–2 weeks",
      },
      {
        index: "03",
        title: "Web apps",
        summary:
          "Dashboards, portals and SaaS products — from first prototype to production.",
        detail:
          "We take an idea from clickable prototype to a secure, scalable product: auth, roles, billing, data — and the boring-but-critical parts done right.",
        deliverables: [
          "Product design & UX flows",
          "Auth & role-based access",
          "Payments & subscriptions (Stripe & regional gateways)",
          "PostgreSQL data model & APIs",
          "Admin dashboards",
          "CI/CD & monitoring",
        ],
        bestFor: "startups, SaaS, client portals",
        timeline: "6–12 weeks to MVP",
      },
      {
        index: "04",
        title: "Custom software",
        summary:
          "Internal tools, integrations and automations that fit exactly how you work.",
        detail:
          "Replace spreadsheets and copy-paste with software built around your process — including AI-assisted workflows where they genuinely help.",
        deliverables: [
          "Internal tools & back-offices",
          "API & third-party integrations",
          "Workflow automation",
          "AI assistants & document processing",
          "Data migration",
          "Documentation & handover",
        ],
        bestFor: "operations teams, growing businesses",
        timeline: "4–10 weeks",
      },
    ],
  },
  clients: {
    label: "( who we work with )",
    heading: "Built for teams who need to ship",
    items: [
      {
        index: "01",
        title: "Startups & founders",
        body: "Ship a credible MVP fast, without accumulating tech debt.",
      },
      {
        index: "02",
        title: "Growing businesses",
        body: "Outgrow templates and spreadsheets with software that fits.",
      },
      {
        index: "03",
        title: "Agencies (white-label)",
        body: "A dependable build partner behind your brand.",
      },
      {
        index: "04",
        title: "Teams needing extra hands",
        body: "Embed a senior engineer + designer for a sprint or a quarter.",
      },
    ],
  },
  process: {
    label: "(02) process",
    heading: "How we",
    headingEmphasis: "weave",
    steps: [
      {
        index: "01",
        name: "Discover",
        timing: "Week 0–1",
        tasks: [
          "Kickoff workshop on goals, users and constraints",
          "Success metrics & scope",
          "Fixed quote and tech recommendation",
        ],
        outcome: "a scoped proposal with timeline",
      },
      {
        index: "02",
        name: "Design",
        timing: "Week 1–2+",
        tasks: [
          "Moodboard → wireframes → clickable prototype",
          "Design system (type, colour, components)",
          "Your feedback before any code",
        ],
        outcome: "an approved Figma prototype",
      },
      {
        index: "03",
        name: "Build",
        timing: "Weeks 2–8",
        tasks: [
          "One-week sprints with a live staging link from day one",
          "Weekly demo call",
          "QA on real devices and browsers",
        ],
        outcome: "a working product, updated every week",
      },
      {
        index: "04",
        name: "Launch & care",
        timing: "Ongoing",
        tasks: [
          "Launch checklist, analytics & monitoring",
          "Handover docs and training",
          "30 days of free support, optional care plan",
        ],
        outcome: "a live product, full source code, documentation",
      },
    ],
  },
  work: {
    label: "(03) work",
    heading: "Selected",
    headingEmphasis: "work",
    // Sample projects for layout only — not real clients.
    sampleTag: "SAMPLE",
    closing: "Your project could be here",
    projects: [
      {
        index: "01",
        name: "Lumen Finance",
        type: "Web app",
        year: "2026",
        blurb: "A real-time analytics dashboard with role-based views.",
        stack: ["Next.js", "PostgreSQL", "tRPC", "Recharts"],
        highlights: [
          "Live-updating charts",
          "Role-based access",
          "Exportable reports",
        ],
        gradient:
          "linear-gradient(135deg, #10131f 0%, #2b3a67 55%, #c8ff2e 135%)",
      },
      {
        index: "02",
        name: "Orbit CRM",
        type: "Custom software",
        year: "2026",
        blurb: "A lightweight CRM that replaced a tangle of spreadsheets.",
        stack: ["React", "Node.js", "PostgreSQL", "n8n"],
        highlights: ["Pipeline board", "Email & calendar sync", "Automated follow-ups"],
        gradient:
          "linear-gradient(135deg, #17102b 0%, #4a2a6b 60%, #a9a8a2 140%)",
      },
      {
        index: "03",
        name: "Fable & Co.",
        type: "Website + e-commerce",
        year: "2025",
        blurb: "A story-led storefront with a headless checkout.",
        stack: ["Next.js", "Shopify (headless)", "Sanity"],
        highlights: [
          "Editorial product pages",
          "Sub-2s LCP target",
          "Multi-currency",
        ],
        gradient:
          "linear-gradient(160deg, #241a12 0%, #6b4a2a 55%, #ecebe6 145%)",
      },
      {
        index: "04",
        name: "Atlas Logistics",
        type: "Landing page",
        year: "2025",
        blurb: "A campaign page built to convert quote requests.",
        stack: ["Next.js", "GSAP", "HubSpot"],
        highlights: [
          "Interactive route map",
          "A/B-tested hero",
          "CRM lead routing",
        ],
        gradient:
          "linear-gradient(135deg, #0b1c17 0%, #1f5a4a 60%, #c8ff2e 140%)",
      },
    ],
  },
  why: {
    label: "( why domweave )",
    heading: "How we compare",
    columns: { typical: "Typical agency", domweave: "Domweave" },
    rows: [
      {
        label: "Pricing",
        typical: "Open-ended hourly billing",
        domweave: "Fixed scope, fixed price",
      },
      {
        label: "Updates",
        typical: "Monthly status reports",
        domweave: "Weekly live demos + shared chat",
      },
      {
        label: "Code",
        typical: "Locked in, licence fees",
        domweave: "You own everything from day one",
      },
      {
        label: "Team",
        typical: "Account managers relay messages",
        domweave: "You talk to the people building it",
      },
      {
        label: "Performance",
        typical: "“We'll optimise later”",
        domweave: "Core Web Vitals budget from day one",
      },
      {
        label: "After launch",
        typical: "Invoice and goodbye",
        domweave: "30 days free support + optional care plan",
      },
    ],
  },
  commitments: {
    label: "commitments, not vanity metrics",
    items: [
      { value: "90+", label: "Lighthouse score target" },
      { value: "24h", label: "reply time" },
      { value: "100%", label: "code ownership is yours" },
      { value: "30d", label: "post-launch support" },
    ],
    line: "Fixed scope. Fixed price. Weekly demos. NDA on request.",
  },
  stack: {
    label: "( stack )",
    marquee: [
      "Next.js",
      "React",
      "TypeScript",
      "Node",
      "PostgreSQL",
      "Tailwind",
      "Three.js",
      "GSAP",
      "Stripe",
      "Vercel",
      "AI/LLM APIs",
    ],
    groups: [
      {
        title: "Frontend",
        items: ["Next.js", "React", "TypeScript", "Tailwind", "GSAP", "Three.js"],
      },
      {
        title: "Backend",
        items: ["Node.js", "PostgreSQL", "Prisma/Drizzle", "REST", "GraphQL", "tRPC"],
      },
      {
        title: "CMS & commerce",
        items: ["Sanity", "Payload", "Contentful", "Shopify (headless)", "Stripe"],
      },
      {
        title: "Cloud & DevOps",
        items: ["Vercel", "AWS", "Cloudflare", "Docker", "GitHub Actions"],
      },
      {
        title: "AI & automation",
        items: [
          "OpenAI / Anthropic / Gemini APIs",
          "RAG",
          "agents",
          "n8n",
        ],
      },
    ],
    footnote: "We pick the right tool for the job — never the trendy one.",
  },
  // TODO: add real testimonials; the section stays hidden while this is empty.
  testimonials: [],
  faq: {
    label: "(04) faq",
    heading: "Questions,",
    headingEmphasis: "answered",
    items: [
      {
        question: "How long does a project take?",
        answer:
          "Landing pages typically take 1–2 weeks, websites 3–6, web-app MVPs 6–12 and custom software 4–10. Your fixed quote confirms the exact timeline before we start.",
      },
      {
        question: "How much does it cost?",
        answer:
          "Every project is scoped and quoted at a fixed price after a free discovery call. Landing pages start small; web apps scale with complexity. The budget range in the contact form helps us tell you honestly what's possible.",
      },
      {
        question: "Do I own the code?",
        answer:
          "Yes — 100%. The repository lives in your account, there are no licence fees, and you can hand it to any developer at any time.",
      },
      {
        question: "What happens after launch?",
        answer:
          "You get 30 days of free support for fixes and questions. After that you can choose a monthly care plan or pay per request — no obligation.",
      },
      {
        question: "Which technologies do you use?",
        answer:
          "Mostly Next.js, React, TypeScript, Node and PostgreSQL, plus a CMS or payment provider where needed. We choose standard, well-supported tools so you're never locked in.",
      },
      {
        question: "Can you work with our existing site or team?",
        answer:
          "Yes. We redesign, rebuild, extend or audit existing products, and we can embed alongside your in-house developers.",
      },
      {
        question: "How do we communicate?",
        answer:
          "A shared chat channel for day-to-day questions, a weekly demo call, and a live staging link you can open any time. We work with clients across time zones.",
      },
      {
        question: "Do you sign NDAs?",
        answer: "Of course — on request, before we discuss any details.",
      },
    ],
  },
  contact: {
    label: "(05) contact",
    title: "Let's weave something",
    titleEmphasis: "great.",
    projectTypes: [
      "Website",
      "Landing page",
      "Web app",
      "Custom software",
      "Other",
    ],
    // TODO: confirm budget bands with the owner before launch.
    budgets: ["Under $2k", "$2k–$5k", "$5k–$15k", "$15k+", "Not sure yet"],
    messagePlaceholder: "What are you building, and what does success look like?",
    submitLabel: "Send message",
    successTitle: "Message sent",
    successBody: "Thanks — we'll read it and reply within 24 hours.",
    errorTitle: "Something went wrong",
    nextLabel: "what happens next",
    nextSteps: [
      "We read your message within 24 hours.",
      "A free 30-minute discovery call.",
      "A fixed-price proposal within 3 working days.",
    ],
    availability: "Booking Q4 2026",
    nda: "NDA on request",
  },
  footer: {
    tagline: "We weave ideas into the web.",
    legal: "© 2026 Domweave Labs",
    backToTop: "Back to top",
  },
};