import type { DbClient } from "@lumpick/db";
import type { Shop } from "@lumpick/db/types";
import { eq, tables } from "@lumpick/db";

type ShopsRepositoryDependencies = {
  db: DbClient;
};

type IShopsRepositoryImpl = {
  findByEmail(email: string): Promise<Shop | null>;
  create(user: Shop<"insert">): Promise<Shop>;
  findById(id: number): Promise<Shop | null>;
  verifyShop(id: number): Promise<void>;
};

export class ShopsRepository implements IShopsRepositoryImpl {
  private readonly db: DbClient;

  constructor({ db }: ShopsRepositoryDependencies) {
    this.db = db;
  }

  async create(input: Shop<"insert">): Promise<Shop> {
    const [shop] = await this.db
      .insert(tables.shops)
      .values({
        ...input,
        hours: [],
      })
      .returning({
        id: tables.users.id,
        email: tables.users.email,
        name: tables.users.name,
        provider: tables.users.provider,
      });

    if (!shop) {
      throw new Error("Failed to create user");
    }

    return shop;
  }

  async findById(id: number): Promise<Shop | null> {
    const user = await this.db.query.users.findFirst({
      where: eq(tables.users.id, id),
    });

    return user ?? null;
  }

  async findByEmail(email: string): Promise<Shop | null> {
    const user = await this.db.query.users.findFirst({
      where: eq(tables.users.email, email),
    });

    return user ?? null;
  }

  async verifyShop(id: number) {
    await this.db
      .update(tables.users)
      .set({ verified: true })
      .where(eq(tables.users.id, id));
  }
}
