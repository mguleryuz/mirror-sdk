import { expect, describe, it } from "bun:test";
import ogs from "../src/ogs";

describe("Scrape OG Image From URL", () => {
  it("should scrape the image url and log it", async () => {
    let url =
      "https://mirror.xyz/inverterblog.eth/EMfSfzCCA5X65pKyDP569u8kR7FoaT9pErJxiP4Fg4I";

    const { result } = await ogs({
      url,
      onlyGetOpenGraphInfo: true,
    });

    const imgUrl = result.ogImage?.[0]?.url;

    console.log("OpenGraph image URL:", imgUrl);

    expect(imgUrl).toBeDefined();
  });
});
