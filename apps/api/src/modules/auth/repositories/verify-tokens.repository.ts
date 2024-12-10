import type { DbClient } from "@lumpick/db";
import type { VerifyToken } from "@lumpick/db/types";
import { eq, tables } from "@lumpick/db";

type VerifyTokensRepositoryDependencies = {
  db: DbClient;
};

type IVerifyTokensRepositoryImpl = {
  create(data: {
    userId: number;
    token: string;
    id: string;
  }): Promise<VerifyToken>;
  findByToken(token: string): Promise<VerifyToken | null>;
  findByUserId(userId: number): Promise<VerifyToken | null>;
  remove(token: string): Promise<void>;
  update(
    userId: number,
    data: { token: string; createdAt: Date },
  ): Promise<VerifyToken>;
};

export class VerifyTokensRepository implements IVerifyTokensRepositoryImpl {
  private readonly db: DbClient;

  constructor({ db }: VerifyTokensRepositoryDependencies) {
    this.db = db;
  }

  async create(data: {
    userId: number;
    token: string;
    id: string;
  }): Promise<VerifyToken> {
    const [verifyToken] = await this.db
      .insert(tables.verifyTokens)
      .values({
        ...data,
        createdAt: new Date(), // Ensure createdAt is set
      })
      .returning();

    if (!verifyToken) {
      throw new Error("Failed to create verification token");
    }

    return verifyToken;
  }

  async findByToken(token: string): Promise<VerifyToken | null> {
    const verifyToken = await this.db.query.verifyTokens.findFirst({
      where: eq(tables.verifyTokens.token, token),
    });

    return verifyToken ?? null;
  }

  async findByUserId(userId: number): Promise<VerifyToken | null> {
    const verifyToken = await this.db.query.verifyTokens.findFirst({
      where: eq(tables.verifyTokens.userId, userId),
    });

    return verifyToken ?? null;
  }

  async remove(token: string): Promise<void> {
    await this.db
      .delete(tables.verifyTokens)
      .where(eq(tables.verifyTokens.token, token));
  }

  async update(
    userId: number,
    data: { token: string; createdAt: Date },
  ): Promise<VerifyToken> {
    const [updatedToken] = await this.db
      .update(tables.verifyTokens)
      .set(data)
      .where(eq(tables.verifyTokens.userId, userId))
      .returning();

    if (!updatedToken) {
      throw new Error("Failed to update verification token");
    }

    return updatedToken;
  }
}
