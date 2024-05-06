import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import { MessageType, useAppContext } from "../Context/AppContext";
import * as apiClient from "../api-client";

type Props = {
  setMessages: React.Dispatch<React.SetStateAction<MessageType | undefined>>;
  recieverId: string | undefined;
  authUser: apiClient.UserType | undefined;
  messages: MessageType | undefined;
};

const MessageInput = ({
  setMessages,
  messages,
  recieverId,
  authUser,
}: Props) => {
  const { showToast, chatSelected, updateChatSelected } = useAppContext();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSendMessage = async () => {
    if (!text) return;
    if (loading) return;
    setLoading(true);
    try {
      if (!recieverId) return;
      await apiClient.sendMessage(text, recieverId);
      setMessages((prev) => {
        return {
          _id: prev?._id || "  ",
          conversationId: prev?.conversationId || " ",
          messages: [
            ...(prev?.messages || []),
            { message: text, sender: authUser?._id || "" },
          ],
        };
      });
      if (!messages) return;
      updateChatSelected(messages, chatSelected);
    } catch (error) {
      showToast({ message: "Error in sending Messages", type: "ERROR" });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="w-full relative">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message here..."
        className="py-2 w-full px-1 border border-slate-500 outline:none"
      />
      <button
        disabled={loading}
        onClick={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center absolute  top-2 right-1 disabled:bg-gray-500 "
      >
        <IoMdSend aria-disabled={loading} size={"25px"} />
      </button>
    </form>
  );
};

export default MessageInput;
