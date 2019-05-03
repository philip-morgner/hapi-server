import crypto from "crypto";
import bcrypt from "bcrypt";
import Boom from "boom";
import fs from "fs";
import glob from "glob";
import path from "path";

import {
  getDatabase,
  findUserById,
  findUserByNameOrEmail,
  findAllUsers,
  createUser,
  assignUser,
  removeUser
} from "../database";
import { hashPassword } from "../utils/bcrypt";

const PUBLIC_DIR = "../server/public";

class User {
  constructor(username, email, password) {
    this.user_id = crypto.randomBytes(10).toString("hex");
    this.username = username;
    this.email = email;
    this.password = password;
    this.hasAvatar = false;
    this.lastAvatarUpdate = 0;
  }
}

const getUserList = async () => {
  const db = await getDatabase();
  const users = await findAllUsers(db);

  if (!users) {
    throw Boom.notFound("users not found");
  }

  return users;
};

const getUser = async user_id => {
  const db = await getDatabase();
  const user = await findUserById(db, user_id);
  if (!user) {
    throw Boom.notFound("user not found!");
  }

  return user;
};

const addUser = async payload => {
  const db = await getDatabase();
  const { username, password, email } = payload;
  // think about try/ catch block structure
  try {
    const hashedPassword = await hashPassword(password);
    const newUser = new User(username, email, hashedPassword);
    const user = await createUser(db, newUser);

    return user;
  } catch (err) {
    throw Boom.badImplementation(err);
  }
};

const updateUser = async (user_id, payload) => {
  const db = await getDatabase();
  const user = await findUserById(db, user_id);

  if (!user) {
    throw Boom.notFound("user not found!");
  }

  const { password } = payload;
  let hashedPassword;

  if (password) {
    hashedPassword = await hashPassword(password);
  }

  const updatedUser = {
    ...payload,
    password: hashedPassword || user.password
  };
  const assignedUser = await assignUser(db, user_id, updatedUser);

  return assignedUser;
};

const deleteUser = async user_id => {
  const db = await getDatabase();
  const userExists = await findUserById(db, user_id);

  if (!userExists) {
    throw Boom.notFound("user not found!");
  }
  await removeUser(db, user_id);

  const removedUser = await findUserById(db, user_id);
  if (removedUser) {
    throw Boom.badImplementation(
      `user with user_id: ${user_id} could not be removed`
    );
  }

  return user_id;
};

const addAvatar = async (user_id, timestamp) => {
  const assignedUser = await updateUser(user_id, {
    hasAvatar: true,
    lastAvatarUpdate: timestamp
  });

  return { lastAvatarUpdate: timestamp };
};

const removeAvatar = async (user_id, timestamp) => {
  const assignedUser = await updateUser(user_id, {
    hasAvatar: false,
    lastAvatarUpdate: timestamp
  });

  return assignedUser;
};

// bring your own validation function
const validateUser = async (decoded, request) => {
  const db = await getDatabase();
  const user = await findUserById(db, decoded.user_id);
  if (!user) {
    return { isValid: false };
  }

  return { isValid: true };
};

const uploadFile = async (userId, file, fileType, type = "avatar") => {
  const timestamp = Date.now();
  const data = file._data;
  const location = path.format({
    root: __dirname,
    dir: PUBLIC_DIR,
    name: type + "_" + userId + "_" + timestamp,
    ext: "." + fileType
  });

  if (!data) {
    throw Boom.badRequest(
      "Upload File: No Data Found, File Appears To Be Empty"
    );
  }

  if (type === "avatar") {
    const fileExists = await findFile(userId, PUBLIC_DIR, "avatar");
    if (fileExists) {
      fs.unlink(fileExists, err => {
        if (err) throw err;
      });
    }
  }

  const resolveWithIdAndTimeStamp = new Promise((resolve, reject) => {
    fs.writeFile(location, data, err => {
      if (err) {
        console.log("err", err);
        reject(err);
      }
      resolve(userId, timestamp);
    });
  }).catch(err => {
    throw Boom.badImplementation("Upload File: something went wrong.");
  });

  return resolveWithIdAndTimeStamp;
};

const findFile = async (userId, dir, type = "avatar") => {
  const validTypes = "@(jpg|png|svg|jpeg)";
  const file = await new Promise((resolve, reject) => {
    let pattern = `/${type}_${userId}_*.${validTypes}`;
    let opts = {};
    if (dir) {
      pattern = dir + pattern;
    } else {
      opts.matchBase = true;
    }
    glob(pattern, opts, (err, matches) => {
      if (err) {
        reject(err);
      }
      resolve(matches[0]);
    });
  }).catch(err => {
    throw Boom.badImplementation("Find File: some glob error");
  });
  // do not crash when avatar does not exist
  if (!file && type !== "avatar") {
    throw Boom.notFound(`Find File: ${type} file does not exist`);
  }
  return file;
};

export {
  getUserList,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  addAvatar,
  removeAvatar,
  validateUser,
  uploadFile,
  findFile
};
