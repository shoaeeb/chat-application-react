import { Request, Response, NextFunction } from "express";
import asyncWrapper from "../asyncwrapper/async-wrapper";
import User, { UserType } from "../models/user";
import jwt from "jsonwebtoken";
import { validationResult, ValidationError } from "express-validator";
import { v2 as cloudinary } from "cloudinary";
import { BadRequest, UnAuthorized } from "../errors";
import { profile } from "console";
import mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const signUp = asyncWrapper(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      errors: errors
        .array()
        .map((error: any) => error?.path + " " + error.msg + " "),
    });
  }
  const { firstName, lastName, email, username, password } = req.body;

  const user = new User({
    firstName,
    lastName,
    email,
    username,
    password,
  });
  await user.save();
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET_KEY as string,
    {
      expiresIn: "1d",
    }
  );
  res.cookie("token", token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24, //1day
  });
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.FRONTEND_URL as string
  );
  res.status(201).json({ message: "User Created" });
});

const getUserProfile = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        errors: errors
          .array()
          .map((error: any) => error?.path + " " + error.msg + " "),
      });
      return;
    }
    const { query } = req.params;
    let user: any | undefined;
    if (mongoose.isValidObjectId(query)) {
      user = await User.findOne({ _id: query }).select("-password");
    } else {
      user = await User.findOne({ username: query }).select("-password");
    }
    if (!user) {
      res.status(404).json({ errors: "User not found" });
      return;
    }
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Origin",
      process.env.FRONTEND_URL as string
    );
    res.status(200).json(user);
  }
);

const updateProfile = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        errors: errors
          .array()
          .map((error: any) => error?.path + " " + error.msg + " "),
      });
      return;
    }
    let { firstName, lastName, email, password, profilePic } = req.body;

    const { id } = req.params;
    if (req.userId.toString() !== id.toString()) {
      throw new UnAuthorized("You Can't Update anyone else profile");
      return;
    }
    const user = await User.findById(id);
    if (!user) {
      throw new BadRequest("User Not Found");
      return;
    }
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.password = password || user.password;

    if (profilePic) {
      if (user.profilePic) {
        const imageId = user.profilePic.split("/").pop();
        await cloudinary.uploader.destroy(imageId as string);
      }
      const result = await cloudinary.uploader.upload(profilePic);
      profilePic = result.secure_url;
    }
    user.profilePic = profilePic || user.profilePic;
    await user.save();
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Origin",
      process.env.FRONTEND_URL as string
    );
    res.status(200).json(user);
  }
);

const getMyProfile = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      res.status(404).json({ errors: "User Not Found" });
      return;
    }
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Origin",
      process.env.FRONTEND_URL as string
    );
    res.status(200).json(user);
  }
);

//post - method
// /api/v1/logout/
const logout = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("token", "", {
      expires: new Date(0),
      sameSite: "none",
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: true,
    });
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Origin",
      process.env.FRONTEND_URL as string
    );
    res.status(200).json({ message: "Logout Successfully" });
  }
);

export { signUp, getUserProfile, updateProfile, getMyProfile, logout };
