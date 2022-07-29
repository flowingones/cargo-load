export default async function (): Promise<string> {
  await install();
  return 'Upgrade of "Cargo Load" success successful';
}

async function install(): Promise<void> {
  const cmd = Deno.run({
    cmd: ["deno", "install", "-r", "-f", "-A", "https://cargo.wtf/load"],
  });
  if ((await cmd.status()).success) {
    return;
  }
  throw new Error('Error during installation of "Cargo Load"');
}
