module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],

          alias: {
            // Add aliases for the absolute imports
            "~components": "./components",
            "~": "./",
            "~utils": "./utils",
            "~constants": "./constants",
            "~storybook": ".storybook",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
