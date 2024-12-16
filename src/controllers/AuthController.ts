import type { Request, Response } from "express";
import User from "../models/User";
import { hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { transporter } from "../config/nodemailer";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController {
  static createAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      // prevent duplicates
      const userExist = await User.findOne({ email });
      if (userExist) {
        const error = new Error("User already exists");
        res.status(409).json({ error: error.message });
        return;
      }

      //   create a user
      const user = new User({ name, email, password });
      user.password = await hashPassword(password);

      //   Generate Token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      //   Send email
      await AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);

      res
        .status(201)
        .send(
          "Account created! Please check your email to confirm your account."
        );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static confirmAccount = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { token } = req.body;
      const tokenExist = await Token.findOne({ token });

      if (!tokenExist) {
        const error = new Error("Invalid Token");
        res.status(401).json({ error: error.message });
        return;
      }
      const user = await User.findById(tokenExist.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);

      res.status(200).send("Account successfully confirmed");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
