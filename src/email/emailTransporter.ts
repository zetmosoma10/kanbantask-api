import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import EmailOptionsDto from "../dtos/emailOptionsDto";
import { env } from "node:process";

const emailTransporter = async (options: EmailOptionsDto) => {
  const transporter = nodemailer.createTransport({
    service: env.KANBAN_EMAIL_SERVICES,
    host: env.KANBAN_EMAIL_HOST,
    port: env.KANBAN_EMAIL_PORT,
    secure: false,
    auth: {
      user: env.KANBAN_EMAIL_USER,
      pass: env.KANBAN_EMAIL_PASS,
    },
  } as SMTPTransport.Options);

  const mailOptions = {
    from: {
      name: "kanban",
      address: env.KANBAN_EMAIL_USER!,
    },
    to: options.clientEmail,
    subject: options.subject,
    html: options.htmlContent,
  };

  transporter.sendMail(mailOptions);
};

export default emailTransporter;
