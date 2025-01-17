import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

import type { User } from "@lumpick/db/types";

import { CrashReporterService } from "~modules/shared/crash-reporter.service";
import { InstrumentationService } from "~modules/shared/instrumentation.service";
import { LumpickError } from "~utils/error";
import { isDbError } from "~utils/is-db-error";

import type { UsersRepository } from "../repositories/users.repository";

type UsersServiceDependencies = {
  usersRepository: UsersRepository;
  instrumentator: InstrumentationService;
  crashReporter: CrashReporterService;
};

export class UsersService {
  private readonly usersRepository: UsersRepository;
  private readonly instrumentator: InstrumentationService;
  private readonly crashReporter: CrashReporterService;

  constructor({
    usersRepository,
    instrumentator,
    crashReporter,
  }: UsersServiceDependencies) {
    this.usersRepository = usersRepository;
    this.instrumentator = instrumentator;
    this.crashReporter = crashReporter;
  }

  createUser(user: Omit<User<"insert">, "id">) {
    return this.instrumentator.startSpan(
      {
        name: "create user",
      },
      async () => {
        try {
          const createdUser = await this.usersRepository.create(user);

          return createdUser;
        } catch (error) {
          this.crashReporter.report(error);

          if (isDbError(error) && error.code === "23505") {
            throw new LumpickError("CONFLICT", error.message);
          }

          throw new Error("Unknown error");
        }
      },
    );
  }

  findUserById(id: User["id"]) {
    return this.instrumentator.startSpan(
      {
        name: "find user by id",
      },
      async () => {
        try {
          return this.usersRepository.findById(id);
        } catch (err) {
          this.crashReporter.report(err);

          throw err;
        }
      },
    );
  }

  async findUserByEmail(email: User["email"]) {
    return this.usersRepository.findByEmail(email);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async updateUser() {
    // TODO: Implement
    return null;
  }

  async verifyUserEmail(userId: number) {
    try {
      await this.usersRepository.verifyUser(userId);
    } catch (error) {
      if (isDbError(error) && error.message === "User does not exist") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User does not exist",
        });
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }
}
