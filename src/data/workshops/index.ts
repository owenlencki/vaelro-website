// ---------------------------------------------------------------------------
// WHICH SERIES IS CURRENT
// /workshop leads with currentSeries, the Home pill and the nav dot follow its
// dates, and scripts/test-workshop.ts checks it. pastSeries are the cards in
// "Past workshops" on /workshop, newest first; each links to its own archive
// page.
//
// When the next series is announced: give it a file shaped like
// marshfield.ts, point currentSeries at it, give Marshfield an archive page
// of its own (like /workshop/waupaca), and add it to the front of pastSeries.
// ---------------------------------------------------------------------------

import { marshfield } from "./marshfield";
import { waupaca } from "./waupaca";

export const currentSeries = marshfield;

export type CurrentSeries = typeof currentSeries;

/** Finished series, newest first. */
export const pastSeries = [waupaca];
