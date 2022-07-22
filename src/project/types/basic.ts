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

export default async (projectName: string) => {
  await createDir(`${projectName}/src`);
  await createDir(`${projectName}/config`);
  await denoConfig(projectName);
  await importMap(projectName);
  await appTs(projectName);
  return "Basic application created!";
};

async function appTs(projectName: string) {
  await createFile(`${projectName}/app.ts`, appTsContent);
}

async function denoConfig(projectName: string) {
  await createFile(`${projectName}/deno.json`, denoConfigContent);
}

async function importMap(projectName: string) {
  await createFile(`${projectName}/import_map.json`, importMapContent);
}
