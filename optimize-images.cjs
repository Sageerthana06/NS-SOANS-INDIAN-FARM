const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const source = "public/images";
const output = "public/images-optimized";

async function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await walk(file);
      continue;
    }

    if (!/\.(jpg|jpeg|png)$/i.test(entry.name)) continue;

    const relative = path.relative(source, file);
    const destination = path.join(output, relative).replace(/\.(jpg|jpeg|png)$/i, ".webp");

    fs.mkdirSync(path.dirname(destination), { recursive: true });

    await sharp(file)
      .rotate()
      .webp({ quality: 88, effort: 5 })
      .toFile(destination);

    console.log("Optimized:", relative);
  }
}

(async () => {
  await walk(source);
  console.log("IMAGE OPTIMIZATION COMPLETE");
})();
