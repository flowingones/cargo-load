import { create as createFile } from "../file.ts";

const denoConfigContent = `{
  "importMap": "./import_map.json",
  "tasks": {
    "dev": "deno run --allow-all --watch=./pages,./assets,./src app.ts"
  },
}`

const importMapContent = `{
  "imports": {
    "app/": "./src/",
    "config/": "./config/",
    "cargo/": "https://deno.land/x/cargo@0.1.41/",
  }
}`

export default async () =>  {
  await denoConfig();
  await importMap();
  return "Basic application created!"
}

async function denoConfig(){
  await createFile("deno.json",denoConfigContent);
}

async function importMap(){
  await createFile("import_map.json",importMapContent);
}