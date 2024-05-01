import inquirer from "inquirer";
import { stderr } from "process";
import { PublishOptions } from "./publish";

async function askBuild(): Promise<boolean> {
  return (
    await inquirer.prompt([
      {
        type: "confirm",
        name: "build",
        message: "Do you want to build project?",
      },
    ])
  ).build;
}

async function askBuildCommand(): Promise<string> {
  return (
    await inquirer.prompt([
      {
        type: "input",
        name: "buildCommand",
        message: "Enter build command:\n> ",
      },
    ])
  ).buildCommand.trim();
}

async function askBuildDir(): Promise<string> {
  return (
    await inquirer.prompt([
      {
        type: "input",
        name: "buildDir",
        message: "Enter project build directory:\n> ",
      },
    ])
  ).buildDir.trim();
}

export async function dialog(): Promise<PublishOptions | undefined> {
  try {
    const options: PublishOptions = {
      buildCommand: "",
      buildDir: "",
    };
    if (await askBuild()) options.buildCommand = await askBuildCommand();

    options.buildDir = await askBuildDir();

    return options;
  } catch (e: any) {
    stderr.write(e);
    throw new Error(e);
  }
}
