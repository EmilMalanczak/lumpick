import type { TypeOf } from "zod";
import { object, string } from "zod";

import { schemas } from "@lumpick/db/schemas";

export const createUserSchema = {
  input: object({
    name: string({ required_error: "Name is required" }),
    email: string({ required_error: "Email is required" }).email(
      "Invalid email",
    ),
    password: string({ required_error: "Password is required" })
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    passwordConfirm: string({ required_error: "Please confirm your password" }),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  }),
  output: object({
    status: string(),
    data: schemas.users.select.pick({
      name: true,
      email: true,
      id: true,
      provider: true,
    }),
  }),
};
export type CreateUserInput = TypeOf<(typeof createUserSchema)["input"]>;
export type CreateUserOutput = TypeOf<(typeof createUserSchema)["output"]>;

export const loginUserSchema = {
  input: object({
    email: string({ required_error: "Email is required" }).email(
      "Invalid email or password",
    ),
    password: string({ required_error: "Password is required" }).min(
      8,
      "Invalid email or password",
    ),
  }),
  output: object({
    accessToken: string(),
    refreshToken: string(),
    user: schemas.users.select.pick({
      id: true,
      name: true,
      email: true,
      provider: true,
    }),
  }),
};

export type LoginUserInput = TypeOf<(typeof loginUserSchema)["input"]>;
export type LoginUserOutput = TypeOf<(typeof loginUserSchema)["output"]>;
