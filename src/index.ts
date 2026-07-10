import { Command } from "commander";
import { init } from "@/commands/init";
import { add } from "@/commands/add";
import { rm } from "@/commands/rm";
import { mv } from "./commands/mv";

async function main() {
  const program = new Command();

  program
    .name("luxm")
    .description("a modern generator for nextjs projects")
    .version("1.0.0");

  program.addCommand(init).addCommand(add).addCommand(rm).addCommand(mv);

  program.parse();
}

main();
