import type { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

export class JWTTokenService<T extends string | object | Buffer> {
  private secret: string;
  private public: string;
  private options: SignOptions;

  constructor(secretKey: string, publicKey: string, options?: SignOptions) {
    this.secret = secretKey;
    this.public = publicKey;
    this.options = options ?? {};
  }

  public sign(payload: T) {
    const privateKey = Buffer.from(this.secret, "base64").toString("ascii");

    return jwt.sign(payload, privateKey, {
      ...this.options,
      issuer: "lumpick-api-service",
    });
  }

  public decode(token: string): T | null {
    try {
      const publicKey = Buffer.from(this.public, "base64").toString("ascii");

      return jwt.verify(token, publicKey) as T;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
