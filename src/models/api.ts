import {
  DBCreateUser,
  DBUser,
  DBCreateChat,
  DBChat,
  DBCreateMessage,
  DBMessage,
} from "./db";

export type APICreateUser = DBCreateUser;
export type APIUser = Omit<DBUser, "password">;
export type APICreateChat = DBCreateChat;
export type APIChat = DBChat;
export type ApiCreateMessage = DBCreateMessage;
export type ApiMessage = DBMessage;
