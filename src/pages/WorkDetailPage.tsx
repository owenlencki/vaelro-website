import { Link, Navigate, useParams } from "react-router-dom";
import Reveal from "../components/ui/Reveal";
import MagneticButton from "../components/ui/MagneticButton";
import { withBase } from "../lib/paths";
import { featuredProjects, getProject } from "../data/projects";

function domainOf(url: string): string {
  return new URL(url).hostname.replace(/^www\./, "");
}

const blockLabel =
  "font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm";

export default function WorkDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProject(slug) : undefined;

  // Unknown slugs and unfeatured projects have no page.
  if (!project || !project.featured || !project.images) {
    return <Navigate to="/#work" replace />;
  }

  const idx = featuredProjects.findIndex((p) => p.slug === project.slug);
  const prev = idx > 0 ? featuredProjects[idx - 1] : undefined;
  const next =
    idx < featuredProjects.length - 1 ? featuredProjects[idx + 1] : undefined;

  const facts: Array<{ label: string; value: string }> = [
    { label: "Client", value: project.client },
    ...(project.location
      ? [{ label: "Location", value: project.location }]
      : []),
    { label: "Category", value: project.category },
    ...(project.owns ? [{ label: "Owns", value: project.owns }] : []),
  ];

  return (
    <>
      {/* React 19 hoists these into <head>. */}
      <title>{`${project.name} | Work | Vaelro`}</title>
      <meta name="description" content={project.tagline} />

      <article className="bg-cream-100 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="container-site">
          <Link
            to="/#work"
            className="nav-link inline-flex min-h-11 items-center gap-2 font-semibold text-ink-600 hover:text-orange-600"
          >
            <span aria-hidden="true">←</span> All work
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <p className={blockLabel}>
              {project.category} · {project.year}
            </p>
            {project.badge && (
              <span className="rounded-full bg-ink-900 px-3 py-0.5 font-mono text-[0.65rem] tracking-[0.12em] text-cream-100 uppercase">
                {project.badge}
              </span>
            )}
          </div>
          <h1 className="mt-4 max-w-3xl font-serif text-title font-bold text-ink-900">
            {project.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lead text-ink-600">
            {project.tagline}
          </p>

          <Reveal delay={0.15}>
            <div className="mt-10 aspect-[16/10] overflow-hidden rounded-2xl bg-peach-100 shadow-[0_20px_60px_rgba(26,26,26,0.12)] md:mt-14">
              <img
                src={withBase(project.images.hero)}
                alt={project.images.alt}
                width={1600}
                height={1000}
                decoding="async"
                fetchPriority="high"
                className="h-full w-full object-cover object-top"
              />
            </div>
          </Reveal>

          <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-3 lg:gap-14">
            <div className="space-y-10 lg:col-span-2">
              <div>
                <h2 className={blockLabel}>The situation</h2>
                <p className="mt-3 leading-relaxed text-ink-600">
                  {project.situation}
                </p>
              </div>
              <div>
                <h2 className={blockLabel}>What we built</h2>
                <p className="mt-3 leading-relaxed text-ink-600">
                  {project.built}
                </p>
              </div>
              {project.changed && (
                <div>
                  <h2 className={blockLabel}>What changed</h2>
                  <p className="mt-3 leading-relaxed text-ink-600">
                    {project.changed}
                  </p>
                </div>
              )}
            </div>

            <aside className="h-fit rounded-2xl border border-cream-300 bg-cream-50 p-6 lg:sticky lg:top-28">
              <dl className="space-y-4">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt className="font-mono text-[0.65rem] tracking-[0.18em] text-muted uppercase">
                      {f.label}
                    </dt>
                    <dd className="mt-1 font-semibold text-ink-900">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link mt-6 inline-flex min-h-11 items-center gap-1 font-semibold text-orange-600 hover:text-orange-700"
                >
                  Visit {domainOf(project.liveUrl)}{" "}
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </aside>
          </div>

          {/* Renders only when a testimonial exists; no placeholder UI. */}
          {project.testimonial && (
            <figure className="mx-auto mt-16 max-w-3xl text-center md:mt-24">
              <blockquote className="font-serif text-heading italic leading-snug text-ink-900">
                “{project.testimonial.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm text-muted">
                {project.testimonial.name}, {project.testimonial.role}
              </figcaption>
            </figure>
          )}

          <nav
            aria-label="More work"
            className="mt-16 flex items-center justify-between gap-4 border-t border-cream-300 pt-8 md:mt-24"
          >
            {prev ? (
              <Link
                to={`/work/${prev.slug}`}
                className="group inline-flex min-h-11 flex-col justify-center"
              >
                <span className="font-mono text-[0.65rem] tracking-[0.18em] text-muted uppercase">
                  Previous
                </span>
                <span className="nav-link mt-1 font-serif font-bold text-ink-900 group-hover:text-orange-600">
                  {prev.name}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                to={`/work/${next.slug}`}
                className="group inline-flex min-h-11 flex-col justify-center text-right"
              >
                <span className="font-mono text-[0.65rem] tracking-[0.18em] text-muted uppercase">
                  Next
                </span>
                <span className="nav-link mt-1 font-serif font-bold text-ink-900 group-hover:text-orange-600">
                  {next.name}
                </span>
              </Link>
            ) : (
              <span />
            )}
          </nav>

          <Reveal>
            <div className="relative mt-16 overflow-hidden rounded-3xl bg-ink-900 bg-noise px-6 py-14 text-center md:mt-24 md:py-20">
              <h2 className="mx-auto max-w-2xl font-serif text-heading font-bold text-cream-100">
                Want something like this for your business?
              </h2>
              <div className="mt-8 flex justify-center">
                <MagneticButton>
                  <Link
                    to="/contact"
                    className="inline-flex min-h-12 items-center rounded-full bg-orange-500 px-8 py-3.5 text-base font-bold text-white shadow-[0_8px_30px_rgba(212,116,59,0.35)] transition-colors duration-200 hover:bg-orange-600"
                  >
                    Book Your Free Consultation
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </Reveal>
        </div>
      </article>
    </>
  );
}
