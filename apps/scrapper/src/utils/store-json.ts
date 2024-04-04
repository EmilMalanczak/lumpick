import fs from "node:fs/promises";

export async function storeJson(filename: string, json: string) {
  await fs.writeFile(`${filename}.json`, json, { flag: "a" });
}
