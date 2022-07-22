import { InputLoop } from "../deps.ts";
import { Registry } from "../command.ts";
import { create as createDir } from "./directory.ts";

import basic from "./types/basic.ts";

const registry = new Registry();

registry.add({
  names: ["basic"],
  task: basic,
});

export default async () => {
  const projectName = await ask("Project name:");

  await createDir(projectName);
  await type(projectName);

  return "";
};

async function ask(question: string): Promise<string> {
  const input = new InputLoop();
  const projectName = await input.question(`${question} `, false);
  if (!projectName) {
    return ask(question);
  }
  return projectName;
}

async function type(projectName: string) {
  const input = new InputLoop();
  console.log("What type of application do you want to create?");
  const choice = await input.choose(registry.all().map((cmd) => cmd.names[0]));

  const selected = choice.findIndex((bool) => {
    return bool;
  });

  if (typeof selected === "undefined" || selected < 0) {
    console.error("Application type not supported!");
    return;
  }

  await registry.all()[selected].task(projectName);
}
