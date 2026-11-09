import express from "express";

import {
    registerOptions,
    verifyRegister,
    loginOptions,
    verifyLogin,
    getCurrentUser,
    logout,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

import { authLimiter } from "../middleware/rateLimiter.js";

import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

// Registration
router.post(
    "/register/options",
    authLimiter,
    asyncHandler(registerOptions)
);

router.post(
    "/register/verify",
    authLimiter,
    asyncHandler(verifyRegister)
);

// Login
router.post(
    "/login/options",
    authLimiter,
    asyncHandler(loginOptions)
);

router.post(
    "/login/verify",
    authLimiter,
    asyncHandler(verifyLogin)
);

// Session
router.get(
    "/me",
    protect,
    getCurrentUser
);

router.post(
    "/logout",
    protect,
    logout
);

export default router;