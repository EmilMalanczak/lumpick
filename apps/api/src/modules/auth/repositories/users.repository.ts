import type { DbClient } from "@lumpick/db";
import type { User } from "@lumpick/db/types";
import { eq, tables } from "@lumpick/db";

type UsersRepositoryDependencies = {
  db: DbClient;
};

type IUsersRepositoryImpl = {
  findByEmail(email: string): Promise<User | null>;
  create(
    user: User<"insert">,
  ): Promise<Pick<User, "id" | "email" | "name" | "provider">>;
  findById(id: number): Promise<User | null>;
  verifyUser(id: number): Promise<void>;
};

export class UsersRepository implements IUsersRepositoryImpl {
  private readonly db: DbClient;

  constructor({ db }: UsersRepositoryDependencies) {
    this.db = db;
  }

  async create(
    input: User<"insert">,
  ): Promise<Pick<User, "id" | "email" | "name" | "provider">> {
    const [user] = await this.db.insert(tables.users).values(input).returning({
      id: tables.users.id,
      email: tables.users.email,
      name: tables.users.name,
      provider: tables.users.provider,
    });

    if (!user) {
      throw new Error("Failed to create user");
    }

    return user;
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.db.query.users.findFirst({
      where: eq(tables.users.id, id),
    });

    return user ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.query.users.findFirst({
      where: eq(tables.users.email, email),
    });

    return user ?? null;
  }

  async verifyUser(id: number) {
    await this.db
      .update(tables.users)
      .set({ verified: true })
      .where(eq(tables.users.id, id));
  }
}
