import { describe, expect, it } from "vitest";
import { buildAmazonSearchUrl } from "@/lib/amazon";

describe("buildAmazonSearchUrl", () => {
  it("puts color first and appends the clothing section", () => {
    const url = new URL(buildAmazonSearchUrl({ colorName: "Navy", searchTerms: "slim fit wool blazer" }, "men"));
    expect(url.origin + url.pathname).toBe("https://www.amazon.com/s");
    expect(url.searchParams.get("k")).toBe("Navy slim fit wool blazer men's");
  });

  it("uses women's for the women section", () => {
    const url = new URL(buildAmazonSearchUrl({ colorName: "Black", searchTerms: "satin slip dress" }, "women"));
    expect(url.searchParams.get("k")).toBe("Black satin slip dress women's");
  });

  it("encodes spaces, apostrophes and special characters safely", () => {
    const href = buildAmazonSearchUrl({ colorName: " Light wash blue ", searchTerms: "jeans & belt" }, "men");
    expect(href).toBe("https://www.amazon.com/s?k=Light+wash+blue+jeans+%26+belt+men%27s");
  });
});
