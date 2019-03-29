import { deleteUser } from "../../middleware/user";

exports.plugin = {
  name: "deleteUser",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "DELETE",
      path: "/api/users/{user_id}",
      handler: async (request, h) => {
        const { user_id } = request.params;
        const deletedId = await deleteUser(user_id);

        return h
          .response({ user_id: deletedId })
          .type("application/json")
          .code(200);
      }
    });
  }
};
