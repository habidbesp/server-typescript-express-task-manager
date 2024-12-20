import jwt from "jsonwebtoken";
import { Types } from "mongoose";

type UserPayload = {
  id: Types.ObjectId;
};

export const generateJWT = (payload: UserPayload) => {
  const token = jwt.sign(payload, process.env.SECRET_KEY_PROD, {
    expiresIn: "180d",
  });
  return token;
};
