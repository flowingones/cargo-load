export async function create(path: string, data: string) {
  try {
    if ((await Deno.lstat(path)).isFile) {
      throw new Error(`File "${path}" not created! It already exists.`);
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      await Deno.writeTextFile(path, data);
    } else {
      console.error(err.message);
    }
  }
}
