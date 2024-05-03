import { describe, expect, it } from "@jest/globals";
import { run } from "./fs";

describe("fs", () => {
  it("exec", async () => {
    const result = (await run("pwd"))[0].trim();
    expect(result === process.cwd()).toBeTruthy();
  });

  it("exec with error", async () => {
    await expect(run("some_command")).rejects.toThrowError();
  });
});
