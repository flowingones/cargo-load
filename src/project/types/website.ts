import { join } from "../../deps.ts";
import { create as createFile } from "../file.ts";
import { create as createDir } from "../directory.ts";
import { version } from "../version.ts";

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

function importMapContent(cargoVersion: string, parcelVersion: string) {
  return `{
  "imports": {
    "app/": "./src/",
    "config/": "./config/",
    "cargo/": "https://deno.land/x/cargo@${cargoVersion}/",
    "parcel/": "https://deno.land/x/cargo_parcel@${parcelVersion}/"
  }
}`;
}

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

const cargoConfigContent = `import { Assets } from "cargo/http/tasks/mod.ts";
import { Parcel } from "parcel/cargo/tasks/mod.ts";
import pages from "../.manifest/.pages.ts";
import islands from "../.manifest/.islands.ts";

export default {
  tasks: {
    onBootstrap: [
      Assets("assets"),
      await Parcel({
        pages,
        islands,
      }),
    ],
  },
};
`;

function loadConfigContent(parcelVersion: string) {
  return `import { pages } from "https://deno.land/x/cargo_parcel@${parcelVersion}/cargo/commands/pages.ts";
import { islands } from "https://deno.land/x/cargo_parcel@${parcelVersion}/cargo/commands/islands.ts";

export default [pages(), islands()];
`;
}

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
  await createFile(join(projectName, "pages", "page.tsx"), indexPageContent);
}

async function denoConfig(projectName: string) {
  await createFile(join(projectName, "deno.json"), denoConfigContent);
}

async function importMap(projectName: string) {
  await createFile(
    join(projectName, "import_map.json"),
    importMapContent(
      ...await Promise.all([
        await version("cargo", "0.1.48"),
        await version("cargo_parcel", "0.1.70"),
      ]),
    ),
  );
}

async function cargoConfig(projectName: string) {
  await createFile(join(projectName, "config", "cargo.ts"), cargoConfigContent);
}

async function loadConfig(projectName: string) {
  await createFile(
    join(projectName, "config", "load.ts"),
    loadConfigContent(await version("cargo_parcel", "0.1.70")),
  );
}
