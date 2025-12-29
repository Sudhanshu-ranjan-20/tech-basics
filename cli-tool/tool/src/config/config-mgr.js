import chalk from "chalk";
import { cosmiconfigSync } from "cosmiconfig";

export const getConfig = () => {
  const explorer = cosmiconfigSync("tool");
  const res = explorer.search(process.cwd());
  if (!res) {
    console.log(chalk.yellow("No config found!! [Using default Config]"));
    return { port: 1234 };
  }
  console.log("FOUND CONFIG", res.config);
  return res.config;
};
