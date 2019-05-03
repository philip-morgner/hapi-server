"use-strict";

const findChatById = async (db, chat_id) => {
  const chatInstance = await findChatInstanceById(db, chat_id);
  return chatInstance.value();
};

const findChatInstanceById = (db, chat_id) => {
  return db.get("chats").find({ chat_id });
};

const findAllChats = db => {
  return db.get("chats").value();
};

const createChat = async (db, newChat) => {
  return db
    .get("chats")
    .push(newChat)
    .last()
    .write();
};

const writeMessage = (chatInstance, message) => {
  return chatInstance
    .get("messages")
    .push(message)
    .last()
    .write();
};

const removeChat = (db, chat_id) => {
  db.get("chats")
    .remove({ chat_id })
    .write();
};

export {
  findChatById,
  findChatInstanceById,
  findAllChats,
  createChat,
  writeMessage,
  removeChat
};
