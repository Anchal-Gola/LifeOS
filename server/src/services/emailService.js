
import nodemailer from "nodemailer";
import {
  EMAIL_USER,
  EMAIL_APP_PASSWORD,
  FRONTEND_URL,
} from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_APP_PASSWORD,
  },
});

export const sendPasswordResetEmail = async ({ email, name, token }) => {
  const resetLink = `${FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}`;

  await transporter.sendMail({
    from: `"LifeOS" <${EMAIL_USER}>`,
    to: email,
    subject: "Reset your LifeOS password",
    text: `Hi ${name || "there"},

We received a request to reset your LifeOS password.

Open this link within 15 minutes to choose a new password:
${resetLink}

If you did not request this, you can ignore this email.

LifeOS Support`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;color:#222">
        <h2>Reset your LifeOS password</h2>
        <p>Hi ${name || "there"},</p>
        <p>We received a request to reset your LifeOS password.</p>
        <p>
          <a href="${resetLink}" style="display:inline-block;padding:12px 20px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:8px">
            Reset Password
          </a>
        </p>
        <p>This link expires in 15 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
        <p>— LifeOS Support</p>
      </div>
    `,
  });
};