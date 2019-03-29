import { updateUser } from "../../middleware/user";
import { verifyUniqueUser } from "../../middleware/verification";
import { updateUserSchema } from "../../schemas/user";

exports.plugin = {
  name: "updateUser",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "POST",
      path: "/api/users/{user_id}",
      config: {
        pre: [{ method: verifyUniqueUser }],
        validate: {
          payload: updateUserSchema
        }
      },
      handler: async (request, h) => {
        const { user_id } = request.params;
        const updatedUser = await updateUser(user_id, request.payload);

        return h
          .response(updatedUser)
          .type("application/json")
          .code(200);
      }
    });
  }
};
