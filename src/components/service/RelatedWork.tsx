import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";
import { withBase } from "../../lib/paths";
import { getProject, type Project } from "../../data/projects";

interface RelatedWorkProps {
  eyebrow: string;
  title: string;
  /** Case studies to show, in order. Unfeatured slugs are skipped. */
  slugs: string[];
  /** Show this project's client quote under the cards. */
  quoteFrom?: string;
  /** Anchor for in-page links, e.g. the page header's "see our work". */
  id?: string;
}

/** A few case studies from src/data/projects.ts, each linking to its page. */
export default function RelatedWork({
  eyebrow,
  title,
  slugs,
  quoteFrom,
  id,
}: RelatedWorkProps) {
  const items = slugs
    .map(getProject)
    .filter((p): p is Project & { images: NonNullable<Project["images"]> } =>
      Boolean(p?.featured && p.images),
    );
  const quoted = quoteFrom ? getProject(quoteFrom) : undefined;

  return (
    <section
      id={id}
      className="scroll-mt-24 bg-cream-100 py-12 md:py-24"
      aria-label={eyebrow}
    >
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <SectionHeading eyebrow={eyebrow} title={title} />
          <Link
            to="/#work"
            className="nav-link inline-flex min-h-11 items-center gap-1 font-semibold text-orange-600 hover:text-orange-700"
          >
            See all our work <span aria-hidden="true">→</span>
          </Link>
        </div>

        <ul
          className={`mt-12 grid gap-6 md:mt-16 ${
            items.length === 2 ? "md:grid-cols-2 md:gap-8" : "sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {items.map((project, i) => (
            <li key={project.slug}>
              <Reveal delay={i * 0.08} className="h-full">
                <Link
                  to={`/work/${project.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 shadow-[0_4px_20px_rgba(26,26,26,0.06)] transition-shadow duration-200 hover:shadow-[0_16px_40px_rgba(26,26,26,0.12)]"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-peach-100">
                    <img
                      src={withBase(project.images.hero)}
                      alt={project.images.alt}
                      width={1600}
                      height={1000}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex grow flex-col p-6 md:p-7">
                    <p className="font-mono text-[0.65rem] tracking-[0.18em] text-muted uppercase">
                      {project.category}
                      {project.location ? ` · ${project.location}` : ""}
                    </p>
                    <h3 className="mt-2 font-serif text-xl font-bold text-ink-900 transition-colors duration-200 group-hover:text-orange-600">
                      {project.name}
                    </h3>
                    <p className="mt-2 grow text-[0.95rem] leading-relaxed text-ink-600">
                      {project.tagline}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-orange-600">
                      Read the case study <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        {quoted?.testimonial && (
          <Reveal>
            <figure className="mx-auto mt-16 max-w-3xl text-center md:mt-20">
              <blockquote className="font-serif text-heading leading-snug text-ink-900 italic">
                “{quoted.testimonial.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm text-muted">
                {quoted.testimonial.name}, {quoted.testimonial.role}
              </figcaption>
            </figure>
          </Reveal>
        )}
      </div>
    </section>
  );
}
