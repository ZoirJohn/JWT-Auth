import { Router } from "express";
import { body } from "express-validator";
import { AuthMiddleware } from "../middlewares/auth-middleware.ts";
import UserController from "../controllers/user-controller.ts";

const router = Router();

router.post("/register", body("email").isEmail(), body("password").isLength({ min: 5, max: 32 }), UserController.register);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.get("/activate/:link", UserController.activate);
router.get("/refresh", UserController.refresh);
router.get("/test", UserController.test);
router.get("/users", AuthMiddleware, UserController.users);

export default router;
