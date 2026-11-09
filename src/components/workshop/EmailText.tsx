import { Fragment } from "react";
import { business } from "../../data/business";

interface EmailTextProps {
  /** Copy from a data file, written with the address in it, like "Email us at hello@vaelro.co." */
  text: string;
  /** Classes for the link. */
  className: string;
}

/**
 * A line of copy with the business email address turned into a mailto link
 * wherever it appears, so the copy stays word for word in the data file.
 */
export default function EmailText({ text, className }: EmailTextProps) {
  const parts = text.split(business.email);
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <a href={`mailto:${business.email}`} className={className}>
              {business.email}
            </a>
          )}
          {part}
        </Fragment>
      ))}
    </>
  );
}
