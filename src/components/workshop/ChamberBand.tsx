import Reveal from "../ui/Reveal";
import { workshop } from "../../data/workshop";
import { withBase } from "../../lib/paths";

/**
 * A quiet attribution band. The logo slot stays empty until partnerLogo is set
 * in the data file, which is Owen's call once the Chamber confirms
 * co-branding; the asset is already committed at /workshop/chamber-logo.webp.
 */
export default function ChamberBand() {
  // The band's sentence lives in the data file; the Chamber's name inside it
  // becomes the link, so the copy stays in one place.
  const [before, after] = workshop.chamberBand.text.split(workshop.partner);

  return (
    <section
      className="border-y border-cream-300 bg-cream-50 py-10 md:py-12"
      aria-label="Presented with the Chamber"
    >
      <div className="container-site">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl text-lead text-ink-900">
              {before}
              <a
                href={workshop.partnerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link font-semibold text-orange-600 hover:text-orange-700"
              >
                {workshop.partner}
              </a>
              {after}
            </p>

            {workshop.partnerLogo && (
              <img
                src={withBase(workshop.partnerLogo)}
                alt={workshop.partner}
                loading="lazy"
                decoding="async"
                className="h-14 w-auto shrink-0"
              />
            )}
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">
            {workshop.chamberBand.smallText}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
