// esbuild.config.mts
import { fileURLToPath } from "url";
import { sentryEsbuildPlugin } from "@sentry/esbuild-plugin";
import * as esbuild from "esbuild";

// Common configuration settings
const config = {
  // Core settings matching CLI command
  entryPoints: ["src/index.ts"],
  bundle: true,
  packages: "external",
  platform: "node",
  format: "cjs",
  outdir: "dist",
  sourcemap: true,

  // Additional useful settings
  logLevel: "info",
  target: "node16",
  treeShaking: true,
  resolveExtensions: [".ts", ".js", ".json"],

  // Error handling settings
  logLimit: 0,

  plugins: [
    sentryEsbuildPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: "lumpick",
      project: "node",
    }),
  ],
};

// Build function
async function build() {
  try {
    // Build
    const result = await esbuild.build(config);

    console.log("Build completed successfully");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

// Execute build if running directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  build();
}
