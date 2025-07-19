export type TConversation = {
  senderId: string;
  senderName: string;
  receiverId?: string;
  receiverName?: string;
  serviceType: string;
  conversationId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TUser = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type IFile = {
  image?: string;
  video?: string;
  audio?: string;
  document?: string;
};

export type TMessage = {
  senderId: string;
  senderName: string;
  receiverId?: string;
  receiverName?: string;
  content: string;
  conversationId: string;
  serviceType: string;
  file?: IFile;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TBackendMessage = {
  _id: string;
  sender: string | null;
  visitorId: string | null;
  receiver: string;
  message: string;
  file?: string;
  isSeen: boolean;
  deletedByUser: boolean;
  deletedByAdmin: boolean;
  createdAt: Date;
};

export type State = {
  messages: TMessage[];
  conversations: TConversation[];
  filter: {
    query?: string;
  };

  // userId?: number | string;
  receiverId?: string | null;
  isChatUserSelect?: boolean;
  isSidebarOpen?: boolean;
  selectedUser?: TConversation | null;
};

export type SEtStateAction = {
  type: "SET_STATE";
  payload: State;
};

export type UpdateState = {
  type: "UPDATE_STATE";
  payload: Partial<State>;
};

export type ResetAction = {
  type: "RESET";
};

export type Action = SEtStateAction | UpdateState | ResetAction;
