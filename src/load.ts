import { join } from "./deps.ts";

import { Command, Registry } from "./command.ts";

import project from "./project/project.ts";
import upgrade from "./upgrade/upgrade.ts";

const [command, ...args] = Deno.args;

const CARGO_LOAD_VERSION = `0.0.5`;

const registry = new Registry();

const defaultArguments: Command[] = [{
  names: ["u", "upgrade"],
  description: `Upgrade "Cargo Load" executable to the lastest version`,
  task: upgrade,
}, {
  names: ["-V", "--version"],
  description: 'Show current version of "Cargo Load"',
  task: () => `Cargo Load ${CARGO_LOAD_VERSION}`,
}, {
  names: ["-h", "--help"],
  description: "Show help",
  task: help,
}];

const defaultCommands: Command[] = [{
  names: ["p", "project"],
  description: "Create a new project structure",
  task: project,
}];

await autoloadCommands(join("config", "load.ts"));

const task = registry.find(command);

if (typeof task?.task === "function") {
  const result = await task.task(args);
  console.log(result);
} else {
  console.error(`
Error: "${command || "no arguments"}" is not a valid command.
${help()}`);
}

function help() {
  return `!---
! "Cargo Load" is not production ready.
! OPTIONS and COMMANDS might change in a future version.
! Use it with caution!
!---

"Cargo Load" is a CLI to manage your "Cargo" applications
 
USAGE:
  load [OPTIONS] [COMMAND]
  
OPTIONS
  -h, --help
  -V, --version

COMMANDS
${
    registry.all().map((command) => {
      return `  ${
        expand(command.names.join(", "), 20)
      } <— ${command.description}\n`;
    }).join("")
  }`;
}

function expand(value: string, length: number) {
  const chars = [...value];
  const difference = length - chars.length - 1;

  for (let i = 0; i < difference; i++) {
    chars.push(" ");
  }

  return chars.join("");
}

async function autoloadCommands(path: string) {
  let commands: Command[] = [];
  try {
    const config = await import(path);
    if (Array.isArray(config.default)) {
      commands = config.default;
      console.log(`Configuration loaded from ${path}`);
    }
  } catch (_e) {
  } finally {
    commands = [...defaultCommands, ...commands, ...defaultArguments];

    commands.forEach((command) => {
      registry.add(command);
    });
  }
}
