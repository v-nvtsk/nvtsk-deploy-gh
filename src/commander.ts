import { program } from "commander";
import { stderr } from "process";
import { PublishOptions } from "./publish";

export async function parseArgs(args: string[]): Promise<PublishOptions | undefined> {
  try {
    const result = {
      buildCommand: "",
      buildDir: "",
      branch: "gh-pages",
    };

    program
      .option("--build <buildCommand>", "build project")
      .option("--dir <buildDir>", "project build directory")
      .option("--git-branch <branch>", "branch name");

    await program.parseAsync(args);

    const options = program.opts();
    if (options.build) result.buildCommand = options.build;
    if (options.dir) result.buildDir = options.dir;
    if (options.branch) result.branch = options.branch;

    return result;
  } catch (e: any) {
    stderr.write(e.message);
    throw new Error(e.message);
  }
}
