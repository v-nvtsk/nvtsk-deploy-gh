import chalk from "chalk";
import { stderr, stdout } from "process";

export function clearConsole() {
  stdout.write("\x1Bc");
}
export function printHeader(message: string) {
  stdout.write(chalk.bold.yellow(message));
}

export function printError(message: string) {
  stderr.write(chalk.red(message));
}

export function printInfo(message: string) {
  stdout.write(chalk.blue(message));
}

export function printSuccess(message: string) {
  stdout.write(chalk.green(message));
}

export function printSuccessBright(message: string) {
  stdout.write(chalk.greenBright(message));
}
