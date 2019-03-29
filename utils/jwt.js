"use-strict";

import jwt from "jsonwebtoken";

const secret = "NeverShareYourSecret";

function createToken(user) {
  let scopes;
  // Check if the user object passed in
  // has admin set to true, and if so, set
  // scopes to admin
  if (user.admin) {
    scopes = "admin";
  }
  // Sign the JWT
  return jwt.sign(
    { user_id: user.user_id, username: user.username, scope: scopes },
    secret,
    { algorithm: "HS256", expiresIn: "1h" }
  );
}
module.exports = createToken;
