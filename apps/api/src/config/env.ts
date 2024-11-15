export const env = {
  PORT: 3003,
  HOST: "0.0.0.0",
  ENV: "development",
  DATABASE_URL: process.env.DATABASE_URL,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET ?? "",
  ACCESS_TOKEN_PUBLIC: process.env.ACCESS_TOKEN_PUBLIC ?? "",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET ?? "",
  REFRESH_TOKEN_PUBLIC: process.env.REFRESH_TOKEN_PUBLIC ?? "",
};
