import { ExecResult, run } from "./fs";
import { printError, printInfo } from "./utils";

export async function getActiveBranch() {
  try {
    const result = await run("git branch --show-current");
    return result[0].trim();
  } catch (e: any) {
    printError(e.message);
    throw new Error(e);
  }
}

export async function doesBranchExist(branch: string) {
  try {
    const result = await run(`git branch -l ${branch}`);
    return result[0].trim() !== "";
  } catch (e: any) {
    printError(e.message);
    throw new Error(e);
  }
}

async function stash(pop: boolean, args?: string) {
  try {
    let command = pop ? "git stash pop" : "git stash";
    if (args) command += ` ${args}`;
    return await run(command);
  } catch (e: any) {
    printError(e.message);
    throw new Error(e);
  }
}

export const stashPush = (args?: string) => stash(false, args);
export const stashPop = () => stash(true);

export async function checkout(branch: string) {
  printInfo(`\nset active branch to: "${branch}"\n`);

  try {
    run("rm -f ./.git/index.lock");

    return await run(`git checkout ${branch}`);
  } catch (e: any) {
    printError(e.message);
    throw new Error(e);
  }
}

export async function checkoutOrphan(branch: string) {
  try {
    const result = await run(`git checkout --orphan ${branch}`);
    return result;
  } catch (e: any) {
    printError(e.message);
    throw new Error(e);
  }
}

export async function stageDir(path: string) {
  printInfo(`\nstage files from dir: ${path}\n`);

  try {
    await run(`git add ${path}`);
    const result: ExecResult = await run("git status --porcelain --untracked-files=no");
    if (result[0] === "") throw new Error(result[1] as string);
  } catch (e: any) {
    printError(e.message);
    throw new Error("No staged files");
  }
}

export async function commit(message: string): Promise<ExecResult> {
  printInfo(`\ncommit changes to branch: ${await getActiveBranch()}\n`);

  try {
    const result: ExecResult = await run(`git commit -m "${message.replace(/"/g, '\\"')}" --no-verify`);
    return result;
  } catch (e: any) {
    printError(e.message);
    throw new Error(e.message);
  }
}

export async function initialCommit(branch: String) {
  try {
    await run(`git commit --allow-empty -m "Initializing ${branch} branch"`);
  } catch (e: any) {
    printError(e.message);
    throw new Error(e);
  }
}

export async function push(branch: string) {
  try {
    await run(`git push origin ${branch}`);
  } catch (e: any) {
    printError(e.message);
    throw new Error(e);
  }
}

export async function resetCurrentBranchHard() {
  try {
    await run("git reset --hard");
  } catch (e: any) {
    printError(e.message);
    throw new Error(e);
  }
}

export async function pushUnverified(branch: string) {
  try {
    await run(`git push origin ${branch} --no-verify`);
  } catch (e: any) {
    printError(e.message);
    throw new Error(e);
  }
}

export async function moveDirContentToRoot(dir: string) {
  try {
    await run(`git mv -f ${dir}/* .`);
  } catch (e: any) {
    printError(e.message);
    throw new Error(e);
  }
}

export async function resetHEAD(dir: string) {
  try {
    await run(`git reset HEAD -- ${dir}`);
  } catch (e: any) {
    printError(e.message);
    throw new Error(e);
  }
}
