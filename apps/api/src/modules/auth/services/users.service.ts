import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

import type { User } from "@lumpick/db/types";

import { LumpickError } from "~utils/error";
import { isDbError } from "~utils/is-db-error";

import type { UsersRepository } from "../repositories/users.repository";

type UsersServiceDependencies = {
  usersRepository: UsersRepository;
};

export class UsersService {
  private readonly usersRepository: UsersRepository;

  constructor({ usersRepository }: UsersServiceDependencies) {
    this.usersRepository = usersRepository;
  }

  async createUser(user: User<"insert">) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 12);

      const createdUser = await this.usersRepository.create({
        ...user,
        password: hashedPassword,
      });

      return createdUser;
    } catch (error) {
      if (isDbError(error) && error.code === "23505") {
        throw new LumpickError("CONFLICT", error.message);
      }

      throw new Error("Unknown error");
    }
  }

  async findUserById(id: User["id"]) {
    return this.usersRepository.findById(id);
  }

  async findUserByEmail(email: User["email"]) {
    return this.usersRepository.findByEmail(email);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async updateUser() {
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

  public async verifyUserPassword(password: string, user: User) {
    const isValidPassword = await bcrypt.compare(password, user.password);

    return isValidPassword;
  }
}
