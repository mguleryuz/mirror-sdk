import { expect, describe, it } from "bun:test";
import wrtieLog from "../../website/tools/utils/writeLog";
import mirror from "../src/mirrorxyz";

describe("Fetch Mirror Publications", () => {
  it("should fetch the post of the transaction", async () => {
    const res = await mirror.publication(
      "0x488fAc2445f84953723eDCC3D31DCBEa63752411"
    );

    wrtieLog({
      content: res,
      label: "Publications",
      format: "json",
    });

    expect(res).toBeDefined();
  });
});
