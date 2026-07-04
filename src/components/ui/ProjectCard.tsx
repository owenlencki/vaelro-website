import { motion } from "framer-motion";
import type { Project } from "../../data/projects";
import logoIcon from "../../assets/logos/logo-icon.png";

interface ProjectCardProps {
  project: Project;
  index: number;
}

/**
 * Portfolio card. Featured projects span 2 of 3 grid columns. Cards with no
 * screenshot render a designed placeholder panel instead of an empty image.
 * Cards with a `url` are a single full-card link.
 */
export default function ProjectCard({ project, index }: ProjectCardProps) {
  const Root = project.url ? motion.a : motion.article;
  const linkProps = project.url
    ? {
        href: project.url,
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": `${project.title}: view live site`,
      }
    : {};

  const builtByVaelro = project.category === "Built by Vaelro";
  const inDevelopment = project.metrics?.includes("In development") ?? false;
  const metrics = project.metrics?.filter((m) => m !== "In development") ?? [];

  return (
    <Root
      {...linkProps}
      layout
      initial={{ opacity: 0, scale: 0.95, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 shadow-[0_2px_12px_rgba(26,26,26,0.05)] transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(26,26,26,0.12)] ${
        project.featured ? "md:col-span-2" : ""
      }`}
    >
      {/* Image / designed placeholder */}
      <div
        className={`relative overflow-hidden ${
          project.featured ? "aspect-[16/9]" : "aspect-[16/10]"
        }`}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.title} screenshot`}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-peach-100 via-cream-200 to-orange-100 transition-transform duration-500 ease-out group-hover:scale-105">
            <img
              src={logoIcon}
              alt=""
              className="w-16 opacity-25 md:w-20"
              loading="lazy"
            />
            <span className="absolute bottom-4 left-5 font-mono text-[0.65rem] tracking-[0.18em] text-peach-800/70 uppercase">
              {project.metrics?.[0] ?? project.category}
            </span>
          </div>
        )}

        {/* Hover overlay, only for cards that link somewhere */}
        {project.url && (
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink-900/80 via-ink-900/20 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="font-semibold text-cream-100">
              View live site →
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex grow flex-col p-6 md:p-7">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-0.5 font-mono text-[0.65rem] tracking-[0.12em] uppercase ${
                builtByVaelro
                  ? "bg-ink-900 text-cream-100"
                  : "border border-orange-300 bg-orange-50 text-orange-700"
              }`}
            >
              {project.category}
            </span>
            {inDevelopment && (
              <span className="rounded-full border border-cream-300 bg-cream-100 px-3 py-0.5 font-mono text-[0.65rem] tracking-[0.12em] text-ink-600 uppercase">
                In development
              </span>
            )}
          </div>
          {metrics.length > 0 && (
            <span className="hidden truncate font-mono text-[0.65rem] text-muted sm:block">
              {metrics.join(" · ")}
            </span>
          )}
        </div>

        <h3
          className={`mt-4 font-serif font-bold text-ink-900 ${
            project.featured ? "text-heading" : "text-xl"
          }`}
        >
          {project.title}
        </h3>

        <p className="mt-3 grow leading-relaxed text-ink-600">
          {project.description}
        </p>

        {project.testimonial && (
          <figure className="mt-5 border-t border-cream-300 pt-4">
            <blockquote className="font-serif italic leading-relaxed text-ink-900">
              “{project.testimonial.quote}”
            </blockquote>
            <figcaption className="mt-2 text-sm text-muted">
              {project.testimonial.name}, {project.testimonial.role}
            </figcaption>
          </figure>
        )}

        {project.url && (
          <span className="nav-link mt-5 inline-flex items-center gap-1 self-start font-semibold text-orange-600 group-hover:text-orange-700">
            View live site <span aria-hidden="true">→</span>
          </span>
        )}
      </div>
    </Root>
  );
}
