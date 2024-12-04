import type { SignOptions } from "jsonwebtoken";
import { env } from "~config/env";
import { tokenConfig } from "~config/token";
import jwt from "jsonwebtoken";

class JWTToken<T extends string | object | Buffer> {
  private secret: string;
  private public: string;
  private options: SignOptions;

  constructor(secretKey: string, publicKey: string, options?: SignOptions) {
    this.secret = secretKey;
    this.public = publicKey;
    this.options = options ?? {};
  }

  sign(payload: T) {
    const privateKey = Buffer.from(this.secret, "base64").toString("ascii");

    return jwt.sign(payload, privateKey, {
      ...this.options,
      issuer: "lumpick-api-service",
    });
  }

  decode(token: string): T | null {
    try {
      const publicKey = Buffer.from(this.public, "base64").toString("ascii");

      return jwt.verify(token, publicKey) as T;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

type TokenPayload = {
  userId: number;
};

export const accessToken = new JWTToken<TokenPayload>(
  env.ACCESS_TOKEN_SECRET,
  env.ACCESS_TOKEN_PUBLIC,
  {
    algorithm: "RS256",
    subject: "user",
    expiresIn: tokenConfig.accessTokenExpiry,
  },
);
export const refreshToken = new JWTToken<TokenPayload>(
  env.REFRESH_TOKEN_SECRET,
  env.REFRESH_TOKEN_PUBLIC,
  {
    algorithm: "RS256",
    subject: "user",
    expiresIn: tokenConfig.refreshTokenExpiry,
  },
);
