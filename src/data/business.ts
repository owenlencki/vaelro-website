// ---------------------------------------------------------------------------
// BUSINESS FACTS
// One source for the name, address, and contact details shown in the footer
// and on the Contact page, and for the structured data in each page's head.
// Search engines cross-check these (NAP: name, address, phone), so they have
// to match everywhere. Edit them here, never inline.
// ---------------------------------------------------------------------------

export interface SocialProfile {
  label: string;
  /** Shown instead of the label where there is room, e.g. "@vaelro.co". */
  handle?: string;
  url: string;
}

export const business = {
  name: "Vaelro LLC",
  brand: "Vaelro",
  url: "https://vaelro.co",
  email: "hello@vaelro.co",
  /**
   * No public number yet. Set it (e.g. "(715) 555-0123") and it shows up in
   * the footer, on Contact as a tap-to-call link, and in the schema.
   */
  phone: undefined as string | undefined,
  address: {
    locality: "Waupaca",
    region: "WI",
    postalCode: "54981",
    country: "US",
  },
  geo: { latitude: 44.355, longitude: -89.0817 },
  social: [
    {
      label: "Instagram",
      handle: "@vaelro.co",
      url: "https://www.instagram.com/vaelro.co/",
    },
    { label: "LinkedIn", url: "https://www.linkedin.com/company/vaelro/" },
    {
      label: "Facebook",
      url: "https://www.facebook.com/profile.php?id=61590139722139",
    },
  ] as SocialProfile[],
  founders: [
    { name: "Owen Lencki", role: "Co-founder" },
    { name: "Liam Bloedow", role: "Co-founder" },
  ],
  /** Towns named on the service pages. Waupaca County and nearby. */
  serviceTowns: [
    "Waupaca",
    "New London",
    "Weyauwega",
    "Clintonville",
    "Manawa",
    "Iola",
    "Scandinavia",
  ],
};

/** The address as it is written everywhere: "Waupaca, WI 54981". */
export const ADDRESS_LINE = `${business.address.locality}, ${business.address.region} ${business.address.postalCode}`;

/** "tel:" href for the phone number, digits only. */
export function telHref(phone: string): string {
  return `tel:+1${phone.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "")}`;
}
