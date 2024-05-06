import { Request, Response, NextFunction } from "express";
import asyncWrapper from "../asyncwrapper/async-wrapper";
import Conversation from "../models/conversation";
import Message from "../models/message";
import { getSocketByUserId, io } from "../socket/socket";
import User, { UserType } from "../models/user";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

//post route
//api/v1/messages/conversations/:otherUserId
const getConversation = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const ourUserId = req.userId;
    const conversation = await Conversation.find({
      participants: {
        $in: [ourUserId],
      },
    });
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Origin",
      process.env.FRONTEND_URL as string
    );
    res.status(200).json(conversation);
  }
);

//post route
//api/v1/messages/:conversationId
const getMessages = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { conversationId } = req.params;
    const messages = await Message.findOne({ conversationId });
    if (!messages) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Origin",
      process.env.FRONTEND_URL as string
    );
    res.status(200).json(messages);
  }
);

//post route
//api/v1/messages/create/:otherUserId
const createMessage = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { otherUserId } = req.params;
    const { message } = req.body;
    const sender = req.userId;
    let conversation = await Conversation.findOne({
      participants: {
        $all: [sender, otherUserId],
      },
    });
    const getRecipeintSocketId = getSocketByUserId(otherUserId);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Origin",
      process.env.FRONTEND_URL as string
    );
    if (!conversation) {
      const newConversation = new Conversation({
        participants: [sender, otherUserId],
        lastMessage: message,
        sender,
      });
      await newConversation.save();
      const newMessage = new Message({
        conversationId: newConversation._id,
        sender,
        messages: [{ message, sender }],
      });
      await newMessage.save();

      res.status(201).json(newMessage);
      io.to(getRecipeintSocketId).emit("newMessage", newMessage);
      return;
    }

    conversation = await Conversation.findOneAndUpdate(
      {
        participants: {
          $all: [sender, otherUserId],
        },
      },
      {
        lastMessage: message,
        sender,
      },
      {
        new: true, // This option makes it return the updated document
      }
    );

    const messageModel = await Message.findOneAndUpdate(
      { conversationId: conversation?._id },
      {
        $push: { messages: { message, sender } },
      },
      {
        new: true,
      }
    );
    io.to(getRecipeintSocketId).emit("newMessage", messageModel);
    res.status(201).json(messageModel);
  }
);

const getSuggestedUser = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.find({}).select("-password");
    console.log(user);
    const filteredUser = user.filter(
      (user) => user._id.toString() !== req.userId
    );
    const conversations = await Conversation.find({
      participants: {
        $in: [req.userId],
      },
    });
    const participants = conversations.flatMap((conversation) =>
      conversation.participants.map((participant) => participant.toString())
    );
    const suggestedUser = filteredUser.filter((user) => {
      return !participants.includes(user._id.toString());
    });
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Origin",
      process.env.FRONTEND_URL as string
    );
    res.status(200).json(suggestedUser);
  }
);

export { getMessages, getConversation, createMessage, getSuggestedUser };
