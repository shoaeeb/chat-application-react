import { useEffect, useState } from "react";
import Chat from "./Chat";
import * as apiClient from "../api-client";
import { useAppContext } from "../Context/AppContext";

const Chats = () => {
  const [searching, setSearching] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { authUser, showToast, chatSelected } = useAppContext();
  const [conversations, setConversations] = useState<
    apiClient.ConversationType[]
  >([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const conversations = await apiClient.getConversation();
        setConversations(conversations);
        console.log(conversations);
      } catch (error: any) {
        console.log(error);
        showToast({ message: error.message, type: "ERROR" });
      }
    };
    fetchConversations();
  }, [chatSelected?.sender, chatSelected?.lastMessage]);

  const handleSearch = async () => {
    setSearching(true);
    try {
      const user = await apiClient.getUserProfile(searchText);
      if (user._id === authUser?._id)
        return showToast({
          message: "You can't message yourself",
          type: "ERROR",
        });
      if (user) {
        const response = {
          _id: "",
          participants: [authUser?._id || " ", user._id],
          lastMessage: "",
          sender: "",
        };
        console.log(response);
        setConversations((prev) => {
          const existingConversation = prev.find((conversation) =>
            conversation.participants.includes(user._id)
          );
          if (existingConversation) return prev;
          return [response, ...prev];
        });
      }
    } catch (error: any) {
      console.log(error);
      showToast({ message: error.message, type: "ERROR" });
    } finally {
      setSearching(false);
    }
  };
  return (
    <div className="flex flex-col gap-2 border shadow max-h-[calc(100vh-80px)] h-screen overflow-y-auto">
      <div className="border border-slate-500 px-2 py-1">
        <form>
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            type="search"
            placeholder="Search Profile by UserName"
            className="w-full px-1 py-1 border border-slate-500"
          />
          <button
            onClick={async (e) => {
              e.preventDefault();
              handleSearch();
            }}
            disabled={searching}
            className="bg-blue-500 text-white px-5 py-1 disabled:bg-gray-500"
            type="submit"
          >
            Search
          </button>
        </form>
      </div>
      {conversations.map(
        (conversation: apiClient.ConversationType, index: number) => (
          <Chat conversation={conversation} key={conversation._id || index} />
        )
      )}
    </div>
  );
};

export default Chats;
