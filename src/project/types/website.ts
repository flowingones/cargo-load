import { join } from "../../deps.ts";
import { create as createFile } from "../file.ts";
import { create as createDir } from "../directory.ts";

const denoConfigContent = `{
  "compilerOptions": {
    "jsxFactory": "tag",
    "lib": [
      "dom",
      "dom.iterable",
      "dom.asynciterable",
      "deno.ns"
    ]
  },
  "importMap": "./import_map.json",
  "tasks": {
    "dev": "load pages && load islands && deno run --allow-all --watch=./pages,./assets,./src app.ts"
  },
}`;

const importMapContent = `{
  "imports": {
    "app/": "./src/",
    "config/": "./config/",
    "cargo/": "https://deno.land/x/cargo@0.1.43/",
    "parcel/": "https://deno.land/x/cargo_parcel@0.1.49/"
  }
}`;

const appTsContent = `import { bootstrap } from "cargo/mod.ts";
import cargoConfig from "config/cargo.ts";

const app = (await bootstrap(cargoConfig))

app.run();
`;

const indexPageContent = `import { tag } from "parcel/mod.ts";

export default () => {
  return <h1>Hello World!</h1>;
};
`;

const cargoConfigContent = `import { autoloadAssets } from "cargo/http/mod.ts";
import { autoloadPages } from "parcel/cargo/tasks/autoload.ts";
import { pages } from "../.manifest/.pages.ts";
import islands from "../.manifest/.islands.ts";

export default {
  tasks: {
    onBootstrap: [
      autoloadAssets("assets"),
      autoloadPages({
        pages,
        islands,
      }),
    ],
  },
};
`;

const loadConfigContent =
  `import { pages } from "https://deno.land/x/cargo_parcel@0.1.49/cargo/commands/pages.ts";
import { islands } from "https://deno.land/x/cargo_parcel@0.1.49/cargo/commands/islands.ts";

export default [pages(), islands()];
`;

export default async (projectName: string) => {
  await createDir(join(projectName, "src"));
  await createDir(join(projectName, "config"));
  await createDir(join(projectName, "assets"));
  await createDir(join(projectName, "pages"));
  await denoConfig(projectName);
  await importMap(projectName);
  await appTs(projectName);
  await indexPage(projectName);
  await cargoConfig(projectName);
  await loadConfig(projectName);
  return "Website application created!";
};

async function appTs(projectName: string) {
  await createFile(join(projectName, "app.ts"), appTsContent);
}

async function indexPage(projectName: string) {
  await createFile(join(projectName, "pages", "index.tsx"), indexPageContent);
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

async function loadConfig(projectName: string) {
  await createFile(join(projectName, "config", "load.ts"), loadConfigContent);
}
