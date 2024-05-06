import Chats from "../components/Chats";
import { GiConversation } from "react-icons/gi";
import MessageInput from "../components/MessageInput";
import { MessageType, useAppContext } from "../Context/AppContext";
import { useSocketContext } from "../Context/SocketContext";
import { useEffect, useRef, useState } from "react";
import * as apiClient from "../api-client";

const Home = () => {
  const { authUser, chatSelected, updateChatSelected } = useAppContext();
  const otherUserId = chatSelected?.participants.filter(
    (user) => user !== authUser?._id
  )[0];

  const [loading, setLoading] = useState(false);
  const { socket } = useSocketContext();
  const [messages, setMessages] = useState<MessageType | undefined>(undefined);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessagesByConversationId = async () => {
      try {
        const conversationId = chatSelected?._id;
        console.log(conversationId);
        if (!conversationId) return setMessages(undefined);
        const response = await apiClient.getMessages(conversationId);
        setMessages(response);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchMessagesByConversationId();
  }, [chatSelected?._id]);

  useEffect(() => {
    socket?.on("newMessage", (newMessage: MessageType) => {
      setMessages(newMessage);
      console.log(newMessage);
      updateChatSelected(newMessage, chatSelected);
    });
  }, [socket]);

  useEffect(() => {
    console.log("Scroll");
    messagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.messages]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-row w-full   ">
      <div className="hidden md:flex ">
        <Chats />
      </div>
      {!chatSelected && (
        <div className="border max-h-[calc(100vh-80px)] h-screen flex-1 flex flex-col items-center justify-center">
          <GiConversation size={"150px"} />
          <p>Select a conversation to start chatting</p>
        </div>
      )}

      {chatSelected && (
        <div className="flex flex-col max-h-[calc(100vh-80px)] w-full justify-between h-screen">
          <div className="flex flex-1 flex-col py-5 px-5 gap-1 max-h-[calc(100vh-80px)] overflow-y-auto w-full]  ">
            {messages?.messages.map((item, index) => (
              <div
                key={index}
                className={`w-full  flex ${
                  item.sender === authUser?._id && " justify-end"
                } `}
              >
                <p
                  ref={
                    index === messages?.messages.length - 1 ? messagesRef : null
                  }
                  className={`text-xs ${
                    item.sender === authUser?._id
                      ? " bg-blue-400"
                      : "bg-red-400"
                  }    text-white p-2 w-[250px] rounded-md`}
                >
                  {item.message}
                </p>
              </div>
            ))}
          </div>
          <div>
            <MessageInput
              messages={messages}
              authUser={authUser}
              recieverId={otherUserId}
              setMessages={setMessages}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
