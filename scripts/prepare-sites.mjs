import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const serverDir = path.resolve("dist/server");
await mkdir(serverDir, { recursive: true });

// Sites binds the Vite output as ASSETS. This tiny Worker entrypoint keeps the
// app static and local-first while making the existing build deployable there.
await writeFile(
  path.join(serverDir, "index.js"),
  `export default {
  fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
`,
  "utf8"
);
