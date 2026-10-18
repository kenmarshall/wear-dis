import type { Gender, Piece } from "./schemas";

const AMAZON_SEARCH_URL = "https://www.amazon.com/s";

const SECTION_TERMS: Record<Gender, string> = {
  men: "men's",
  women: "women's",
};

/** Amazon search link for a piece: "{color} {search terms} {men's|women's}". */
export function buildAmazonSearchUrl(
  piece: Pick<Piece, "colorName" | "searchTerms">,
  gender: Gender,
): string {
  const query = [piece.colorName, piece.searchTerms, SECTION_TERMS[gender]]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");
  const url = new URL(AMAZON_SEARCH_URL);
  url.searchParams.set("k", query);
  return url.toString();
}
