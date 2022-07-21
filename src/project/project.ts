import { InputLoop } from "../deps.ts";
import { Registry } from "../command.ts";

import basic from "./types/basic.ts";

const registry = new Registry();

registry.add({
  names: ["basic"],
  task: basic,
});

export async function project() {
  await type();
  return "";
}

async function type() {
  const input = new InputLoop();
  console.log("What type of application do you want to create?");
  const choice = await input.choose(registry.all().map((cmd) => cmd.names[0]));
  const selected = choice.findIndex((bool) => {
    return bool;
  });
  if (selected < 0) {
    console.error("Application type not supported!");
  }
  console.log(registry.all()[selected].task());
}
