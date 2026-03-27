import { Router } from "express";
import UserController from "../controllers/user-controller.ts";
const router = Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.get("/activate", UserController.activate);
router.get("/refresh", UserController.refresh);
router.get("/test", UserController.test);

export default router;
