"use-strict";

const findMessageById = async (db, message_id) => {
  const messageInstance = await findMessageInstanceById(db, message_id);
  return messageInstance.value();
};

const findMessageInstanceById = (db, message_id) => {
  return db.get("messages").find({ message_id });
};

const findAllMessages = db => {
  return db.get("messages").value();
};

const findAllMessagesByAuthor = (db, user_id) => {
  return db
    .get("messages")
    .filter(message => message.author_id === user_id)
    .value();
};

const createMessage = async (db, newMessage) => {
  return db
    .get("messages")
    .push(newMessage)
    .last()
    .write();
};

const assignMessage = (messageInstance, updatedMessage) => {
  // check what is returned
  return messageInstance.assign(updatedMessage).write();
};

const removeMessage = (db, message_id) => {
  db.get("messages")
    .remove({ message_id })
    .write();
};

export {
  findMessageById,
  findMessageInstanceById,
  findAllMessages,
  findAllMessagesByAuthor,
  createMessage,
  assignMessage,
  removeMessage
};
