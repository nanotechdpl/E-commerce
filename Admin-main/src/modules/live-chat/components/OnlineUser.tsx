"use client";

import { Circle, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useChatContext } from "../hooks/useChatContext";
import type { TConversation, TUser } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export const OnlineUser = () => {
  const { updateReceiverId, updateIsChatSelect, updateSelectedUser } =
    useChatContext();
  // const {state} = useContext(ChatContext)
  const authStore = useSelector((state: RootState) => state.auth.user);
  const loggedUserId = authStore?.id;
  const [onlineUsers, setOnlineUsers] = useState<TUser[]>([]);
  const [query, setQuery] = useState<string>("");
  const [isSearchSelected, setIsSearchSelected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  const fetchOnlineUsers = useCallback(async (search = "") => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `http://localhost:7000/api/v1/users`
      );
      // `http://localhost:8000/api/users?query=${search}&loggedUserId=${loggedUserId}`
      setIsLoading(false);
      const data = await res.json();
      console.log(data);
      // The backend returns { users: [...], message: "...", status: 200 }
      // We need to extract the users array
      setOnlineUsers(data.users || []);
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to fetch users:", error);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchOnlineUsers();
  }, [fetchOnlineUsers]);

  // Fetch when debounced query changes
  useEffect(() => {
    if (isSearchSelected && debouncedQuery !== "") {
      fetchOnlineUsers(debouncedQuery);
    }
  }, [debouncedQuery, fetchOnlineUsers, isSearchSelected]);

  const handleClick = (isUser: TUser | null) => {
    if (!isUser) return;
    // For now, we'll use the user's _id as the receiverId
    // This is a temporary fix since the live chat functionality is incomplete
    updateReceiverId(isUser._id);
    updateIsChatSelect(true);
    // Convert TUser to TConversation format for the chat context
    const conversationUser: TConversation = {
      senderId: isUser._id,
      senderName: isUser.name,
      serviceType: isUser.role,
      conversationId: `conv_${isUser._id}`,
      createdAt: isUser.createdAt,
      updatedAt: isUser.updatedAt
    };
    updateSelectedUser(conversationUser);
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex justify-between">
        <div className="flex items-center space-x-2 mb-3">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Online Users
          </span>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
            {onlineUsers.length}
          </span>
        </div>
        <button
          onClick={() => {
            setIsSearchSelected(!isSearchSelected);
            setQuery(""); // reset search on toggle
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          {isSearchSelected ? "Cancel" : "Search"}
        </button>
      </div>

      {isSearchSelected && (
        <div className="flex items-center space-x-2 mb-3">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            onClick={() => fetchOnlineUsers(query)}
            className="text-gray-500 hover:text-gray-700"
          >
            Search
          </button>
        </div>
      )}

      <div className="space-y-2 h-[80vh] overflow-y-auto">
        {onlineUsers.map((user) => (
          <div
            onClick={() => handleClick(user)}
            key={user?._id}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <Circle className="absolute -bottom-0.5 -right-0.5 w-3 h-3 text-green-500 fill-current" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-medium text-gray-700">
                {user?.name || "Unknown"}
              </h4>
              <h4 className="text-xs flex gap-5 justify-between items-center">
                <span className="text-blue-600 font-medium">
                  {user?.email || "No email"}
                </span>
                <span className="text-gray-500">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleTimeString(
                    "en-us",
                    {
                      hourCycle: "h12",
                    }
                  ) : "Unknown time"}
                </span>
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
