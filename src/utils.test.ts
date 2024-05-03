import { jest } from "@jest/globals";
import chalk from "chalk";
import { stderr, stdout } from "process";
import { clearConsole, printError, printHeader, printInfo, printSuccess, printSuccessBright } from "./utils";

describe("console utils", () => {
  let write: ReturnType<typeof jest.fn>;
  chalk.level = 0;
  const testText = "test text";

  beforeEach(() => {
    write = jest.fn();
    stdout.write = write;
  });

  it("should clear console", () => {
    clearConsole();
    expect(write).toHaveBeenCalledWith("\x1Bc");
  });

  it("should write header bold with yellow color", () => {
    printHeader(testText);
    expect(write).toHaveBeenCalledWith(chalk.bold.yellow(testText));
  });

  it("should write info with blue color", () => {
    printInfo(testText);
    expect(write).toHaveBeenCalledWith(chalk.blue(testText));
  });

  it("should write error with red color", () => {
    jest.spyOn(stderr, "write");
    printError(testText);
    expect(stderr.write).toHaveBeenCalledWith(chalk.red(testText));
  });

  it("should write success info with green color", () => {
    printSuccess(testText);
    expect(write).toHaveBeenCalledWith(chalk.green(testText));
  });

  it("should write success info with bright green color", () => {
    printSuccessBright(testText);
    expect(write).toHaveBeenCalledWith(chalk.greenBright(testText));
  });
});
