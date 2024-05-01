import { jest } from "@jest/globals";

describe("publish", () => {
  const testData = {
    buildCommand: "build test command",
    buildDir: "buildDir",
  };

  let git: {
    getActiveBranch: any;
    doesBranchExist: any;
    stashPush: any;
    checkout: any;
    stashPop: any;
    stageDir: any;
    moveDirContentToRoot: any;
    resetHEAD: any;
    commit: any;
    push: any;
    checkoutOrphan: any;
    resetCurrentBranchHard: any;
    initialCommit: any;
    pushUnverified: any;
  };
  let fs: {
    existsSync: any;
  };
  let files: { run: any };
  let utils: {
    printInfo: any;
    printError?: (message: string) => void;
    printSuccess?: (message: string) => void;
  };
  let publish: (options: { buildCommand: string; buildDir: string; branch?: string }) => any;

  beforeEach(async () => {
    jest.unstable_mockModule("fs", () => ({
      existsSync: jest.fn().mockReturnValue(true),
    }));
    jest.unstable_mockModule("./fs", () => ({
      run: jest.fn(),
    }));
    jest.unstable_mockModule("./utils", () => ({
      printInfo: jest.fn(),
      printError: jest.fn(),
      printSuccessBright: jest.fn(),
    }));
    jest.unstable_mockModule("./git", () => ({
      getActiveBranch: jest.fn(),
      checkout: jest.fn(),
      checkoutOrphan: jest.fn(),
      commit: jest.fn(),
      doesBranchExist: jest.fn(),
      initialCommit: jest.fn(),
      moveDirContentToRoot: jest.fn(),
      pushUnverified: jest.fn(),
      resetCurrentBranchHard: jest.fn(),
      resetHEAD: jest.fn(),
      stageDir: jest.fn(),
      stashPop: jest.fn(),
      stashPush: jest.fn(),
      push: jest.fn(),
    }));

    git = await import("./git");
    fs = await import("fs");
    files = await import("./fs");
    utils = await import("./utils");
    const testModule = await import("./publish");
    publish = testModule.publish;

    jest.spyOn(fs, "existsSync").mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("should build if build command presents", async () => {
    jest.spyOn(git, "doesBranchExist").mockResolvedValue(true);

    await publish(testData);

    expect(git.getActiveBranch).toHaveBeenCalled();
    expect(utils.printInfo).toHaveBeenCalledWith(`run build command: ${testData.buildCommand}\n`);
    expect(files.run).toHaveBeenCalledWith(testData.buildCommand);

    expect(git.doesBranchExist).toHaveBeenCalledWith("gh-pages");
    expect(git.stashPush).toHaveBeenCalledWith("--keep-index");
    expect(git.checkout).toHaveBeenCalledWith("gh-pages");
    expect(git.stashPop).toHaveBeenCalled();

    expect(git.stageDir).toHaveBeenCalledWith(testData.buildDir);
    expect(git.moveDirContentToRoot).toHaveBeenCalledWith(testData.buildDir);
    expect(git.resetHEAD).toHaveBeenCalledWith(testData.buildDir);

    expect(git.commit).toHaveBeenCalledWith("build: deploy :rocket:");
    expect(git.push).toHaveBeenCalledWith("gh-pages");
  });

  it("should create deploy branch if not exists", async () => {
    jest.spyOn(git, "doesBranchExist").mockResolvedValue(false);
    const branch = "testBranch";
    await publish({ ...testData, branch });

    expect(git.doesBranchExist).toHaveBeenCalledWith(branch);
    expect(git.checkoutOrphan).toHaveBeenCalledWith(branch);
    expect(git.resetCurrentBranchHard).toHaveBeenCalled();
    expect(git.initialCommit).toHaveBeenCalledWith(branch);
    expect(git.pushUnverified).toHaveBeenCalledWith(branch);
  });

  it("should not build if no build command", async () => {
    await publish({ buildDir: "dir", buildCommand: "" });
    expect(utils.printInfo).not.toHaveBeenCalledWith(expect.stringMatching(/run build command:/));
  });

  it("should break if no git repository", async () => {
    const errorText = "no git repository";
    jest.spyOn(git, "getActiveBranch").mockRejectedValue(errorText);

    expect.assertions(1);
    try {
      await publish(testData);
    } catch (error) {
      expect(error).toMatch(errorText);
    }
  });

  it("should print error on deploy fail", async () => {
    jest.spyOn(git, "stageDir").mockRejectedValue("");
    await publish(testData);
    expect(utils.printError).toHaveBeenCalledWith("\nAn Error occured on publish\n");
  });

  it("should print error on commit fail", async () => {
    jest.spyOn(git, "commit").mockRejectedValue("");
    await publish(testData);
    expect(utils.printError).toHaveBeenCalledWith("\nCommit error. May be no changes\n");
  });

  it("should break if directory does not exist", async () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(false);
    jest.spyOn(process, "exit").mockReturnValue({} as never);
    await publish(testData);
    expect(utils.printError).toHaveBeenCalledWith(`build dir: "${testData.buildDir}\n" doesn't exists`);
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
