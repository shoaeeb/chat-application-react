import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import * as Dialog from "@radix-ui/react-dialog";
import Chats from "./Chats";
import { Cross2Icon } from "@radix-ui/react-icons";

const NavBar = () => {
  const { isLoggedIn, showToast, authUser, setAuthUser } = useAppContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation(apiClient.logout, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");
      setAuthUser(undefined);

      navigate("/login");
    },
    onError: (error: Error) => {
      console.log(error);
      showToast({ message: error.message, type: "SUCCESS" });
    },
  });

  return (
    <div className="bg-orange-400 px-5 py-5 flex justify-between">
      <div className="flex items-center justify-center px-3">
        {authUser && (
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <img
                src="./icons/hamburger.svg"
                alt="humburger"
                width="40px"
                height="15px"
                className="block md:hidden lg:hidden"
              />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="DialogOverlay" />
              <Dialog.Content className="DialogContent">
                <Chats />
                <Dialog.Close asChild>
                  <button
                    className="IconButton size-2 ml-5 mt-2"
                    aria-label="Close"
                  >
                    <Cross2Icon />
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        )}
        <h1 className="text-2xl font-bold text-white">WeChat</h1>
      </div>
      <div className="px-3  gap-5 flex items-center justify-center  font-bold text-white">
        <Link
          to="/"
          className="text-sm px-2 p-1 hover:bg-orange-200 hover:text-black"
        >
          Home
        </Link>
        {isLoggedIn && (
          <Link to="/profile">
            <span className="text-sm px-2 p-1 hover:bg-orange-200 hover:text-black">
              Profile
            </span>
          </Link>
        )}
        {isLoggedIn && (
          <Link to="/suggested-user">
            <span className="text-sm px-2 p-1 hover:bg-orange-200 hover:text-black">
              Suggested User
            </span>
          </Link>
        )}
        {isLoggedIn && (
          <button
            onClick={() => mutation.mutate()}
            className="text-sm px-2 p-1  hover:bg-orange-200 hover:text-black disabled:bg-gray-500"
            aria-disabled={mutation.isLoading}
            disabled={mutation.isLoading}
          >
            Sign Out
          </button>
        )}
        {!isLoggedIn && (
          <Link
            to="/Sign-in"
            className="text-sm px-2 p-1  hover:bg-orange-200 hover:text-black"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavBar;
