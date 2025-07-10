import { build } from "esbuild";
import process from "process";

try {
  await build({
    entryPoints: ["server/server.jsx"],
    bundle: true,
    platform: "node",
    target: "node16",
    outfile: "build/server.cjs",
    external: ["express"],
    loader: { ".jsx": "jsx" },
  });
} catch (err) {
  console.error(err);
  process.exit(1);
}
