import { argv } from "process";
import { parseArgs } from "./commander";
import { dialog } from "./inquirer";
import { publish } from "./publish";
import { clearConsole, printError, printHeader, printSuccessBright } from "./utils";

async function main() {
  const result = argv.length > 2 ? await parseArgs(process.argv) : await dialog();

  if (!result || result.buildDir === "") {
    printError("Aborted - not enough arguments\n");
    process.exit(0);
  }

  try {
    await publish(result);
    printSuccessBright("finished successfully\n");
  } catch (e: any) {
    printError(e.message);
    printError("finished with error\n");
    process.exit(1);
  }
}

clearConsole();
printHeader("Github-pages deploy\n");

await main();
