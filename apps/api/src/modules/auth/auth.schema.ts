import type { TypeOf } from "zod";
import { selectUserSchema } from "node_modules/@lumpik/db/src/tables";
import { object, string, void as zodVoid } from "zod";

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
    data: selectUserSchema.pick({
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
    user: selectUserSchema.pick({
      id: true,
      name: true,
      email: true,
      provider: true,
    }),
  }),
};

export type LoginUserInput = TypeOf<(typeof loginUserSchema)["input"]>;
export type LoginUserOutput = TypeOf<(typeof loginUserSchema)["output"]>;

export const refreshTokenSchema = {
  input: object({
    refreshToken: string(),
  }),
  output: object({
    accessToken: string(),
    refreshToken: string(),
  }),
};

export type RefreshTokenInput = TypeOf<(typeof refreshTokenSchema)["input"]>;
export type RefreshTokenOutput = TypeOf<(typeof refreshTokenSchema)["output"]>;

export const verifyEmailSchema = {
  input: object({
    token: string(),
  }),
  output: zodVoid(),
};

export type VerifyEmailInput = TypeOf<(typeof verifyEmailSchema)["input"]>;
export type VerifyEmailOutput = TypeOf<(typeof verifyEmailSchema)["output"]>;

export const resendVerifyEmailSchema = {
  input: object({
    email: string().email(),
  }),
  output: object({
    message: string(),
  }),
};

export type ResendVerifyEmailInput = TypeOf<
  (typeof resendVerifyEmailSchema)["input"]
>;
export type ResendVerifyEmailOutput = TypeOf<
  (typeof resendVerifyEmailSchema)["output"]
>;
