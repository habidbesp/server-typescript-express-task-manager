import { transporter } from "../config/nodemailer";
import { IUser } from "../models/User";

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: "TaskManager <admin@task-manager.com>",
      to: user.email,
      subject: "TaskManager - Confirm your account.",
      text: "TaskManager - Confirm your account.",
      html: `
        <div style="
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
        ">
            <h2 style="color: #4CAF50;">Hello ${user.name},</h2>
            <p style="font-size: 16px; margin-bottom: 20px;">
            Thank you for creating your account on <b>TaskManager</b>! You're almost ready to start. 
            Please confirm your account to complete the setup and get started.
            </p>
            <p style="font-size: 16px; margin-bottom: 20px;">
            Visit the following link 👇
            </p>
            <a href="${process.env.FRONTEND_ORIGIN_PROD}/auth/confirm-account" 
            style="
                display: inline-block;
                text-decoration: none;
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                font-size: 16px;
            ">
            Confirm Account
            </a>
            <p style="font-size: 16px; margin-top: 20px;">
            And enter the following token: <b>${user.token}</b>
            </p>
            <p style="font-size: 14px; color: #555;">
            The token expires in <b>10 minutes</b>. If it has expired, you can request a new one.
            </p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
            <p style="font-size: 12px; color: #777; text-align: center;">
            TaskManager Team - Helping you stay organized.
            </p>
        </div>
        `,
    });

    console.log("Email sended", info.messageId);
  };
}
