import { generate } from "./routes/generate.ts";

async function command(args: string[]) {
  if (args[0] === "generate") {
    await generate();
  }
}

await command(Deno.args);
