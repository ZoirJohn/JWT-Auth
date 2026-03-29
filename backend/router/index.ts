import { Router } from "express";
import UserController from "../controllers/user-controller.ts";
import { body } from "express-validator";
const router = Router();

router.post("/register", body("email").isEmail(), body("password").isLength({ min: 5, max: 32 }), UserController.register);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.get("/activate/:link", UserController.activate);
router.get("/refresh", UserController.refresh);
router.get("/test", UserController.test);

export default router;
