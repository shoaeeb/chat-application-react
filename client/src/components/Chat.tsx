import { TiTick } from "react-icons/ti";
import { TiTickOutline } from "react-icons/ti";
import * as apiClient from "../api-client";
import { useEffect, useState } from "react";
import { useAppContext } from "../Context/AppContext";
import { useSocketContext } from "../Context/SocketContext";

type Props = {
  conversation: apiClient.ConversationType;
};

const Chat = ({ conversation }: Props) => {
  const [user, setUser] = useState<apiClient.UserType | undefined>(undefined);
  const { authUser, setChatSelected } = useAppContext();
  const otherUserId = conversation.participants.filter(
    (id) => id !== authUser?._id
  )[0];
  const { onlineUsers } = useSocketContext();

  const isUserOnline = onlineUsers.find(
    (onlineUser) => onlineUser === otherUserId.toString()
  );
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await apiClient.getUserProfile(otherUserId);
        setUser(response);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUser();
  }, [authUser?._id]);

  const noConversation = conversation.sender === "";
  const lastMessageSentByAuthUser = conversation.sender === authUser?._id;
  return (
    <div
      onClick={() => {
        setChatSelected(conversation);
        console.log(conversation);
      }}
      className="border flex gap-2 border-black"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
          <img
            src={user?.profilePic}
            width={"60px"}
            height="15px"
            className="rounded-full"
          />
          {/* online badge */}

          {isUserOnline && (
            <div className="bg-green-500 rounded-full absolute bottom-0 right-0 size-4"></div>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-end  sm:w-[156px] md:w-[260px]">
        <h3 className="text-md font-bold">{user?.username}</h3>

        <h1 className="text-sm font-semibold flex items-center">
          {noConversation && "Say Hi"}
          {lastMessageSentByAuthUser && <TiTick />}
          {!lastMessageSentByAuthUser && <TiTickOutline />}
          {conversation.lastMessage}
        </h1>
      </div>
    </div>
  );
};

export default Chat;
