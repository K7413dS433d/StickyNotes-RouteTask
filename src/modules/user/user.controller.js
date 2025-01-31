import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import * as userService from "./user.service.js";

const router = Router();

router.patch(
  "/",
  asyncHandler(isAuthenticated),
  asyncHandler(userService.updateUser)
);

router.delete(
  "/",
  asyncHandler(isAuthenticated),
  asyncHandler(userService.deleteUser)
);

router.get(
  "/",
  asyncHandler(isAuthenticated),
  asyncHandler(userService.getUserData)
);

export default router;
