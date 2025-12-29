import chalk from "chalk";

const start = (config) => {
  console.log(chalk.bgCyanBright("Starting the App"));
  console.log(chalk.gray("Recieved Configuration - "), config);
};

export { start };
