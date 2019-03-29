"use strict";

import { authUserSchema } from "../../schemas/user";
import { verifyCredentials } from "../../middleware/verification";
import { failAction } from "../../utils/validation";
import createToken from "../../utils/jwt";

exports.plugin = {
  name: "authenticate",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "POST",
      path: "/api/users/login",
      config: {
        //  auth false, token only exists after authentication
        auth: false,
        // Check the user's password against the DB (assign: "user" => req.pre.USER)
        pre: [{ method: verifyCredentials, assign: "user" }],
        validate: {
          payload: authUserSchema,
          failAction
        }
      },
      handler: async (request, h) => {
        // If the user's password is correct, we can issue a token.
        // If it was incorrect, the error will bubble up from the pre method

        return h
          .response({
            access_token: createToken(request.pre.user),
            ...request.pre.user
          })
          .type("application/json")
          .header("authorization", request.headers.authorization)
          .code(200);
      }
    });
  }
};
