import { updateUser } from "../../middleware/user";
import {
  verifyUniqueUser,
  verifyPassword
} from "../../middleware/verification";
import { updateUserSchema } from "../../schemas/user";
import { failAction } from "../../utils/validation";

exports.plugin = {
  name: "updateUser",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "POST",
      path: "/api/users/{user_id}",
      config: {
        validate: {
          payload: updateUserSchema,
          failAction
        },
        pre: [{ method: verifyUniqueUser }, { method: verifyPassword }]
      },
      handler: async (request, h) => {
        const { user_id } = request.params;
        const updatedUser = await updateUser(
          user_id,
          request.payload.updateUser
        );

        return h
          .response(updatedUser)
          .type("application/json")
          .code(200);
      }
    });
  }
};
