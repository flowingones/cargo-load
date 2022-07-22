import { Registry } from "./command.ts";
import { project } from "./project/project.ts";
import { generate } from "./routes/generate.ts";

const [command, ...args] = Deno.args;

const help = `
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

const cargo_load_version = `0.0.1`;

const registry = new Registry();

registry.add({
  names: ["-h", "--help"],
  task: () => {
    return help;
  },
});
registry.add({
  names: ["-V", "--version"],
  task: () => `Cargo Load ${cargo_load_version}`,
});
registry.add({
  names: ["p", "project"],
  task: project,
});
registry.add({
  names: ["r", "routes"],
  task: generate,
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
