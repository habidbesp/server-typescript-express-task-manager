import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

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
        res.status(404).json({ error: error.message });
        return;
      }
      const user = await User.findById(tokenExist.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);

      res.status(200).send("Account has been successfully confirmed!");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("User not found.");
        res.status(404).json({ error: error.message });
        return;
      }

      if (!user.confirmed) {
        const token = new Token();
        token.user = user.id;
        token.token = generateToken();
        await token.save();

        //   Send email
        await AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        const error = new Error(
          "This account has not been confirmed. We have just sent you a new email with a new token. Please confirm your account."
        );
        res.status(401).json({ error: error.message });
        return;
      }

      // Authenticate password
      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error("Invalid Password");
        res.status(401).json({ error: error.message });
        return;
      }

      const token = generateJWT({ id: user.id });

      res.send(token);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };

  static requestConfirmationToken = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { email } = req.body;

      // User exists
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("The user is not registered");
        res.status(404).json({ error: error.message });
        return;
      }

      if (user.confirmed) {
        const error = new Error("The user has already been confirmed.");
        res.status(403).json({ error: error.message });
        return;
      }

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

      res.status(201).send("A new token has been sent to your email!");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      // User exists
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("The user is not registered");
        res.status(404).json({ error: error.message });
        return;
      }

      //   Generate Token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      await token.save();

      //   Send email
      await AuthEmail.sendPasswordResentToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      res
        .status(201)
        .send(
          "We have sent you an email with instructions to reset your password!"
        );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static validateToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.body;
      const tokenExist = await Token.findOne({ token });

      if (!tokenExist) {
        const error = new Error("Invalid Token");
        res.status(404).json({ error: error.message });
        return;
      }

      res.status(200).send("Valid token, set a new password.");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static updatePasswordWithToken = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { password } = req.body;
      const { token } = req.params;
      const tokenExist = await Token.findOne({ token });

      if (!tokenExist) {
        const error = new Error("Invalid Token");
        res.status(404).json({ error: error.message });
        return;
      }

      const user = await User.findById(tokenExist.user);

      user.password = await hashPassword(password);

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);

      res.status(200).send("Your password has been successfully updated");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static user = async (req: Request, res: Response): Promise<void> => {
    res.json(req.user);
    return;
  };
}
