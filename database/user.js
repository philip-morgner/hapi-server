"use-strict";

import { partial } from "ramda";

const findUser = async (db, finder) => {
  const user = await db
    .get("users")
    .find(finder)
    .value();
  return user;
};

const findUserById = (db, user_id) => {
  return findUser(db, { user_id });
};

const findUserByUserName = (db, username) => {
  return findUser(db, { username });
};

const findUserByEmail = (db, email) => {
  return findUser(db, { email });
};

const finderUsernameOrEmail = (username, email, user) =>
  user.email === email || user.username === username;

const findUserByNameOrEmail = async (db, username, email) =>
  findUser(db, partial(finderUsernameOrEmail, [username, email]));

// TODO: change
// find of type: { user_id?, username?, email? }
// const findUser = async (db, find) => {
//   const searchKeys = Object.keys(find).map(key => {
//     return { [key]: find[key] };
//   });

//   const keys = Object.keys(find);
//   const getRealUser = users => users.filter(user => user)[0];
//   const searchOps = keys.map(key => {
//     const dynamicKey = { [key]: find[key] };
//     return findUser(db, dynamicKey);
//   });
//   const user = await Promise.all(searchOps).then(getRealUser);

//   return user;
// };

const findAllUsers = async db => {
  const users = await db.get("users").value();
  return users;
};

const createUser = (db, newUser) => {
  return db
    .get("users")
    .push(newUser)
    .last()
    .write();
};

const assignUser = (db, user_id, updatedUser) => {
  return db
    .get("users")
    .find({ user_id })
    .assign(updatedUser)
    .write();
};

const removeUser = (db, user_id) => {
  db.get("users")
    .remove({ user_id })
    .write();
};

export {
  findUserById,
  findUserByUserName,
  findUserByEmail,
  findUserByNameOrEmail,
  findAllUsers,
  createUser,
  assignUser,
  removeUser
};
