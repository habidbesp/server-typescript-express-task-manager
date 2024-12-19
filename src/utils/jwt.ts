import jwt from "jsonwebtoken";

export const generateJWT = () => {
  const data = {
    email: "habidbespinosa@gmail.com",
    password: "password",
    credit_card: "3546543754645",
  };
  const token = jwt.sign(data, process.env.SECRET_KEY_PROD, {
    expiresIn: "6m",
  });
  return token;
};
