import crypto from "crypto";
import Boom from "boom";

import {
  getDatabase,
  findMessageById,
  findMessageInstanceById,
  findAllMessages,
  findAllMessagesByAuthor,
  createMessage,
  assignMessage,
  removeMessage
} from "../database";

class Message {
  constructor(author_id, message) {
    this.message_id = crypto.randomBytes(10).toString("hex");
    this.message = message;
    this.author_id = author_id || "unknown author";
    this.timestamp = Date.now().toString();
  }
}

const getMessageList = async () => {
  const db = await getDatabase();
  const messages = await findAllMessages(db);

  if (!messages) {
    throw Boom.notFound("messages not found");
  }

  return messages;
};

const getUserMessages = async user_id => {
  const db = await getDatabase();
  return findAllMessagesByAuthor(db, user_id);
};

const getMessage = async message_id => {
  const db = await getDatabase();
  const message = await findMessageById(db, message_id);

  if (!message) {
    throw Boom.notFound("message not found!");
  }

  return message;
};

const addMessage = async payload => {
  const db = await getDatabase();
  const { author_id, message } = payload;
  const newMessage = new Message(author_id, message);
  return createMessage(db, newMessage);
};

const updateMessage = async (message_id, updatedMessage) => {
  const db = await getDatabase();
  const messageInstance = await findMessageInstanceById(db, message_id);

  if (!messageInstance) {
    throw Boom.notFound("message not found!");
  }

  const assignedMessage = await assignMessage(messageInstance, updatedMessage);

  return assignedMessage.message_id;
};

const deleteMessage = async message_id => {
  const db = await getDatabase();
  const message = await findMessageById(db, message_id);

  if (!message) {
    throw Boom.notFound("message not found!");
  }

  await removeMessage(db, message_id);
  const removedMessage = await findMessageById(db, message_id);

  if (removedMessage) {
    throw Boom.badImplementation(
      `message with message_id: ${message_id} could not be removed`
    );
  }

  return message_id;
};

export {
  getMessageList,
  getUserMessages,
  getMessage,
  addMessage,
  updateMessage,
  deleteMessage
};
