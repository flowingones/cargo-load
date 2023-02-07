import { join } from "../../deps.ts";
import { create as createFile } from "../file.ts";
import { create as createDir } from "../directory.ts";
import { version } from "../version.ts";

const denoConfigContent = `{
  "importMap": "./import_map.json",
  "tasks": {
    "dev": "deno run --allow-all --watch=./pages,./assets,./src app.ts"
  },
}`;

function importMapContent(cargoVersion: string) {
  return `{
  "imports": {
    "app/": "./src/",
    "config/": "./config/",
    "cargo/": "https://deno.land/x/cargo${cargoVersion}/"
  }
}`;
}

const appTsContent = `import { bootstrap } from "cargo/mod.ts";
import { Get } from "cargo/http/mod.ts";

Get("/", () => {
  return new Response("Hello root!");
});

(await bootstrap()).run();
`;

export default async (projectName: string) => {
  await createDir(join(projectName, "src"));
  await createDir(join(projectName, "config"));
  await denoConfig(projectName);
  await importMap(projectName);
  await appTs(projectName);
  return "Basic application created!";
};

async function appTs(projectName: string) {
  await createFile(join(projectName, "app.ts"), appTsContent);
}

async function denoConfig(projectName: string) {
  await createFile(join(projectName, "deno.json"), denoConfigContent);
}

async function importMap(projectName: string) {
  await createFile(
    join(projectName, "import_map.json"),
    importMapContent(await version("cargo", "0.1.48")),
  );
}
