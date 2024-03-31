import type { Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import fp from "fastify-plugin";
import { createTransport } from "nodemailer";

declare module "fastify" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface FastifyInstance {
    mailer: Transporter;
  }
}

type FastifyMailerOptions = {
  defaults?: SMTPTransport.Options;
  transport: SMTPTransport | SMTPTransport.Options;
};

// Based on:
// https://github.com/coopflow/fastify-mailer
export const nodemailerPlugin = fp<FastifyMailerOptions>(
  (fastify, options, next) => {
    const { defaults, transport } = options;

    if (!transport) {
      return next(
        new Error(
          "You must provide a valid transport configuration object, connection url or a transport plugin instance",
        ),
      );
    }

    const transporter = createTransport(transport, defaults);
    
    if (fastify.mailer) {
      return next(new Error("mailer has already been registered"));
    } else {
      fastify.decorate("mailer", transporter);
    }

    next();
  },
);
