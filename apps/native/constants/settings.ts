import Constants from "expo-constants";

export const storageDomain = "https://www.example.com";

const config = {
  dev: {
    apiUrl: __DEV__
      ? `http://${Constants.expoConfig?.hostUri?.split(":")[0]}:3000/trpc`
      : "https://api.example.com", // TODO prod url,
  },
  prod: {
    apiUrl: "https://api.example.com",
  },
};

const getCurrentSettings = () => {
  if (__DEV__) return config.dev;
  return config.prod;
};

export const settings = getCurrentSettings();
