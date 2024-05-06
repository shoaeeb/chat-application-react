import React, { useEffect, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

export type MessageType = {
  _id: string;
  conversationId: string;
  messages: { sender: string; message: string }[];
};
type AppContextType = {
  isLoggedIn: boolean;
  showToast: (toastMessage: ToastMessage) => void;
  authUser: apiClient.UserType | undefined;
  chatSelected: apiClient.ConversationType | undefined;
  setChatSelected: (message: apiClient.ConversationType | undefined) => void;
  setAuthUser: (user: apiClient.UserType | undefined) => void;
  updateChatSelected: (
    message: MessageType,
    prev: apiClient.ConversationType | undefined
  ) => void;
};

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  const [authUser, setAuthUser] = useState<apiClient.UserType | undefined>(
    undefined
  );

  const { isError } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
  });

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const user = await apiClient.getMyProfile();
        setAuthUser(user);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLoggedInUser();
  }, [isError]);
  const [chatSelected, setChatSelected] = useState<
    apiClient.ConversationType | undefined
  >(undefined);

  const updateChatSelected = (
    message: MessageType,
    prev: apiClient.ConversationType | undefined
  ) => {
    if (!prev) return;
    setChatSelected({
      ...prev,
      lastMessage: message.messages[message.messages.length - 1].message,
      sender: message.messages[message.messages.length - 1].sender,
    });
  };

  const showToast = (toastMessage: ToastMessage) => {
    // Implement your toast functionality here
    setToast({ message: toastMessage.message, type: toastMessage.type });
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn: !isError,
        showToast,
        authUser,
        setChatSelected,
        chatSelected,
        setAuthUser,
        updateChatSelected,
      }}
    >
      {toast && (
        <Toast
          onClose={() => {
            setToast(undefined);
          }}
          message={toast.message}
          type={toast.type}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};
export function useAppContext() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return context;
}
