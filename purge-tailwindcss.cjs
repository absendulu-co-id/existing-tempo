const Purgecss = require("purgecss");
const fs = require("fs");
const path = require("path");

// Custom PurgeCSS extractor for Tailwind that allows special characters in
// class names.
//
// https://github.com/FullHuman/purgecss#extractor

const purgecss = new Purgecss.PurgeCSS();

void (async () => {
  const result = await purgecss.purge({
    content: ["./src/**/*.js", "./src/**/*.jsx", "./src/**/*.ts", "./src/**/*.tsx"],
    css: ["./src/styles/tailwind.css"],
    safelist: ["pl-24", "pl-40", "pl-56", "pl-72", "pl-80"],
    extractors: [
      {
        extensions: ["html", "js", "jsx", "ts", "tsx"],
        extractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) ?? [],
      },
    ],
  });

  result.forEach((out) => {
    fs.writeFileSync(path.resolve(__dirname, out.file), out.css, "utf-8");
  });

  console.log("src/styles/tailwind.css successfully purged.");
})();
