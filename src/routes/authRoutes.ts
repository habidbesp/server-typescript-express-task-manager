import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("Name is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password requares a minimum of 8 characters"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords are not equal");
    }
    return true;
  }),
  body("email").isEmail().withMessage("E-mail not valid"),
  handleInputErrors,
  AuthController.createAccount
);

router.post(
  "/confirm-account",
  body("token").notEmpty().withMessage("Token is required"),
  handleInputErrors,
  AuthController.confirmAccount
);

router.post(
  "/login",
  body("email").isEmail().withMessage("E-mail not valid"),
  body("password").notEmpty().withMessage("Password is required"),
  handleInputErrors,
  AuthController.login
);

router.post(
  "/request-token",
  body("email").isEmail().withMessage("E-mail not valid"),
  handleInputErrors,
  AuthController.requestConfirmationToken
);

export default router;
