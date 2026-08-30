import fs from "node:fs";
import path from "node:path";

const outputRoot = path.resolve("dist/public");
const assetPrefix = "/math4fun-local";

function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(filePath);
    else if (/\.(css|html|js|json)$/.test(entry.name)) {
      const source = fs.readFileSync(filePath, "utf8");
      const updated = source.replace(/(["'(])\/(media|guardians)\//g, `$1${assetPrefix}/$2/`);
      if (updated !== source) fs.writeFileSync(filePath, updated);
    }
  }
}

visit(outputRoot);
fs.copyFileSync(path.join(outputRoot, "index.html"), path.join(outputRoot, "404.html"));
