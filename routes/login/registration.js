"use strict";

import { addUser } from "../../middleware/user";
import { verifyUniqueUser } from "../../middleware/verification";
import { createUserSchema } from "../../schemas/user";
import { failAction } from "../../utils/validation";
import createToken from "../../utils/jwt";

exports.plugin = {
  name: "registerUser",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "POST",
      path: "/api/users",
      config: {
        //  auth false, token only exists after registration
        auth: false,
        // Before the route handler runs, verify that the user is unique
        pre: [{ method: verifyUniqueUser }],
        validate: {
          payload: createUserSchema,
          failAction
        }
      },
      handler: async (request, h) => {
        const user = await addUser(request.payload);

        return h
          .response({ access_token: createToken(user), ...user })
          .type("application/json")
          .code(201);
      }
    });
  }
};
