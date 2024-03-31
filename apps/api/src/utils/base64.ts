export function base64encode(data: string) {
  return Buffer.from(data, "utf-8").toString("base64");
}

export function base64decode(data: string) {
  return Buffer.from(data, "base64").toString("utf-8");
}
