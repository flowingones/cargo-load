import { join } from "../../deps.ts";
import { create as createFile } from "../file.ts";
import { create as createDir } from "../directory.ts";
import { version } from "../version.ts";

const denoConfigContent = `{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "parcel",
    "lib": [
      "dom",
      "dom.iterable",
      "dom.asynciterable",
      "deno.ns"
    ]
  },
  "importMap": "./import_map.json",
  "tasks": {
    "dev": "deno run --allow-all --watch dev.ts",
    "debug": "deno run --inspect-brk --allow-all dev.ts"
  },
}`;

function importMapContent(
  cargoVersion: string,
  parcelVersion: string,
  stdLibVersion: string,
) {
  return `{
  "imports": {
    "app/": "./src/",
    "config/": "./config/",
    "cargo/": "https://deno.land/x/cargo@${cargoVersion}/",
    "parcel/": "https://deno.land/x/cargo_parcel@${parcelVersion}/",
    "parcel/jsx-runtime": "https://deno.land/x/cargo_parcel@${parcelVersion}/jsx-runtime.ts",
    "inspect/": "https://deno.land/x/cargo_inspect@${cargoVersion}/",
    "std/": "https://deno.land/std@${stdLibVersion}/"
  }
}`;
}

const appTsContent = `import { bootstrap } from "cargo/mod.ts";
import cargoConfig from "config/cargo.ts";

const app = (await bootstrap(cargoConfig))

app.run();
`;

const devTsContent = `import { bootstrap } from "cargo/mod.ts";
import cargoDevConfig from "config/cargo.dev.ts";

const app = (await bootstrap(cargoDevConfig))

app.run();
`;

const indexPageContent = `export default () => {
  return <h1>Hello World!</h1>;
};
`;

const cargoConfigContent = `import { Assets } from "cargo/http/tasks/mod.ts";
import { Parcel } from "parcel/cargo/tasks/mod.ts";
import parcelConfig from "config/parcel.ts";
import pages from "../.manifest/.pages.ts";
import islands from "../.manifest/.islands.ts";

export default {
  tasks: {
    onBootstrap: [
      Assets("assets"),
      await Parcel({
        pages,
        islands,
        ...parcelConfig
      }),
    ],
  },
};
`;

const cargoDevConfigContent = `import { Assets } from "cargo/http/tasks/mod.ts";
import { Parcel, Manifest } from "parcel/cargo/tasks/mod.ts";
import parcelConfig from "config/parcel.ts";

export default {
  tasks: {
    onBootstrap: [
      Assets("assets"),
      await Manifest(),
      await Parcel(parcelConfig),
    ],
  },
};
`;

const parcelConfigContent = `export default {};
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
  await parcelConfig(projectName);
  return "Website application created!";
};

async function appTs(projectName: string) {
  await createFile(join(projectName, "app.ts"), appTsContent);
  await createFile(join(projectName, "dev.ts"), devTsContent);
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
        await version("cargo", "0.1.63"),
        await version("cargo_parcel", "0.2.9"),
        await version("std", "0.204.0"),
      ]),
    ),
  );
}

async function cargoConfig(projectName: string) {
  await createFile(join(projectName, "config", "cargo.ts"), cargoConfigContent);
  await createFile(
    join(projectName, "config", "cargo.dev.ts"),
    cargoDevConfigContent,
  );
}

async function parcelConfig(projectName: string) {
  await createFile(
    join(projectName, "config", "parcel.ts"),
    parcelConfigContent,
  );
}
