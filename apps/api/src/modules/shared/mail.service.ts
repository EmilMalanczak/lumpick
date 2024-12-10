import type Mail from "nodemailer/lib/mailer";
import nodemailer from "nodemailer";

type MailServiceParams = {
  host: string;
  port: number;
  user: string;
  password: string;
  author: string;
};

export class MailService {
  private mailer: ReturnType<typeof nodemailer.createTransport>;
  private author: string;

  constructor({ host, port, user, password, author }: MailServiceParams) {
    this.author = author;
    this.mailer = nodemailer.createTransport({
      host,
      port,
      secure: true,
      auth: {
        user,
        pass: password,
      },
    });
  }

  async sendMail(options: Mail.Options) {
    return this.mailer.sendMail({
      from: this.author,
      ...options,
    });
  }
}
