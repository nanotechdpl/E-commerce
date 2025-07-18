import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import type { TConversation } from "../types";

export const useChatContext = () => {
  const { state, dispatch } = useContext(ChatContext);
  const { receiverId } = state;

  const messages = React.useMemo(() => state.messages, [state.messages]);

  const updateSearch = React.useCallback(
    (query: string) => {
      dispatch({
        type: "UPDATE_STATE",
        payload: {
          filter: {
            ...state.filter,
            query,
          },
        },
      });
    },
    [dispatch, state.filter]
  );

  const resetFilter = React.useCallback(() => {
    dispatch({
      type: "RESET",
    });
  }, [dispatch]);

  const updateReceiverId = React.useCallback(
    (userId: string) => {
      dispatch({
        type: "UPDATE_STATE",
        payload: { receiverId: userId },
      });
    },
    [dispatch]
  );

  const updateIsChatSelect = React.useCallback(
    (isSelect: boolean) => {
      dispatch({
        type: "UPDATE_STATE",
        payload: { isChatUserSelect: isSelect },
      });
    },
    [dispatch]
  );

  const updateIsSidebar = React.useCallback(
    (isOpen: boolean) => {
      dispatch({
        type: "UPDATE_STATE",
        payload: { isSidebarOpen: isOpen },
      });
    },
    [dispatch]
  );

  const updateSelectedUser = React.useCallback(
    (user: TConversation) => {
      dispatch({
        type: "UPDATE_STATE",
        payload: { selectedUser: user },
      });
    },
    [dispatch]
  );

  return {
    messages,
    updateSearch,
    resetFilter,
    updateReceiverId,
    receiverId,
    updateIsChatSelect,
    updateIsSidebar,
    updateSelectedUser,
    selectedUser: state.selectedUser,
  };
};
