import bcrypt from "bcrypt";
import Boom from "boom";
import { pathOr } from "ramda";

import { getDatabase, findUserById, findUserByNameOrEmail } from "../database";

const verifyUserExists = async (request, h) => {
  const db = await getDatabase();
  const { user_id } = request.params;
  const user = await findUserById(db, user_id);
  if (user) {
    return h.response(request.params);
  }
  throw Boom.notFound(
    `Verify User Exists: User with ID ${user_id} does not exist!`
  );
};

const verifyUniqueUser = async (request, h) => {
  const db = await getDatabase();
  const { username, email } = request.payload;

  const user = await findUserByNameOrEmail(db, username, email);

  if (user) {
    if (user.username === username) {
      throw Boom.badRequest("Verify Unique User: Username taken");
    }
    if (user.email === email) {
      throw Boom.badRequest("Verify Unique User: Email taken");
    }
  }
  // If everything checks out, send the payload through
  // to the route handler
  return h.response(request.payload);
};

const verifyCredentials = async (request, h) => {
  const { username, email, password } = request.payload;

  const db = await getDatabase();

  const user = await findUserByNameOrEmail(db, username, email);

  if (user) {
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw Boom.badRequest("Verify Credentials: Incorrect password!");
    }
    // If everything checks out, send the user object through
    // to the route handler
    return h.response(user);
  } else {
    throw Boom.badRequest("Verify Credentials: Incorrect username or email!");
  }
};

const verifyImage = async (request, h) => {
  const contentType = pathOr(
    "",
    ["payload", "file", "hapi", "headers", "content-type"],
    request
  );

  if (contentType === "") {
    throw Boom.badRequest(
      "Verify Image: No Image Found, Content Type Appears To Be Empty"
    );
  }
  const type = contentType.split("/");
  const validImageTypes = ["png", "jpg", "svg", "jpeg"];
  const isValid = validImageTypes.some(v => v === type[1]);
  if (type[0] !== "image" || !isValid) {
    throw Boom.badRequest(
      "Verify Image: Image appears to have no type, please provide a valid image type <.png|.jpg|.svg>"
    );
  }
  // pass image type to route handler
  return h.response(type[1]);
};

export { verifyUserExists, verifyUniqueUser, verifyCredentials, verifyImage };
