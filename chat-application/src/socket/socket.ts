import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const onlineUsers: { [key: string]: string } = {};
const getSocketByUserId = (userId: string) => {
  return onlineUsers[userId];
};
io.on("connection", (socket) => {
  console.log("User connected with id:", socket.id);
  const userId = socket.handshake.query.userId as string;
  console.log(userId);
  if (userId !== "undefined") {
    onlineUsers[userId] = socket.id;
  }
  io.emit("getOnlineUser", Object.keys(onlineUsers));
  console.log(onlineUsers);
  socket.on("disconnect", () => {
    console.log("user disconnected");
    delete onlineUsers[userId];
    io.emit("getOnlineUser", Object.keys(onlineUsers));
    console.log("deleted Online Users", onlineUsers);
  });
});

export { server, app, io, getSocketByUserId };
