import cp from "child_process";

export type ExecResult = [string, string];

export function run(command: string): Promise<ExecResult> {
  return new Promise((resolve, reject) => {
    cp.exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(error.message));
      }
      resolve([stdout, stderr]);
    });
  });
}
