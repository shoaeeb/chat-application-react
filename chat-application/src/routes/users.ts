import express from "express";
import {
  getUserProfile,
  getMyProfile,
  signUp,
  updateProfile,
  logout,
} from "../controllers/users";
import { login, validateToken } from "../controllers/auth";
import { check, param } from "express-validator";
import { verifyToken } from "../middlewares/auth";
import { getSuggestedUser } from "../controllers/messages";

const router = express();

router.post(
  "/register",
  [
    check("firstName", "firstName is required").isString(),
    check("lastName", "lastName is required").isString(),
    check("email", "Email is required").isEmail(),
    check("username", "username is required").isString(),
    check("password", "password is required").isString(),
  ],
  signUp
);
router.post(
  "/login",
  [
    check("username", "username is required").isString(),
    check("password", "password is required").isString(),
  ],
  login
);
router.get("/validate-token", verifyToken, validateToken);
router.get(
  "/profile/:query",
  [param("query", "username or id is required").notEmpty()],
  getUserProfile
);
router.put("/profile/:id", verifyToken, updateProfile);

router.get("/my-profile", verifyToken, getMyProfile);
router.get("/suggested-user", verifyToken, getSuggestedUser);
router.post("/logout", logout);

export default router;
