import ogs, { SuccessResult } from "../ogs";
import { MirrorPost, FormattedMirrorPost } from "./types";
import slug from "slug";

// Formats a single Mirror post entry
export default async function ({
  entry,
  transactionId,
  timestamp,
  publicationAddress,
  calledFrom,
}: {
  entry: MirrorPost; // The raw entry data
  transactionId: string; // Transaction ID of the entry
  timestamp: number; // Timestamp of the entry
  publicationAddress: string; // Base URL of the Mirror instance
  calledFrom: "server" | "client";
}): Promise<FormattedMirrorPost> {
  let cover_image = null;
  let oGData: SuccessResult["result"] | null = null;

  const url = `https://mirror.xyz/${publicationAddress}/` + transactionId;

  try {
    if (calledFrom === "client") {
      const res = await fetch(`/api/scrape/open-graph/?url=${url}`),
        json = <SuccessResult["result"]>await res.json();
      cover_image = json.ogImage?.[0].url || null;
      oGData = json;
    }

    if (calledFrom === "server") {
      const { result } = await ogs({ url });
      cover_image = result.ogImage?.[0].url || null;
      oGData = result;
    }
  } catch {
    cover_image = null;
  }

  if (!cover_image)
    entry.content.body
      .split("\n\n")[0]
      .match(/!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/m)?.[1] || null;

  return {
    title: entry.content.title, // Title of the entry
    slug: slug(entry.content.title), // URL slug generated from the title
    body: entry.content.body, // Body content of the entry
    timestamp, // Timestamp of the entry
    digest: entry.originalDigest ?? entry.digest, // Digest of the entry, preferring the original if available
    contributor: entry.authorship.contributor, // Contributor of the entry
    transaction: transactionId, // Transaction ID of the entry
    cover_image, // Extract the first image from the body as the cover image
    oGData,
    // image_sizes: omitted for brevity but would involve calculating sizes for responsive loading
  };
}
