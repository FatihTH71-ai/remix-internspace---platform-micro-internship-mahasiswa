import nodemailer from "nodemailer";
import { config } from "./config";
import { ApiError } from "./errors";

const hasSmtp = Boolean(
  config.SMTP_HOST && config.SMTP_USER && config.SMTP_PASSWORD && config.SMTP_FROM
);
export const emailDeliveryConfigured = hasSmtp;

const transporter = hasSmtp
  ? nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_PORT === 465,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASSWORD,
      },
    })
  : null;

export async function sendActionEmail(
  email: string,
  subject: string,
  actionUrl: string
): Promise<void> {
  if (!transporter || !config.SMTP_FROM) {
    if (config.NODE_ENV === "production") {
      throw new ApiError(503, "EMAIL_UNAVAILABLE", "Email delivery is not configured.");
    }

    console.info(`[development email] ${subject} for ${email}: ${actionUrl}`);
    return;
  }

  await transporter.sendMail({
    from: config.SMTP_FROM,
    to: email,
    subject,
    text: `Use this link to continue: ${actionUrl}`,
    html: `<p>Use this link to continue:</p><p><a href="${actionUrl}">${actionUrl}</a></p>`,
  });
}
