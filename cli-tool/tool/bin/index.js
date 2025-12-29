#!/usr/bin/env node
import arg from "arg";
import chalk from "chalk";

import { createRequire } from "module";
import { packageUpSync } from "package-up";

const require = createRequire(import.meta.url);

const usage = () => {
  console.log(`${chalk.whiteBright("tool[CMD]")}
        ${chalk.greenBright("--start")}\tStarts the app
        ${chalk.greenBright("--build")}\tBuilds the app`);
};

const main = async () => {
  try {
    const args = arg({ "--start": Boolean, "--build": Boolean });

    if (args["--start"]) {
      const pkg = require(packageUpSync(process.cwd()));
      const toolConfig = pkg.tool;
      if (toolConfig) {
        console.log("FOUND CONFIG OF TOOL::");
        console.log(toolConfig);
      } else {
        console.log(chalk.yellow("NO CONFIG FILE"));
      }
      console.log(chalk.bgCyanBright("Starting the App"));
    }
  } catch (error) {
    console.log(chalk.yellow(error.message));
    console.log();
    usage();
  }
};

main();
