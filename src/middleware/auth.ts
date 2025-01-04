import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    const error = new Error("Unauthorized");
    res.status(401).json({ error: error.message });
    return;
  }
  const token = bearer.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY_PROD);

    let user: IUser | null;
    if (typeof decoded === "object" && decoded.id) {
      user = await User.findById(decoded.id).select("_id email name");
    }

    if (!user) {
      res.status(500).json({ error: "User not found, please register." });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: "Invalid Token" });
  }
};
