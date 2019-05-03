import crypto from "crypto";
import Boom from "boom";

import {
  getDatabase,
  findChatById,
  findChatInstanceById,
  findAllChats,
  createChat,
  writeMessage,
  removeChat
} from "../database";

class Chat {
  constructor(chat_id) {
    this.chat_id = chat_id;
  }
}

// try if it works
const getChatId = rawChatId => {
  const userIds = rawChatId.split("-");
  userIds.sort();
  const chat_id = userIds.join("-");

  return chat_id;
};

const getChatList = async () => {
  const db = await getDatabase();
  const chats = await findAllChats(db);

  if (!chats) {
    throw Boom.notFound("chats not found");
  }

  return chats;
};

const addChatId = async (user_id1, user_id2) => {
  const chat_id = `${user_id1}-${user_id2}`;
  await addChat(chat_id);
  return chat_id;
};

const getChat = async chat_id => {
  const db = await getDatabase();
  const chat = await findChatById(db, chat_id);

  if (!chat) {
    throw Boom.notFound("chat not found!");
  }

  return chat;
};

const addChat = async chat_id => {
  const db = await getDatabase();
  const newChat = new Chat(chat_id);

  return createChat(db, newChat);
};

const addMessageToChat = async (chat_id, message) => {
  const db = await getDatabase();
  const chatInstance = await findChatInstanceById(db, chat_id);

  if (!chatInstance) {
    throw Boom.notFound("chat not found!");
  }

  const newMessage = await writeMessage(chatInstance, message);

  return newMessage;
};

const deleteChat = async chat_id => {
  const db = await getDatabase();
  const chat = await findChatById(db, chat_id);

  if (!chat) {
    throw Boom.notFound("chat not found!");
  }

  await removeChat(db, chat_id);
  const removedChat = await findChatById(db, chat_id);

  if (removedChat) {
    throw Boom.badImplementation(
      `chat with chat_id: ${chat_id} could not be removed`
    );
  }

  return chat_id;
};

const pre_getChatId = async (request, h) => {
  const db = await getDatabase();
  const chat_id = getChatId(request.params.chat_id);

  const chatIdExists = await findChatById(db, chat_id);
  if (!chatIdExists) {
    const chat = { chat_id, messages: [] };
    const newChat = await createChat(db, chat);
    return h.response(newChat.chat_id);
  }

  return h.response(chat_id);
};

export {
  getChatList,
  getChat,
  addChat,
  addMessageToChat,
  deleteChat,
  pre_getChatId
};
