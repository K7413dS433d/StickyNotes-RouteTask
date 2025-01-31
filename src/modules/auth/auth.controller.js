import { Router } from "express";
import { asyncHandler } from "./../../utils/asyncHandler.js";
import * as authService from "./auth.service.js";

const router = Router();

router.post("/signup", asyncHandler(authService.signUp));

router.post("/login", asyncHandler(authService.login));

export default router;
