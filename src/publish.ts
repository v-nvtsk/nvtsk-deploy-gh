import { existsSync } from "fs";
import path from "path";
import { run } from "./fs";
import {
  checkout,
  checkoutOrphan,
  commit,
  doesBranchExist,
  getActiveBranch,
  initialCommit,
  moveDirContentToRoot,
  push,
  pushUnverified,
  resetCurrentBranchHard,
  resetHEAD,
  stageDir,
  stashPop,
  stashPush,
} from "./git";
import { printError, printInfo, printSuccessBright } from "./utils";

export type PublishOptions = {
  buildCommand: string;
  buildDir: string;
  branch?: string;
};

export async function publish(options: PublishOptions) {
  const { buildCommand, buildDir, branch = "gh-pages" } = options;

  const activeBranch = await getActiveBranch();
  try {
    if (buildCommand) {
      printInfo(`run build command: ${buildCommand}\n`);
      await run(buildCommand);
    }

    if (!existsSync(path.resolve(process.cwd(), buildDir))) {
      printError(`build dir: "${buildDir}\n" doesn't exists`);
      process.exit(1);
    }

    await stageDir(buildDir);
    await stashPush("--keep-index");

    if (!(await doesBranchExist(branch))) {
      // await run("git checkout --orphan gh-pages");
      await checkoutOrphan(branch);
      // await run("git reset --hard");
      await resetCurrentBranchHard();
      // await run('git commit --allow-empty -m "Initializing gh-pages branch"');
      await initialCommit(branch);
      // await run("git push origin gh-pages --no-verify");
      await pushUnverified(branch);
    } else {
      await checkout(branch);
    }

    await stashPop();

    // await run("git add dist");
    await stageDir(buildDir);

    // await run("git mv -f dist/* .");
    await moveDirContentToRoot(buildDir);
    // await run("git reset HEAD -- dist");
    await resetHEAD(buildDir);

    try {
      await commit(`build: deploy :rocket:`);
      // await run(`git push origin ${branch}`);
      await push(branch);
    } catch (error: any) {
      printError("\nCommit error. May be no changes\n");
      printError(error.message);
    }

    await checkout(activeBranch);
    printSuccessBright(`deployed to ${branch} :rocket:\n`);
  } catch (error: any) {
    printError("\nAn Error occured on publish\n");
    printError(error.message);
  }
}
