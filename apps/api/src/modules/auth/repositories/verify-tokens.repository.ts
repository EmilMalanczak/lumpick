import type { DbClient } from "@lumpick/db";
import type { VerifyToken } from "@lumpick/db/types";
import { eq, tables } from "@lumpick/db";

import { CrashReporterService } from "~modules/shared/crash-reporter.service";
import { InstrumentationService } from "~modules/shared/instrumentation.service";
import { LumpickError } from "~utils/error";

type VerifyTokensRepositoryDependencies = {
  db: DbClient;
  crashReporter: CrashReporterService;
  instrumentator: InstrumentationService;
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
  private readonly crashReporter: CrashReporterService;
  private readonly instrumentator: InstrumentationService;

  constructor({
    db,
    instrumentator,
    crashReporter,
  }: VerifyTokensRepositoryDependencies) {
    this.db = db;
    this.instrumentator = instrumentator;
    this.crashReporter = crashReporter;
  }

  create(data: {
    userId: number;
    token: string;
    id: string;
  }): Promise<VerifyToken> {
    return this.instrumentator.startSpan(
      {
        name: "create verification token",
        attributes: {
          userId: data.userId,
          token: data.token,
        },
      },
      async () => {
        try {
          const [verifyToken] = await this.db
            .insert(tables.verifyTokens)
            .values({
              ...data,
              createdAt: new Date(), // Ensure createdAt is set
            })
            .returning();

          if (!verifyToken) {
            throw new LumpickError(
              "INTERNAL_SERVER_ERROR",
              "Failed to create verification token",
            );
          }

          return verifyToken;
        } catch (err) {
          this.crashReporter.report(err);

          throw err;
        }
      },
    );
  }

  findByToken(token: string): Promise<VerifyToken | null> {
    return this.instrumentator.startSpan(
      {
        name: "find verification token",
        attributes: {
          token,
        },
      },
      async () => {
        try {
          const verifyToken = await this.db.query.verifyTokens.findFirst({
            where: eq(tables.verifyTokens.token, token),
          });

          return verifyToken ?? null;
        } catch (err) {
          this.crashReporter.report(err);

          throw err;
        }
      },
    );
  }

  findByUserId(userId: number): Promise<VerifyToken | null> {
    return this.instrumentator.startSpan(
      {
        name: "find verification token by user id",
        attributes: {
          userId,
        },
      },
      async () => {
        try {
          const verifyToken = await this.db.query.verifyTokens.findFirst({
            where: eq(tables.verifyTokens.userId, userId),
          });

          return verifyToken ?? null;
        } catch (err) {
          this.crashReporter.report(err);

          throw err;
        }
      },
    );
  }

  remove(token: string): Promise<void> {
    return this.instrumentator.startSpan(
      {
        name: "remove verification token",
        attributes: {
          token,
        },
      },
      async () => {
        try {
          await this.db
            .delete(tables.verifyTokens)
            .where(eq(tables.verifyTokens.token, token));
        } catch (err) {
          this.crashReporter.report(err);

          throw err;
        }
      },
    );
  }

  update(
    userId: number,
    data: { token: string; createdAt: Date },
  ): Promise<VerifyToken> {
    return this.instrumentator.startSpan(
      {
        name: "update verification token",
        attributes: {
          userId,
        },
      },
      async () => {
        try {
          const [updatedToken] = await this.db
            .update(tables.verifyTokens)
            .set(data)
            .where(eq(tables.verifyTokens.userId, userId))
            .returning();

          if (!updatedToken) {
            throw new LumpickError(
              "INTERNAL_SERVER_ERROR",
              "Failed to update verification token",
            );
          }

          return updatedToken;
        } catch (err) {
          this.crashReporter.report(err);

          throw err;
        }
      },
    );
  }
}
