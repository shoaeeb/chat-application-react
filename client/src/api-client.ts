import { RegisterFormData } from "./pages/Register";
import { LoginFormData } from "./pages/Login";
import { MessageType } from "./Context/AppContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Unable to logout");
  }
  return response.json();
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/validate-token`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Bad Request");
  }
  const responseBody = await response.json();
  return responseBody;
};

export const Register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.errors);
  }
  return responseBody;
};

export const login = async (formData: LoginFormData) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.errors);
  }
  return responseBody;
};

export type UserType = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  profilePic: string;
};

export const getUserProfile = async (username: string): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/profile/${username}`, {
    method: "GET",
    credentials: "include",
  });

  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error("Something Went Wrong");
  }
  return responseBody;
};

// messages/conversations/:otherUserId

export type ConversationType = {
  _id: string;
  participants: string[];
  lastMessage: string;
  sender: string;
};

export const getConversation = async (): Promise<ConversationType[]> => {
  const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
    method: "GET",
    credentials: "include",
  });
  return response.json();
};

export const getMyProfile = async (): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/my-profile`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
};

export const getMessages = async (
  conversationId: string
): Promise<MessageType> => {
  const response = await fetch(`${API_BASE_URL}/messages/${conversationId}`, {
    method: "GET",
    credentials: "include",
  });
  const responseBody = await response.json();
  return responseBody;
};

export const sendMessage = async (message: string, reciepientId: string) => {
  const response = await fetch(`${API_BASE_URL}/messages/${reciepientId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error("Failed to send message");
  }
  return responseBody;
};

export const updateProfile = async (id: string, data: any) => {
  const res = await fetch(`${API_BASE_URL}/profile/${id}`, {
    credentials: "include",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseBody = await res.json();
  if (!res.ok) {
    throw new Error(responseBody.errors);
  }
  return responseBody;
};

export const suggestedUser = async (): Promise<UserType[]> => {
  const response = await fetch(`${API_BASE_URL}/suggested-user`, {
    method: "GET",
    credentials: "include",
  });
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return responseBody;
};
