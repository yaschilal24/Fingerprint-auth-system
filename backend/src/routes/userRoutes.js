import express from "express";

import {
    getAllUsers,
    getUserProfile,
    getAuthenticationHistory,
    deactivateUser,
} from "../controllers/userController.js";

import {
    protect,
    adminOnly,
} from "../middleware/authMiddleware.js";

import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

// Current authenticated user's profile
router.get(
    "/profile",
    protect,
    asyncHandler(getUserProfile)
);

// Current user's authentication history
router.get(
    "/history",
    protect,
    asyncHandler(getAuthenticationHistory)
);

// Admin: view registered users
router.get(
    "/",
    protect,
    adminOnly,
    asyncHandler(getAllUsers)
);

// Admin: deactivate a user
router.patch(
    "/:id/deactivate",
    protect,
    adminOnly,
    asyncHandler(deactivateUser)
);

export default router;