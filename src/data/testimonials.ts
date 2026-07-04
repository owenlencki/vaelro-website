// ---------------------------------------------------------------------------
// TESTIMONIAL DATA: placeholder content for now.
// Drop real client quotes in here as they come in; the section renders
// whatever is in this array with zero design changes. Replace `name` with the
// real person's name and `business` with their business name.
// ---------------------------------------------------------------------------

export interface Testimonial {
  quote: string;
  name: string;
  business: string;
  /** 1–5. Omit to hide the stars on a card. */
  rating?: number;
}

/** Set to false once real reviews are in to hide the placeholder footnote. */
export const testimonialsArePlaceholders = true;

export const testimonials: Testimonial[] = [
  {
    quote:
      "They rebuilt our whole web presence and set up systems we didn't know were possible. Everything just works now, and when we need something, they answer.",
    name: "Client Name",
    business: "Local Business · Waupaca, WI",
    rating: 5,
  },
  {
    quote:
      "The automation they built handles what used to take our office hours every week. It paid for itself in the first month.",
    name: "Client Name",
    business: "Advisory Firm · Wisconsin",
    rating: 5,
  },
  {
    quote:
      "Fast, straightforward, and local. They explained everything in plain English and delivered exactly what they said they would.",
    name: "Client Name",
    business: "Event Organizer · Waupaca, WI",
    rating: 5,
  },
];
