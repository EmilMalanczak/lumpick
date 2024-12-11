import { promisify } from "node:util";
import * as esbuild from "esbuild";
import glob from "glob";

const globPromise = promisify(glob);

const commonConfig = {
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node16",
  external: ["puppeteer", "@inquirer/prompts", "xml2js", "@lumpick/api", "pino"],
  sourcemap: true,
} satisfies esbuild.BuildOptions;

async function build() {
  const entryPoints = await globPromise("./src/**/*.ts");

  const workerBuild = esbuild.build({
    entryPoints: ["./src/modules/scraping/shop-scraper.worker.ts"],
    outfile: "dist/scrap-worker.js",
    ...commonConfig,
  });

  const mainBuild = esbuild.build({
    entryPoints: entryPoints.filter((file) => !file.includes("worker.")),
    outdir: "dist",
    ...commonConfig,
  });

  await Promise.all([workerBuild, mainBuild]);
}

build().catch(console.error);
