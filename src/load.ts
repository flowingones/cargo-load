import { Registry } from "./command.ts";

import project from "./project/project.ts";
import routes from "./routes/routes.ts";

const [command, ...args] = Deno.args;

const help = `!---
! Cargo Load is not production ready.
! OPTIONS and COMMANDS might change in a future version.
! Use it with caution!
!---

Cargo Load is a CLI to manage your Cargo applications
 
USAGE:
  load [OPTIONS] [COMMAND]
  
OPTIONS
  -h, --help
  -V, --version

COMMANDS
  project
  routes
`;

const CARGO_LOAD_VERSION = `0.0.2`;

const registry = new Registry();

registry.add({
  names: ["-h", "--help"],
  task: () => {
    return help;
  },
});
registry.add({
  names: ["-V", "--version"],
  task: () => `Cargo Load ${CARGO_LOAD_VERSION}`,
});
registry.add({
  names: ["p", "project"],
  task: project,
});
registry.add({
  names: ["r", "routes"],
  task: routes,
});

const task = registry.find(command);

if (typeof task?.task === "function") {
  const result = await task.task(args);
  console.log(result);
} else {
  console.error(`
Error: "${command || "no arguments"}" is not a valid command.
${help}`);
}
