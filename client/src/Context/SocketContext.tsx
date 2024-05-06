import React, { useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useAppContext } from "./AppContext";

const SOCKET_BASE_URL = import.meta.env.VITE_SOCKET_BASE_URL;
type SocketContextType = {
  socket: Socket | null;
  onlineUsers: string[];
};
type Props = {
  children: React.ReactNode;
};

const SocketContext = React.createContext<SocketContextType | undefined>(
  undefined
);

export const SocketContextProvider = ({ children }: Props) => {
  const { authUser } = useAppContext();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    const socket = io(SOCKET_BASE_URL, {
      query: { userId: authUser?._id },
    });
    socket.on("getOnlineUser", (data: string[]) => {
      setOnlineUsers(data);
    });

    setSocket(socket);
    return () => {
      socket && socket.close();
    };
  }, [authUser?._id]);

  useEffect(() => {
    if (socket) {
      socket.on("getOnlineUser", (data: string[]) => {
        setOnlineUsers(data);
      });
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (context === undefined)
    throw new Error("Socket Context is used outside provider");
  return context;
};
