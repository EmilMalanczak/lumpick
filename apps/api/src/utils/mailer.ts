import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport(
  {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_LOGIN,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  },
  {
    from: "Lumpick <imgonnamissit123@gmail.com>",
  },
);
