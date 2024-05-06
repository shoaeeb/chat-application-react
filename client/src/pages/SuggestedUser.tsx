import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../Context/AppContext";
import * as Avatar from "@radix-ui/react-avatar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SuggestedUser() {
  const { isLoggedIn, showToast } = useAppContext();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { data: SuggestedUser, isLoading } = useQuery(
    "getSuggestedUser",
    apiClient.suggestedUser,
    {
      enabled: isLoggedIn,
    }
  );

  const handleSendMessage = async (recipientId: string) => {
    if (!text) return;
    setLoading(true);
    try {
      await apiClient.sendMessage(text, recipientId);
      navigate("/");
    } catch (error) {
      console.log(error);
      showToast({ message: "Something went wrong", type: "ERROR" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex justify-center items-center">
      <div className="shadow px-2 w-full py-1 flex flex-col gap-5 justify-center items-center">
        <h1 className="text-center text-2xl">Suggested User</h1>
        {isLoading
          ? "Loading..."
          : SuggestedUser?.map((user: apiClient.UserType) => {
              return (
                <div className="flex gap-5 items-center ">
                  <Avatar.Root>
                    <Avatar.Image
                      width={100}
                      style={{
                        borderRadius: "50%",
                        height: "80px",
                        width: "80px",
                      }}
                      src={
                        user.profilePic ||
                        "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
                      }
                    />
                    <Avatar.Fallback />
                  </Avatar.Root>
                  <div className="flex flex-col gap-4">
                    <p>{user.username}</p>
                    <button
                      onClick={() => {
                        setText("Hi what is going on?");
                        handleSendMessage(user._id.toString());
                      }}
                      disabled={loading}
                      className="bg-orange-500 border-none  hover:bg-orange-400 disabled:bg-orange-400"
                    >
                      {loading ? "Sending Text" : "Say Hi"}
                    </button>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}

export default SuggestedUser;
