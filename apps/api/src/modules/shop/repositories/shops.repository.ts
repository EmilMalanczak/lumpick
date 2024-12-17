import type { DbClient } from "@lumpick/db";
import type { Shop } from "@lumpick/db/types";
import { eq, tables } from "@lumpick/db";

type ShopsRepositoryDependencies = {
  db: DbClient;
};

type IShopsRepositoryImpl = {
  create(user: Shop<"insert">): Promise<Shop>;
  findById(id: number): Promise<Shop | null>;
};

export class ShopsRepository implements IShopsRepositoryImpl {
  private readonly db: DbClient;

  constructor({ db }: ShopsRepositoryDependencies) {
    this.db = db;
  }

  async create(input: Shop<"insert">): Promise<Shop> {
    const [shop] = await this.db.insert(tables.shops).values(input).returning();

    if (!shop) {
      throw new Error("Failed to create user");
    }

    return shop;
  }

  async findById(id: number): Promise<Shop | null> {
    const shop = await this.db.query.shops.findFirst({
      where: eq(tables.shops.id, id),
    });

    return shop ?? null;
  }
}
