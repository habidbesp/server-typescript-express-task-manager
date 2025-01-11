import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("Name is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password requires a minimum of 8 characters"),
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

router.post(
  "/reset-password",
  body("email").isEmail().withMessage("E-mail not valid"),
  handleInputErrors,
  AuthController.resetPassword
);

router.post(
  "/validate-token",
  body("token").notEmpty().withMessage("Token is required"),
  handleInputErrors,
  AuthController.validateToken
);

router.post(
  "/update-password/:token",
  param("token").isNumeric().withMessage("Invalid Token"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password requares a minimum of 8 characters"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords are not equal");
    }
    return true;
  }),
  handleInputErrors,
  AuthController.updatePasswordWithToken
);

router.get("/user", authenticate, AuthController.user);

/** Profile */
router.put(
  "/profile",
  authenticate,
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("E-mail not valid"),
  handleInputErrors,
  AuthController.updateProfile
);

router.post(
  "/update-password",
  authenticate,
  body("current_password")
    .notEmpty()
    .withMessage("Current password is required"),
  body("password")
    .custom((value, { req }) => {
      if (value === req.body.current_password) {
        throw new Error("Choose another password");
      }
      return true;
    })
    .isLength({ min: 8 })
    .withMessage("Password requires a minimum of 8 characters"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords are not equal");
    }
    return true;
  }),
  handleInputErrors,
  AuthController.updateCurrentUserPassword
);

router.post(
  "/check-password",
  authenticate,
  body("password").notEmpty().withMessage("Password is required"),
  handleInputErrors,
  AuthController.checkPassword
);

export default router;
