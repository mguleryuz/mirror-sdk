import { expect, describe, it } from "bun:test";
import wrtieLog from "../../website/tools/utils/writeLog";
import mirror from "../src/mirrorxyz";

const publicationAddress = "0x488fAc2445f84953723eDCC3D31DCBEa63752411";

describe("Fetch Mirror Posts", () => {
  it(
    "should fetch multiple posts from a given address",
    async () => {
      const res = await mirror.posts(publicationAddress, "server");
      wrtieLog({
        content: res,
        label: "Entries",
        format: "json",
      });

      expect(res.length).toBeGreaterThanOrEqual(1);
    },
    {
      timeout: 20_000,
    }
  );

  it("should fetch a single post by its content digest", async () => {
    const res = await mirror.post(
      "EMfSfzCCA5X65pKyDP569u8kR7FoaT9pErJxiP4Fg4I",
      publicationAddress,
      "server"
    );

    wrtieLog({
      content: res,
      label: "Entry",
      format: "json",
    });

    expect(res).toBeDefined();
  });
});
