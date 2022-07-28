export async function readLine(length: number) {
  if (typeof length !== "number") {
    throw new Error(`Input must be of type "number"`);
  }

  const buf = new Uint8Array(length);
  const byteCount = await Deno.stdin.read(buf);

  if (typeof byteCount !== "number") {
    return "";
  }

  if (exceeding(buf)) {
    throw new Error(
      `Line input is too long. Allowed max. length is ${length} characters`,
    );
  }
  return new TextDecoder().decode(buf.subarray(0, byteCount)).trim();
}

function exceeding(buf: Uint8Array): boolean {
  const maxLength = buf.byteLength - 1;
  return (buf[maxLength] !== 10 && buf[maxLength] !== 0);
}

export async function question(q: string, length = 255): Promise<string> {
  console.log(q);
  return await readLine(length);
}

export async function choose(options: string[]): Promise<string> {
  console.log("---------------");
  options.forEach((option, index) => {
    console.log(`${index} - ${option}`);
  });
  console.log("---------------");
  const input = Number.parseInt(await readLine(255));

  if (Number.isInteger(input) && options[input]) {
    return options[input];
  }

  console.error(`\n"${input}" is not a valid value!\n`);

  return choose(options);
}
