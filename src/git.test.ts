import { jest } from "@jest/globals";

describe("git module", () => {
  let fs: { run: any };
  let git: {
    push(branch: string): unknown;
    resetHEAD(arg0: string): unknown;
    resetCurrentBranchHard(): unknown;
    moveDirContentToRoot(arg0: string): unknown;
    pushUnverified(branch: string): unknown;
    initialCommit(branch: string): unknown;
    commit(arg0: string): unknown;
    stageDir(arg0: string): unknown;
    checkoutOrphan(branch: string): unknown;
    checkout(branch: string): unknown;
    stashPop(): unknown;
    stashPush(arg0: string): unknown;
    getActiveBranch(): unknown;
    doesBranchExist: any;
  };
  let utils: {
    printError?: (message: string) => void;
  };

  const branch = "branchName";
  const dirPath = "./path";

  beforeEach(async () => {
    jest.unstable_mockModule("./fs", () => ({
      run: jest.fn(),
    }));
    jest.unstable_mockModule("./utils", () => ({
      printInfo: jest.fn().mockImplementation(() => {}),
      printError: jest.fn().mockImplementation(() => {}),
      printSuccessBright: jest.fn().mockImplementation(() => {}),
    }));

    fs = await import("./fs");
    git = await import("./git");
    utils = await import("./utils");
    jest.spyOn(fs, "run").mockResolvedValue(["not empty", ""]);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe("getActiveBranch", () => {
    it("on success", async () => {
      await git.getActiveBranch();
      expect(fs.run).toHaveBeenCalledWith("git branch --show-current");
    });
    it("on fail", async () => {
      jest.spyOn(fs, "run").mockRejectedValue("error");
      expect.assertions(1);
      try {
        await git.getActiveBranch();
      } catch (error: any) {
        expect(error.message).toMatch("error");
      }
    });
  });

  describe("doesBranchExist", () => {
    it("on success", async () => {
      jest.spyOn(fs, "run").mockResolvedValue([branch, ""]);
      await git.doesBranchExist(branch);
      expect(fs.run).toHaveBeenCalledWith(`git branch -l ${branch}`);
    });
    it("on fail", async () => {
      jest.spyOn(fs, "run").mockRejectedValue("error");
      expect.assertions(1);
      try {
        await git.doesBranchExist(branch);
      } catch (error: any) {
        expect(error.message).toMatch("error");
      }
    });
  });

  describe("stashPush", () => {
    it("on success", async () => {
      await git.stashPush("--keep-index");
      expect(fs.run).toHaveBeenCalledWith("git stash --keep-index");
    });
    it("on fail", async () => {
      jest.spyOn(fs, "run").mockRejectedValue("error");
      expect.assertions(1);
      try {
        await git.stashPush("--keep-index");
      } catch (error: any) {
        expect(error.message).toMatch("error");
      }
    });
  });

  describe("stashPop", () => {
    it("on success", async () => {
      await git.stashPop();
      expect(fs.run).toHaveBeenCalledWith("git stash pop");
    });
    it("on fail", async () => {
      jest.spyOn(fs, "run").mockRejectedValue("error");
      expect.assertions(1);
      try {
        await git.stashPop();
      } catch (error: any) {
        expect(error.message).toMatch("error");
      }
    });
  });

  describe("checkout", () => {
    it("on success", async () => {
      await git.checkout(branch);
      expect(fs.run).toHaveBeenCalledWith(`git checkout ${branch}`);
    });
    it("on fail", async () => {
      jest.spyOn(fs, "run").mockResolvedValueOnce("");
      jest.spyOn(fs, "run").mockRejectedValueOnce("error");
      expect.assertions(1);
      try {
        await git.checkout(branch);
      } catch (error: any) {
        expect(error.message).toMatch("error");
      }
    });
  });

  describe("checkoutOrphan", () => {
    it("on success", async () => {
      await git.checkoutOrphan(branch);
      expect(fs.run).toHaveBeenCalledWith(`git checkout --orphan ${branch}`);
    });
    it("on fail", async () => {
      jest.spyOn(fs, "run").mockRejectedValueOnce("error");
      expect.assertions(1);
      try {
        await git.checkoutOrphan(branch);
      } catch (error: any) {
        expect(error.message).toMatch("error");
      }
    });
  });

  describe("stageDir", () => {
    it("on success", async () => {
      jest.spyOn(fs, "run").mockResolvedValueOnce(["", ""]);
      jest.spyOn(fs, "run").mockResolvedValueOnce(["not empty", ""]);
      await git.stageDir(dirPath);
      expect(fs.run).toHaveBeenCalledWith(`git add ${dirPath}`);
    });
    it("on fail", async () => {
      jest.spyOn(fs, "run").mockResolvedValueOnce(["", ""]);
      jest.spyOn(fs, "run").mockResolvedValueOnce(["", "error"]);
      expect.assertions(1);
      try {
        await git.stageDir(branch);
      } catch (error: any) {
        expect(error.message).toMatch("No staged files");
      }
    });
  });

  describe("commit", () => {
    const commitMsg = "commit message";
    it("on success", async () => {
      await git.commit(commitMsg);
      expect(fs.run).toHaveBeenCalledWith(`git commit -m "${commitMsg}" --no-verify`);
    });
    it("on fail", async () => {
      jest.spyOn(fs, "run").mockRejectedValue("error");
      jest.spyOn(utils, "printError");
      expect.assertions(1);
      try {
        await git.commit(commitMsg);
      } catch (error: any) {
        expect(error.message).toMatch("error");
      }
    });
  });

  describe("initialCommit", () => {
    it("on success", async () => {
      await git.initialCommit(branch);
      expect(fs.run).toHaveBeenCalledWith(`git commit --allow-empty -m "Initializing ${branch} branch"`);
    });
    it("on fail", async () => {
      jest.spyOn(fs, "run").mockRejectedValueOnce("error");
      expect.assertions(1);
      try {
        await git.initialCommit(branch);
      } catch (error: any) {
        expect(error.message).toMatch("error");
      }
    });
  });

  describe("push", () => {
    it("on success", async () => {
      await git.push(branch);
      expect(fs.run).toHaveBeenCalledWith(`git push origin ${branch}`);
    });
    it("on fail", async () => {
      jest.spyOn(fs, "run").mockRejectedValueOnce("error");
      expect.assertions(1);
      try {
        await git.push(branch);
      } catch (error: any) {
        expect(error.message).toMatch("error");
      }
    });
  });

  describe("resetHEAD", () => {
    it("on success", async () => {
      await git.resetHEAD(dirPath);
      expect(fs.run).toHaveBeenCalledWith(`git reset HEAD -- ${dirPath}`);
    });
    it("on fail", async () => {
      jest.spyOn(fs, "run").mockRejectedValueOnce("error");
      expect.assertions(1);
      try {
        await git.resetHEAD(dirPath);
      } catch (error: any) {
        expect(error.message).toMatch("error");
      }
    });
  });

  describe("resetCurrentBranchHard", () => {
    it("on success", async () => {
      await git.resetCurrentBranchHard();
      expect(fs.run).toHaveBeenCalledWith("git reset --hard");
    });
    it("on fail", async () => {
      jest.spyOn(fs, "run").mockRejectedValueOnce("error");
      expect.assertions(1);
      try {
        await git.resetCurrentBranchHard();
      } catch (error: any) {
        expect(error.message).toMatch("error");
      }
    });
  });

  describe("moveDirContentToRoot", () => {
    it("on success", async () => {
      await git.moveDirContentToRoot(dirPath);
      expect(fs.run).toHaveBeenCalledWith(`git mv -f ${dirPath}/* .`);
    });
    it("on fail", async () => {
      jest.spyOn(fs, "run").mockRejectedValueOnce("error");
      expect.assertions(1);
      try {
        await git.moveDirContentToRoot(dirPath);
      } catch (error: any) {
        expect(error.message).toMatch("error");
      }
    });
  });

  describe("pushUnverified", () => {
    it("on success", async () => {
      await git.pushUnverified(branch);
      expect(fs.run).toHaveBeenCalledWith(`git push origin ${branch} --no-verify`);
    });
    it("on fail", async () => {
      jest.spyOn(fs, "run").mockRejectedValueOnce("error");
      expect.assertions(1);
      try {
        await git.pushUnverified(branch);
      } catch (error: any) {
        expect(error.message).toMatch("error");
      }
    });
  });
});
