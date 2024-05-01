import { parseArgs } from "./commander";

describe("commander", () => {
  it("should parse args array", async () => {
    const result = await parseArgs([
      "runtime",
      "script name",
      "--build",
      "npm run build",
      "--dir",
      "dist",
      "--git-branch",
      "gh-pages",
    ]);
    expect(result).not.toBeNull();
    expect(result!.buildCommand).toBe("npm run build");
    expect(result!.buildDir).toBe("dist");
    expect(result!.branch).toBe("gh-pages");
  });
});
