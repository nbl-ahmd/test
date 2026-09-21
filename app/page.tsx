import { site } from "@/content/site";

export default function Home() {
  return (
    <div id="top">
      <section
        aria-labelledby="hero-title"
        className="relative z-10 flex min-h-svh flex-col justify-end px-5 pb-12 md:px-8 md:pb-16"
      >
        <p className="label text-muted">
          ({site.name.toLowerCase()} — web studio)
        </p>
        <h1
          id="hero-title"
          className="display mt-6 max-w-[16ch] text-balance"
        >
          We weave <em className="accent-italic">ideas</em> into the web.
        </h1>
        <p className="mt-8 max-w-xl text-lg text-pretty text-muted md:text-xl">
          {site.description}
        </p>
      </section>

      {site.nav.map((item) => (
        <section
          key={item.id}
          id={item.id}
          aria-labelledby={`${item.id}-title`}
          className="relative z-10 min-h-[70svh] border-t border-line px-5 py-24 md:px-8 md:py-32"
        >
          <p className="label text-muted">({item.index})</p>
          <h2
            id={`${item.id}-title`}
            className="display mt-6 text-[clamp(2.5rem,7vw,6rem)]"
          >
            {item.label}
          </h2>
          <p className="label mt-8 text-muted">
            ( section scaffold — content lands in a later phase )
          </p>
        </section>
      ))}
    </div>
  );
}
