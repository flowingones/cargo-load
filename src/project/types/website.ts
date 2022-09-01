import { join } from "../../deps.ts";
import { create as createFile } from "../file.ts";
import { create as createDir } from "../directory.ts";

const denoConfigContent = `{
  "importMap": "./import_map.json",
  "tasks": {
    "dev": "deno run --allow-all --watch=./pages,./assets,./src app.ts"
  },
}`;

const importMapContent = `{
  "imports": {
    "app/": "./src/",
    "config/": "./config/",
    "cargo/": "https://deno.land/x/cargo@0.1.41/"
  }
}`;

const appTsContent = `import { bootstrap } from "cargo/mod.ts";
import { Get } from "cargo/http/mod.ts";

Get("/", () => {
  return new Response("Hello root!");
});

(await bootstrap()).run();
`;

const cargoConfigContent = `import { autoloadAssets } from "cargo/http/mod.ts";

export default {
  tasks: {
    onBootstrap: [
      autoloadAssets("assets")
    ],
  },
};
`;

export default async (projectName: string) => {
  await createDir(join(projectName, "src"));
  await createDir(join(projectName, "config"));
  await createDir(join(projectName, "assets"));
  await createDir(join(projectName, "pages"));
  await denoConfig(projectName);
  await importMap(projectName);
  await appTs(projectName);
  await cargoConfig(projectName);
  return "Website application created!";
};

async function appTs(projectName: string) {
  await createFile(join(projectName, "app.ts"), appTsContent);
}

async function denoConfig(projectName: string) {
  await createFile(join(projectName, "deno.json"), denoConfigContent);
}

async function importMap(projectName: string) {
  await createFile(join(projectName, "import_map.json"), importMapContent);
}

async function cargoConfig(projectName: string) {
  await createFile(join(projectName, "config", "cargo.ts"), cargoConfigContent);
}
