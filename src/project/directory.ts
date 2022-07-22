export async function create(name: string) {
  try {
    await Deno.mkdir(name);
  } catch (err) {
    if (err instanceof Deno.errors.AlreadyExists) {
      console.error(
        `Directory "${name}" could not be created. It already exists.`,
      );
    } else {
      console.error(
        `Directory "${name}" could not be created. Because of unknown reasons.`,
      );
    }
  }
}
