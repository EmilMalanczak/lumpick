import type { DbClient } from "@lumpick/db";
import type { User } from "@lumpick/db/types";
import { eq, tables } from "@lumpick/db";

import { CrashReporterService } from "~modules/shared/crash-reporter.service";
import { InstrumentationService } from "~modules/shared/instrumentation.service";
import { LumpickError } from "~utils/error";

type UsersRepositoryDependencies = {
  db: DbClient;
  crashReporter: CrashReporterService;
  instrumentator: InstrumentationService;
};

interface IUsersRepositoryImpl {
  findByEmail(email: string): Promise<User | null>;
  create(
    user: User<"insert">,
  ): Promise<Pick<User, "id" | "email" | "name" | "provider">>;
  findById(id: number): Promise<User | null>;
  verifyUser(id: number): Promise<void>;
}

export class UsersRepository implements IUsersRepositoryImpl {
  private readonly db: DbClient;
  private readonly crashReporter: CrashReporterService;
  private readonly instrumentator: InstrumentationService;

  constructor({
    db,
    crashReporter,
    instrumentator,
  }: UsersRepositoryDependencies) {
    this.db = db;
    this.crashReporter = crashReporter;
    this.instrumentator = instrumentator;
  }

  create(
    input: Omit<User<"insert">, "id">,
  ): Promise<Pick<User, "id" | "email" | "name" | "provider">> {
    return this.instrumentator.startSpan(
      {
        name: "insert user to database",
      },
      async () => {
        try {
          const [user] = await this.db
            .insert(tables.users)
            .values(input)
            .returning({
              id: tables.users.id,
              email: tables.users.email,
              name: tables.users.name,
              provider: tables.users.provider,
            });

          if (!user) {
            throw new LumpickError(
              "INTERNAL_SERVER_ERROR",
              "Failed to create user",
            );
          }

          return user;
        } catch (err) {
          this.crashReporter.report(err);

          throw err;
        }
      },
    );
  }

  findById(id: number): Promise<User | null> {
    return this.instrumentator.startSpan(
      {
        name: "find user by id",
        attributes: {
          userId: id,
        },
      },
      async () => {
        try {
          const user = await this.db.query.users.findFirst({
            where: eq(tables.users.id, id),
          });

          return user ?? null;
        } catch (err) {
          this.crashReporter.report(err);

          throw err;
        }
      },
    );
  }

  findByEmail(email: string): Promise<User | null> {
    return this.instrumentator.startSpan(
      {
        name: "find user by email",
        attributes: {
          email,
        },
      },
      async () => {
        try {
          const user = await this.db.query.users.findFirst({
            where: eq(tables.users.email, email),
          });

          return user ?? null;
        } catch (err) {
          this.crashReporter.report(err);

          throw err;
        }
      },
    );
  }

  verifyUser(id: number) {
    return this.instrumentator.startSpan(
      {
        name: "verify user",
        attributes: {
          userId: id,
        },
      },
      async () => {
        try {
          await this.db
            .update(tables.users)
            .set({ verified: true })
            .where(eq(tables.users.id, id));
        } catch (err) {
          this.crashReporter.report(err);

          throw err;
        }
      },
    );
  }
}
