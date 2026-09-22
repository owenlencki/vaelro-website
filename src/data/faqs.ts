// ---------------------------------------------------------------------------
// CONTACT PAGE FAQ
// Shown on /contact and published as that page's FAQPage structured data, so
// the visible answers and the schema can never disagree. Plain data only.
// ---------------------------------------------------------------------------

export interface FaqItem {
  question: string;
  answer: string;
}

export const contactFaqs: FaqItem[] = [
  {
    question: "How much does a website cost?",
    answer:
      "Our websites start at $500 for a fast, professional static site and go up from there based on what you need. Every project gets a flat-rate quote with the math shown upfront.",
  },
  {
    question: "How long does it take?",
    answer:
      "Most business websites are delivered in 1-2 weeks. We move fast because we build smart.",
  },
  {
    question: "Do I own my website?",
    answer:
      "Yes. You own the domain, the hosting, the code, the CMS, and the analytics. Admin access from day one. If you ever leave, everything goes with you.",
  },
  {
    question: "What if I already have a website?",
    answer:
      "We can redesign it or improve what you have. Book a free consultation and we'll take a look together.",
  },
];
