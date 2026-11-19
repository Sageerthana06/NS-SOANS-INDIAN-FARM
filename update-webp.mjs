import fs from "fs";
import path from "path";

const backup = "E:/NS-SOANS-SRC-BACKUP";

if (!fs.existsSync(backup)) {
  fs.cpSync("src", backup, { recursive: true });
  console.log("Source backup created");
}

let changed = 0;
let replacements = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(file);
      continue;
    }

    if (!/\.(js|jsx|ts|tsx|css)$/i.test(file)) continue;

    let content = fs.readFileSync(file, "utf8");
    const original = content;

    content = content.replace(/(["'])\/images\/([^"']+\.(?:jpg|jpeg|png))\1/gi,
      (match, quote, relative) => {
        const optimized = path.join(
          "public/images-optimized",
          relative.replace(/\.(jpg|jpeg|png)$/i, ".webp")
        );

        if (!fs.existsSync(optimized)) return match;

        replacements++;
        return `${quote}/images-optimized/${relative.replace(/\.(jpg|jpeg|png)$/i, ".webp")}${quote}`;
      }
    );

    content = content.replace(
      /\/images\/categories\/\$\{category\.slug\}\.png/g,
      "/images-optimized/categories/${category.slug}.webp"
    );

    if (content !== original) {
      fs.writeFileSync(file, content, "utf8");
      changed++;
    }
  }
}

walk("src");

console.log("Files updated:", changed);
console.log("Image references updated:", replacements);
console.log("SOURCE UPDATE COMPLETE");
