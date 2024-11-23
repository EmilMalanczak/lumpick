module.exports = {
  source: "src",
  output: "dist",
  targets: [
    [
      "commonjs",
      {
        esm: true,
      },
    ],
    [
      "module",
      {
        esm: true,
      },
    ],
    [
      "typescript",
      {
        project: "./tsconfig.build.json",
        esm: true,
        /**
         * Fix build error related to bob package
         * https://github.com/callstack/react-native-builder-bob/issues/434
         */
        tsc: "../../node_modules/typescript/bin/tsc",
      },
    ],
  ],
};
