import type { Shop } from "../../../../packages/db/src/tables";
import type { DumpShop } from "./shop.service";

export const transformDumpShopData = async (
  dumpShop: DumpShop,
  // eslint-disable-next-line @typescript-eslint/require-await
): Promise<Shop<"insert">> => {
  console.log("Transforming dump shop data...", dumpShop);
  // @ts-expect-error - dsadsa
  return {
    description: "",
    name: "",
  };
};
