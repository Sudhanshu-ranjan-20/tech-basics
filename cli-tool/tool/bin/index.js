#!/usr/bin/env node
import arg from "arg";
import chalk from "chalk";

import { getConfig } from "../src/config/config-mgr.js";
import { start } from "../src/commands/start.js";

const usage = () => {
  console.log(`${chalk.whiteBright("tool[CMD]")}
        ${chalk.greenBright("--start")}\tStarts the app
        ${chalk.greenBright("--build")}\tBuilds the app`);
};

const main = async () => {
  try {
    const args = arg({ "--start": Boolean, "--build": Boolean });
    // if (!args.length) throw new Error("Use following attributes");
    if (args["--start"]) {
      const config = getConfig();
      start(config);
    }
  } catch (error) {
    console.log(chalk.yellow(error.message));
    console.log();
    usage();
  }
};

main();
