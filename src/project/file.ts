export async function create(path: string, data: string) {
  try {
    const fileinfo = await Deno.lstat(path);
    if (fileinfo.isFile) {
      throw new Error(`File "${path}" already exists.`);
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      await Deno.writeTextFile(path, data);
    }
  }
}
