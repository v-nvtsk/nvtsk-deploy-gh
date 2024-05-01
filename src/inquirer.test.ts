import { jest } from "@jest/globals";
import inquirer from "inquirer";
import { dialog } from "./inquirer";

jest.unstable_mockModule("inquirer", () => ({
  prompt: jest.fn(),
}));

describe("inquierer", () => {
  test("user input", async () => {
    const build = true;
    const expectedResult = {
      buildCommand: "some test build command",
      buildDir: "some test dir",
    };

    jest.spyOn(inquirer, "prompt").mockResolvedValueOnce({ build });
    jest.spyOn(inquirer, "prompt").mockResolvedValueOnce({ buildCommand: expectedResult.buildCommand });
    jest.spyOn(inquirer, "prompt").mockResolvedValueOnce({ buildDir: expectedResult.buildDir });
    expect.assertions(4);

    const result = await dialog();

    expect(inquirer.prompt).toHaveBeenNthCalledWith(1, [
      {
        type: "confirm",
        name: "build",
        message: "Do you want to build project?",
      },
    ]);
    expect(inquirer.prompt).toHaveBeenNthCalledWith(2, [
      {
        type: "input",
        name: "buildCommand",
        message: "Enter build command:\n> ",
      },
    ]);
    expect(inquirer.prompt).toHaveBeenNthCalledWith(3, [
      {
        type: "input",
        name: "buildDir",
        message: "Enter project build directory:\n> ",
      },
    ]);

    expect(result).toEqual(expectedResult);
  });

  test("should handle faults", async () => {
    jest.spyOn(inquirer, "prompt").mockRejectedValueOnce("error");
    expect.assertions(1);
    try {
      await dialog();
    } catch (error: any) {
      expect(error.message).toBe("error");
    }
  });
});
