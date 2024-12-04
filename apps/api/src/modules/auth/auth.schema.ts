import type { TypeOf } from "zod";
import { object, string, void as zodVoid } from "zod";

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
