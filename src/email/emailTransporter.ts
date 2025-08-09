import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import EmailOptionsDto from "../dtos/emailOptionsDto";
import { env } from "node:process";

const emailTransporter = async (options: EmailOptionsDto) => {
  const transporter = nodemailer.createTransport({
    host: env.KANBAN_EMAIL_HOST,
    port: env.KANBAN_EMAIL_PORT,
    auth: {
      user: env.KANBAN_EMAIL_USER,
      pass: env.KANBAN_EMAIL_PASS,
    },
  } as SMTPTransport.Options);

  const mailOptions = {
    from: {
      name: "kanban<support>",
      address: env.MY_EMAIL!,
    },
    to: options.clientEmail,
    subject: options.subject,
    html: options.htmlContent,
  };

  transporter.sendMail(mailOptions);
};

export default emailTransporter;
